import React from "react";
import ReactDOM from "react-dom";


import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderHeaderFn from "../header";
import { shallowToJson } from 'enzyme-to-json';

Enzyme.configure({ adapter: new Adapter() });

describe('Header Rendering function', () => {
    it("renders with no valid stage", () => {
        let card = { labels: [], color: '000000' }
        let stages = [];
        let stage = '';
        let stageAsTitle = '';
        let setStage = '';
        let logOut = '';
        let restart = '';
        expect(shallowToJson(shallow(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart)))).toMatchSnapshot();
    });
    it("renders with a valid stage which is initial stage", () => {
        let card = { labels: [], color: '000000' }
        let stages = ['testInitialStage', 'testStage'];
        let stage = 'testInitialStage';
        let stageAsTitle = '';
        let setStage = '';
        let logOut = '';
        let restart = '';
        expect(shallowToJson(shallow(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart)))).toMatchSnapshot();
    });

    it("renders with a valid stage which is not the initial stage", () => {
        let card = { labels: [], color: '000000' }
        let stages = ['testInitialStage', 'testStage'];
        let stage = 'testStage';
        let stageAsTitle = ''; 
        let setStage = '';
        let logOut = '';
        let restart = '';
        expect(shallowToJson(shallow(renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart)))).toMatchSnapshot();
    });
    
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
