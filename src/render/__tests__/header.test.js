import React from "react";
import ReactDOM from "react-dom";


import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderHeaderFn from "../header";
import { shallowToJson } from 'enzyme-to-json';

Enzyme.configure({ adapter: new Adapter() });

describe('Header Rendering function', () => {
    const stages = ['testInitialStage', 'secondaryStage', 'testStage'];
    let stage = '';
    let stageAsTitle = '';
    let setStage = jest.fn;
    let logOut = jest.fn;
    let restart = jest.fn;
    it("renders with no valid stage", () => {
        let card = { labels: [], color: '000000' }
        let stages = [];

        expect(shallowToJson(shallow(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart)))).toMatchSnapshot();
    });
    it("renders with a valid stage which is initial stage", () => {
        let card = { labels: [], color: '000000' }
        let stage = 'testInitialStage';

        expect(shallowToJson(shallow(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart)))).toMatchSnapshot();
    });

    it("renders with a valid second stage", () => {
        let card = { labels: [], color: '000000' }
        let stage = 'secondaryStage';

        expect(shallowToJson(shallow(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart)))).toMatchSnapshot();
    });



    it("renders with a valid stage which is not the initial or secondary stage", () => {
        let card = { labels: [], color: '000000' }
        let stage = 'testStage';

        expect(shallowToJson(shallow(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart)))).toMatchSnapshot();
    });

    it("clicks logOut and fires logout function", () => {
        stage = "testStage";
        const wrapper = mount(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart));
        // expect(wrapper).toEqual('wwww');
        wrapper.find('#logoutButton').simulate('click', { preventDefault() { } });
    })

    it("clicks back and fires back function", () => {
        stage = "testStage";
        const wrapper = mount(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart));
        // expect(wrapper).toEqual('wwww');
        wrapper.find('#backButton').simulate('click', { preventDefault() { } });

    })

    it("clicks restart and fires restart function", () => {
        stage = "testStage";
        const wrapper = mount(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart));
        // expect(wrapper).toEqual('wwww');
        wrapper.find('#restartButton').simulate('click', { preventDefault() { } });

    })
    
    // it("calls the logout function and returns" () => {
    //     let card = { labels: [], color: '000000' }
    //     let stages = ['testInitialStage', 'testStage'];
    //     let stage = 'testStage';
    //     let stageAsTitle = '';
    //     let setStage = '';
    //     let logOut = '';
    //     let restart = '';
    //     expect(shallowToJson(shallow(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart)))).toMatchSnapshot();
    // });
})
