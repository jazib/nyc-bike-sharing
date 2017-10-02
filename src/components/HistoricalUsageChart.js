import React from "react";
import PropTypes from "prop-types";
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, AreaSeries, MarkSeries, XAxis, YAxis, Hint} from 'react-vis';


export default class HistoricalUsageChart extends React.Component {

    static propTypes = {
        jsonData: PropTypes.any,
        isStationSelected: PropTypes.bool,
        selectedStation: PropTypes.any,
    };

    static defaultProps = {
        isStationSelected: false,
        selectedStation: null,
    };

    constructor(props) {
        super(props);
        this.initialTimeStamp = 0;
        this.state = {
            value: null,
            hintValue: null,
            chartData: [],
            globalData: {},
        };
    }

    getBikesBeingUsed = (dataSet) => {
        let stationInfo = dataSet.stationInfo,
            stationStatus = dataSet.stationStatus;
        return stationInfo.capacity - (stationStatus.num_bikes_available + stationStatus.num_bikes_disabled);  // assuming bikes that are not available are being used or are disabled
    };

    processTimeStampedData = (jsonData) => {

        let timeStamp = jsonData.timeStamp,
            globalStateData = this.state.globalData,
            totalBeingUsed = 0;
        if (this.state.chartData.length === 0) {
            this.initalTimeStamp = timeStamp;
        }
        jsonData.dataArr.forEach(dataItem => {
            let stationInfo = dataItem.stationInfo,
                bikesInUse = this.getBikesBeingUsed(dataItem);
            totalBeingUsed += bikesInUse;
            if (!globalStateData[[stationInfo.name]]) {
                globalStateData[[stationInfo.name]] = [];
            }

            globalStateData[stationInfo.name].push({
                bikesInUse: bikesInUse,
                timeStamp: timeStamp - this.initalTimeStamp,
            });
        });

        let data = this.state.chartData.slice();
        data.push({
            timeStamp: timeStamp - this.initalTimeStamp,
            totalBeingUsed: totalBeingUsed
        });
        this.setState({
            chartData: data,
            globalData: globalStateData
        })
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.jsonData.timeStamp !== nextProps.jsonData.timeStamp) {
            this.processTimeStampedData(nextProps.jsonData);
        }
    }

    componentWillMount() {
        if (this.state.chartData.length === 0) {
            this.processTimeStampedData(this.props.jsonData);
        }
    }

    forgetValue = () => {
        this.setState({
            value: null,
            hintValue: null,
        });
    };

    rememberValue = (value) => {

        this.setState({
            value: value,
            hintValue: {
                x: Math.round(value.x * 10) / 10,
                y: value.y
            }
        });
    };

    render() {
        if (this.props.jsonData.dataArr.length === 0) {
            return "Compiling Historical Data...";
        }

        const data = this.state.chartData.map((dataSet, index) => {
            return (
                {
                    x: dataSet.timeStamp / 60,
                    y: dataSet.totalBeingUsed,
                }
            );
        });

        const singleStationData = (this.props.selectedStation && this.props.selectedStation.name !== "") ?
            this.state.globalData[this.props.selectedStation.name].map((dataItem, index) => {
                return {
                    x: dataItem.timeStamp / 60,
                    y: dataItem.bikesInUse,
                }
            }) : [];
        const dataToUse = this.props.isStationSelected ? singleStationData : data;
        return (
            <XYPlot margin={{left: 100}} height={500} width={1000} colorType="category">
                <AreaSeries data={dataToUse}
                            curve={'curveMonotoneX'}
                            animation
                />
                <MarkSeries data={dataToUse}
                            onValueMouseOver={this.rememberValue}
                            onValueMouseOut={this.forgetValue}
                />

                <XAxis title="Time"
                       xType='linear'
                />
                <YAxis title="Bikes being used"/>
                {this.state.value ? (<Hint value={this.state.hintValue}>
                        <div className="rv-hint__content">
                            Time: {this.state.hintValue.x} minute
                            <br/>
                            Bikes being used: {this.state.hintValue.y}
                        </div>
                    </Hint>
                ) : null}

            </XYPlot>
        )
    }
}