import React from 'react';
import PropTypes from 'prop-types';
import GoogleMap from 'google-map-react';

import './MapController.css';
import Station from "./Station";


export default class MapController extends React.Component {

    static propTypes = {
        center: PropTypes.array,
        zoom: PropTypes.number,
        jsonData: PropTypes.any,
        selectedStationId: PropTypes.string,
    };

    static defaultProps = {
        center: [40.74177603, -74.00149746],
        zoom: 12,
        jsonData: {data: {stations: []}},
        selectedStationId: "",
    };

    getMarkerColor = (data) => {
        let percentage = parseInt(data.stationStatus.num_bikes_available, 10) / parseInt(data.stationInfo.capacity, 10);
        switch (true) {
            case percentage > 0.75:
                return "green";
            case  percentage > 0.5 && percentage < 0.75:
                return "blue";
            case percentage < 0.5:
                return "orange";
            default:
                return "red";
        }
    };

    render() {
        const stations = this.props.jsonData.map((dataSet) => {
            let stationInfo = dataSet.stationInfo;
            return (
                <Station
                    key={parseInt(stationInfo.station_id, 10)}
                    lat={stationInfo.lat}
                    lng={stationInfo.lon}
                    color={this.getMarkerColor(dataSet)}
                    isSelected={dataSet.stationInfo.station_id === this.props.selectedStationId}
                    text={stationInfo.name}
                />
            );
        });
        return (
            <div className="MapController">
                <GoogleMap
                    center={this.props.center}
                    zoom={this.props.zoom}
                >
                    {stations}
                </GoogleMap>
            </div>
        );
    }
}