import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import chai, { expect } from 'chai';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// initial smoke test
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});


const container = shallow(<App />);

describe('tests for <App> container', () => {
    it('should render one div', () => {
        expect(container.find('div').length).to.equal(1);
    });

    it('should render one div with the correct class applied', () => {
        expect(container.find('div').hasClass('container')).to.equal(true);
    });

});
