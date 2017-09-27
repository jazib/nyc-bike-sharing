import React from 'react';
import PropTypes from 'prop-types';
import GoogleMap from 'google-map-react';

function Station(props) {
    return (
        <div style={{
            borderRadius: '50%',
            position: 'relative', color: 'white', background: props.color,
            height: 8, width: 8
        }}>
            {props.value}
        </div>
    );
}
export default class MapController extends React.Component {

    static propTypes = {
        center: PropTypes.array,
        zoom: PropTypes.number,
        jsonData: PropTypes.any
    };

    static defaultProps = {
        center: [40.74177603, -74.00149746],
        zoom: 12,
        jsonData: {data: {stations: []}},
    };

    getMarkerColor = (data) => {
        let percentage = parseInt(data.stationStatus.num_bikes_available) / parseInt(data.stationInfo.capacity);
        switch(true) {
            case percentage > 0.75:
                return "green";
            case  0.5 < percentage < 0.75:
                return "blue";
            case percentage < 0.5:
                return "orange";
            default:
                return "red";
        }
    }

    render() {
        if (this.props.jsonData.length === 0) {
            return "Loading Data...";
        }
        const stations = this.props.jsonData.map((dataSet) => {
            let stationInfo = dataSet.stationInfo;
            return (
                <Station
                    key={parseInt(stationInfo.station_id)}
                    lat={stationInfo.lat}
                    lng={stationInfo.lon}
                    color={this.getMarkerColor(dataSet)}
                    text={stationInfo.name}
                />
            );
        });
        return (
            <GoogleMap
                // apiKey={YOUR_GOOGLE_MAP_API_KEY} // set if you need stats etc ...
                center={this.props.center}
                zoom={this.props.zoom}
            >
                {stations}
            </GoogleMap>
        );
    }
}