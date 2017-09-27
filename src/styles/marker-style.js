const K_SIZE = 10;

const markerStyle = {
    // initially any map object has left top corner at lat lng coordinates
    // it's on you to set object origin to 0,0 coordinates
    position: 'relative',
    width: '10px',
    height: '10px',
    left: -K_SIZE / 2,
    top: -K_SIZE / 2,

    borderRadius: '50%',
    color: 'white',
    background: 'red',
    border: '5px solid #f44336',
    backgroundColor: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
    cursor: 'pointer'
};

const markerStyleHover = {
    ...markerStyle,
    border: '5px solid #3f51b5',
    color: '#f44336'
};

export {markerStyle, markerStyleHover, K_SIZE};