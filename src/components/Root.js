import React from 'react';
import ChartComponent from "./ChartComponent";
import MapComponent from "./MapComponent";

export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stationsData: {timeStamp: 0, dataArr: []},
        };
    }

    fetchFreshData = () => {
        console.log("Fetching fresh data");
        let stationInfoPromise = fetch('https://gbfs.citibikenyc.com/gbfs/en/station_information.json'),
            stationStatusPromise = fetch('https://gbfs.citibikenyc.com/gbfs/en/station_status.json');
        Promise.all([stationInfoPromise, stationStatusPromise])
            .then((response) => {
                return Promise.all(response.map((res) => res.json()));
            }).then((responses) => {
            // we have both responses in json form by now!
            this.processData(responses);
            setTimeout(this.fetchFreshData, 60*1000);  // poll for each minute (could have used ttl here, but not specific to use case)

        }).catch((error) => {
            console.log("Error" + error);
        })
    };

    componentDidMount() {
        this.fetchFreshData();
    }

    processData = (responses) => {
        let stationInfoArr = responses[0].data.stations,
            stationStatusArr = responses[1].data.stations,
            newDataSet = {timeStamp: responses[0].last_updated, dataArr: []};
        if (stationStatusArr.length <= stationInfoArr.length) {
            for (let i = 0; i < stationStatusArr.length; i++) {
                let stationInfo = stationInfoArr[i],
                    stationStatus = stationStatusArr[i];
                if (stationInfo.station_id !== stationStatus.station_id) {
                    console.warn("Warning! Results are not in sync.");
                    continue;
                }
                newDataSet.dataArr.push({
                    stationInfo: stationInfo,
                    stationStatus: stationStatus
                })
            }
        }
        this.setState({
            stationsData: newDataSet
        })
    };

    render() {
        return (
            <div className="Root">
                <h1> Map </h1>
                <MapComponent jsonData={this.state.stationsData} />
                 <h1> Charts </h1>
                <ChartComponent jsonData={this.state.stationsData}/>
            </div>
        );
    }
}