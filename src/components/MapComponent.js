import React from "react";
import PropTypes from "prop-types";

import MapController from "./MapController";
import QueryHandler from "./QueryHandler";
import Station from "./Station";


export default class MapComponent extends React.Component {

    static propTypes = {
        jsonData: PropTypes.any
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            mapCenter: [40.74177603, -74.00149746],  // new york center
            mapZoom: 12,
            selectedStation: {station_id: ""},
            distance: 0,
            isFiltered: false,
        };
    }

    onStationSelected = station => {
        this.setState({
            selectedStation: station,
        })
    };

    onDistanceChange = distance => {
        this.setState({
            distance: distance,
        })
    };

    onSubmit = event => {
        if (this.state.selectedStation !== null && this.state.distance !== 0) {
            this.setState({
                mapCenter: [this.state.selectedStation.lat, this.state.selectedStation.lon],
                mapZoom: this.calculateMapZoom(),
                isFiltered: true,
            });
        }
    };

    calculateMapZoom = () => {
        return Math.round(14 - Math.log(this.state.distance) / Math.LN2);

    };

    onReset = event => {
        this.setState({
            mapCenter: [40.74177603, -74.00149746],
            mapZoom: 12,
            selectedStation: {station_id: 0},
            isFiltered: false,
        })
    };


    render() {
        if (this.props.jsonData.length === 0) {
            return "Loading Data...";
        }
        const mapData = (!this.state.isFiltered || !this.state.distance || this.state.distance === 0) ?
            this.props.jsonData.dataArr :
            this.props.jsonData.dataArr.filter(data => {
                let stationInfo = data.stationInfo;
                return this.arePointsNear(this.state.mapCenter, [stationInfo.lat, stationInfo.lon], this.state.distance)
            });

        return (
            <div className="MapComponent">
                <QueryHandler jsonData={this.props.jsonData.dataArr.slice()}
                              onStationSelected={this.onStationSelected}
                              onDistanceChange={this.onDistanceChange}
                              onSubmit={this.onSubmit}
                              onReset={this.onReset}
                />
                <div className="row">
                    <div className="col-md-10">
                        <MapController jsonData={mapData.slice()}
                                       center={this.state.mapCenter}
                                       zoom={this.state.mapZoom}
                                       selectedStationId={this.state.selectedStation.station_id}
                        />
                    </div>
                    <div className="col-md-2">
                        <h2> Legend </h2>
                        <div><Station color="red" displayInline={true}/> No Free Bikes </div>
                        <div><Station color="orange" displayInline={true}/> &lt; than 50% free bikes </div>
                        <div><Station color="blue" displayInline={true}/> 50%-75% free bikes </div>
                        <div><Station color="green" displayInline={true}/> &gt; 75% Bikes </div>
                        <div><Station isSelected={true} color="black" displayInline={true}/> Selected Station </div>
                    </div>
                </div>
            </div>
        );
    }

    // https://stackoverflow.com/a/24680708/1167918
    arePointsNear = (centerPoint, checkPoint, km) => {
        let ky = 40000 / 360,
            kx = Math.cos(Math.PI * centerPoint[0] / 180.0) * ky,
            dx = Math.abs(centerPoint[1] - checkPoint[1]) * kx,
            dy = Math.abs(centerPoint[0] - checkPoint[0]) * ky;
        return Math.sqrt(dx * dx + dy * dy) <= km;
    }
}