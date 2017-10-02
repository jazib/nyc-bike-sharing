import Autosuggest from 'react-autosuggest';
import React from 'react';
import PropTypes from 'prop-types';

// Teach Autosuggest how to calculate suggestions for any given input value.

const renderSuggestion = suggestion => (
    <div>
        {suggestion.name}
    </div>
);

export default class SearchInput extends React.Component {

    static propTypes = {
        onStationSelected: PropTypes.func,
    };

    static defaultProps = {};


    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: [],
        };
    }

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0 ? [] : this.props.options.filter(station =>
            station.name.toLowerCase().slice(0, inputLength) === inputValue
        );
    };

    getSuggestionValue = suggestion => {
        return suggestion.name;
    };

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    onSuggestionSelected = (event, {suggestion, suggestionValue, suggestionIndex, sectionIndex, method}) => {
        this.props.onStationSelected(suggestion);
    };


    render() {
        const {value,suggestions} = this.state;

        const inputProps = {
            placeholder: 'Type a Station Name',
            value,
            onChange: this.onChange
        };

        return (
            <Autosuggest
                className="form-control"
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                onSuggestionSelected={this.onSuggestionSelected}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}