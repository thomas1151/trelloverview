import React from "react";
import ReactDOM from "react-dom";


import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderCardFn from "../card";

Enzyme.configure({ adapter: new Adapter() });

describe('Card Rendering function', () => {
    const exampleBoard = { name: 'Test board' };
    const exampleList = { name: 'List' };
    const exampleLabels = [
        {id: 1, name: 'Label 1', borderColor: '000000'},
        {id: 2, name: 'Label 2', borderColor: '000000'},
        {id: 3, name: 'Label 3', borderColor: '000000'},
    ]
    const exampleCard = { labels: exampleLabels, color: '000000' }

    it("renders and renders no labels when given card with no labels, board data and list", () => {
        let card = {labels: [], color: '000000'}
        let wrapper = shallow(renderCardFn(card, exampleBoard, exampleList));

        expect(wrapper.find('.labels').children()).toHaveLength(0);
    });

    it("renders with 3 labels when given card with 3 labels (key given), board data and list", () => {
        let wrapper = shallow(renderCardFn(exampleCard, exampleBoard, exampleList));
        expect(wrapper.find('.labels').children()).toHaveLength(exampleLabels.length);
    });

    it("renders with 2 labels when given card with 2 labels (key NOT given), board data and list", () => {
        let card = { labels: [{name:'Label 1 (no label', borderColor: '000000'}, {name: 'Label 2', borderColor: '000000'}], color: '000000' }
        let wrapper = shallow(renderCardFn(card, exampleBoard, exampleList));

        expect(wrapper.find('.labels').children()).toHaveLength(2);
    });

})
