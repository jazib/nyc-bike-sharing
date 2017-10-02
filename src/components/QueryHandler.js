import React from 'react';
import PropTypes from 'prop-types';
import SearchInput from "./SearchInput";
import {Navbar, FormControl, FormGroup, Button, InputGroup} from "react-bootstrap";

export default class QueryHandler extends React.Component {

    static propTypes = {
        jsonData: PropTypes.any,
        onStationSelected: PropTypes.func,
        onSubmit: PropTypes.func,
        onReset: PropTypes.func,
        showDistance: PropTypes.bool,
    };

    static defaultProps = {
        jsonData: {data: {stations: []}},
        showDistance: true
    };

    constructor(props) {
        super(props);
        this.state = {
            distance: 0,
        }
    }

    handleDistanceChange = event => {
        console.log("Changed" + event.target.value);
        this.setState({
            distance: event.target.value
        });
        this.props.onDistanceChange(parseInt(event.target.value, 10));
    };

    onButtonSubmit = event => {
        this.props.onSubmit();
    };

    onButtonReset = event => {
        this.setState({
            distance: 0,
        });
        this.props.onReset(event);
    };

    render() {
        if (this.props.jsonData.length === 0) {
            return "";
        }
        const stationsArr = this.props.jsonData.slice().map(data => {
            return {
                name: data.stationInfo.name,
                lat: data.stationInfo.lat,
                lon: data.stationInfo.lon,
                station_id: data.stationInfo.station_id,
                url: data.stationInfo.rental_url,
                stationStatus: data.stationStatus,
                capacity: data.stationInfo.capacity
            }
        });
        return (
            <div className="QueryHandler">
                <Navbar>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="javascript:void(0);">Filter Stations</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Navbar.Form>
                            <FormGroup>
                                <SearchInput
                                    options={stationsArr}
                                    onStationSelected={this.props.onStationSelected}
                                />
                            </FormGroup>
                            {this.props.showDistance &&
                            <FormGroup style={{marginLeft: '20px'}}>
                                <InputGroup>
                                    <InputGroup.Addon>in range of </InputGroup.Addon>
                                    <FormControl value={this.state.distance} onChange={this.handleDistanceChange}
                                                 type="text"
                                                 placeholder="Distance"/>
                                    <InputGroup.Addon>km</InputGroup.Addon>
                                </InputGroup>
                            </FormGroup>
                            }
                            {' '}
                            <Button onClick={this.onButtonSubmit} bsStyle="primary" type="submit">Submit</Button>

                            <Button onClick={this.onButtonReset} bsStyle="danger" className="pull-right">
                                Reset </Button>
                        </Navbar.Form>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }


}
