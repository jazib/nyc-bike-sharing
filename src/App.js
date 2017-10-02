import React, {Component} from 'react';
import './App.css';
import Root from './components/Root'

class App extends Component {
    render() {
        return (
            <div className={`App container`}>
                <div className="jumbotron">
                    <h1>NYC Bike Sharing Data Visualization</h1>
                    <p>Following is detailed visualization of NYC bike station locations and their current and historical usage </p>
                </div>
                <Root/>
            </div>
        );
    }
}

export default App;
