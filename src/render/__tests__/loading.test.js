import React from "react";
import ReactDOM from "react-dom";


import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Loading from "../loading";

Enzyme.configure({ adapter: new Adapter() });

describe('Loading Function', () => {
    it("renders", () => {
        let wrapper = shallow(<Loading/>);
    });


})
