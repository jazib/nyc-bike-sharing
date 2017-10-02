import React from "react";
import PropTypes from "prop-types";
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, VerticalBarSeries, XAxis, YAxis, Hint} from 'react-vis';
import RadialChart from "react-vis/es/radial-chart/index";


// https://stackoverflow.com/a/1484514/1167918
const getRandomColor = () => {
    let letters = '0123456789ABCDEF',
        color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export default class CurrentUsageChart extends React.Component {

    static propTypes = {
        jsonData: PropTypes.any,
        selectedStation: PropTypes.any,
        isStationSelected: PropTypes.bool,
    };

    static defaultProps = {
        jsonData: {timeStamp: 0, dataArr: []}
    };

    constructor(props) {
        super(props);
        this.state = {
            value: null,
            hintValue: null,
        };
    }

    forgetValue = () => {
        this.setState({
            value: null,
            hintValue: null,
        }, () => {
            console.log("Forgetting value" + this.state.value)
        });
    };

    rememberValue = (value) => {
        let dataObj = this.props.jsonData.dataArr[value.x];
        this.setState({
            value: value,
            hintValue: {
                name: dataObj.stationInfo.name,
                x: value.x,
                y: value.y
            }
        });
    };


    getBikesBeingUsed = (dataSet) => {
        let stationInfo = dataSet.stationInfo,
            stationStatus = dataSet.stationStatus;
        return stationInfo.capacity - (stationStatus.num_bikes_available + stationStatus.num_bikes_disabled);  // assuming bikes that are not available are being used or are disabled
    };

    buildPiechartData = () => {
        let selectedStation = this.props.selectedStation,
            stationStatus = selectedStation.stationStatus,
            bikesAvailable = stationStatus.num_bikes_available,
            bikesBeingUsed = selectedStation.capacity - (stationStatus.num_bikes_available + stationStatus.num_bikes_disabled);
        return [
            {
                label: "Bikes Available(" + bikesAvailable + ")",
                angle: bikesAvailable
            },
            {
                label: "Bikes Being Used(" + bikesBeingUsed + ")",
                angle: bikesBeingUsed
            },
        ];
    };

    render() {
        if (this.props.jsonData.dataArr.length === 0) {
            return "";
        }
        const stationsData = this.props.jsonData.dataArr.map((dataSet, index) => {
            return (
                {
                    x: index,
                    y: this.getBikesBeingUsed(dataSet),
                    color: getRandomColor(),
                }
            );
        });

        const piechartData = this.props.selectedStation ? this.buildPiechartData() : [];


        return (
            <div className="CurrentUsageChart">
                {
                    !this.props.isStationSelected ?
                        <XYPlot height={500} width={1000} colorType="category">
                            <VerticalBarSeries data={stationsData}
                                               onValueMouseOver={this.rememberValue}
                                               onValueMouseOut={this.forgetValue}
                                               animation
                            />
                            <XAxis title="Number of Stations"/>
                            <YAxis title="Bikes being used"/>
                            {this.state.value ? (<Hint value={this.state.hintValue}>
                                    <div className="rv-hint__content">
                                        Station: {this.state.hintValue.name}
                                        <br/>
                                        Free Bikes: {this.state.hintValue.y}
                                    </div>
                                </Hint>
                            ) : null}
                        </XYPlot>
                        :
                        <RadialChart
                            data={piechartData}
                            width={300}
                            height={300}
                            showLabels={true}
                        />
                }


            </div>


        )
    }
}