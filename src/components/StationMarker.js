import React from 'react';
import PropTypes from 'prop-types';
import {markerStyle, markerStyleHover} from '../styles/marker-style';

export default class StationMarker extends  React.Component {

  static propTypes = {
    hover: PropTypes.bool,
    text: PropTypes.string
  };


  render() {
    const style = this.props.hover ? markerStyle : markerStyleHover;

    return (
       <div className="hint hint--html hint--info hint--top" style={style}>
          <div className="hint__content">
          </div>
       </div>
    );
  }
}