import React from "react";
import PropTypes from "prop-types";
import HistoricalUsageChart from "./HistoricalUsageChart";
import QueryHandler from "./QueryHandler";
import CurrentUsageChart from "./CurrentUsageChart";


export default class ChartComponent extends React.Component {

    static propTypes = {
        jsonData: PropTypes.any
    };

    static defaultProps = {
        jsonData: {timeStamp: 0, dataArr: []}
    };

    constructor(props) {
        super(props);
        this.state = {
            isStationSelected: false,
            selectedStation: null,
        }
    }

    onSubmit = event => {
        if (this.state.selectedStation !== null) {
            this.setState({
                isStationSelected: true,
            });
        }
    };

    onReset = (value) => {
        this.setState({
            isStationSelected: false,
            selectedStation: null,
        });
    };

    onStationSelected = station => {
        this.setState({
            selectedStation: station,
        })
    };

    render() {
        if (this.props.jsonData.dataArr.length === 0) {
            return "Loading Data...";
        }
        return (
            <div className={`ChartComponent`}>
                <QueryHandler jsonData={this.props.jsonData.dataArr.slice()}
                              onStationSelected={this.onStationSelected}
                              showDistance={false}
                              onSubmit={this.onSubmit}
                              onReset={this.onReset}
                />
                <h2> Current Usage {this.state.isStationSelected &&
                <a href={this.state.selectedStation.url} target="_blank"> {this.state.selectedStation.name}</a>}
                </h2>
                <CurrentUsageChart jsonData={this.props.jsonData}
                                   isStationSelected={this.state.isStationSelected}
                                   selectedStation={this.state.selectedStation}
                />

                <h2> Historical Usage {this.state.isStationSelected &&
                <a href={this.state.selectedStation.url} target="_blank"> {this.state.selectedStation.name}</a>}
                </h2>
                <HistoricalUsageChart jsonData={this.props.jsonData}
                                      isStationSelected={this.state.isStationSelected}
                                      selectedStation={this.state.selectedStation}
                />
            </div>
        )
    }
}