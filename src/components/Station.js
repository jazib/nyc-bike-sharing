import React from "react";

export default class Station extends React.Component {

    render() {
        const widthHeight = this.props.isSelected ? 16 : 8;

        return (
            <div style={{
                borderRadius: '50%',
                position: 'relative', color: 'white', background: this.props.color,
                height: widthHeight, width: widthHeight,
                display: this.props.displayInline ? 'inline-block' : ''
            }}>
                {this.props.value}
            </div>
        )
    }
}