import React from 'react';
import MapController from "./MapController";

export default class Root extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stationsData: [],
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
            let ttl = Math.min(responses[0].ttl, responses[1].ttl); // assuming most of the times these times will be equal
            if (ttl > 0) {
                setTimeout(this.fetchFreshData, ttl * 1000);
            }
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
            newDataSet = [];
        if (stationStatusArr.length <= stationInfoArr.length) {
            for (let i = 0; i < stationStatusArr.length; i++) {
                let stationInfo = stationInfoArr[i],
                    stationStatus = stationStatusArr[i];
                if (stationInfo.station_id !== stationStatus.station_id) {
                    console.warn("Warning! Results are not in sync.");
                    continue;
                }
                newDataSet.push({
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
            <MapController jsonData={this.state.stationsData}/>
        );
    }
}