import React from "react";
import ReactDOM from "react-dom";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from 'enzyme-to-json';
import SampleUseCustomMapComponent from "../useCustomMapComponent";

Enzyme.configure({ adapter: new Adapter() });

describe('Sample Mapping Component', () => {
    let data = [ {id:1}, {id:2}];
    let key = 1;
    let renderFn = (key, data) => (<div>data</div>);

    it("renders correctly", () => {
        let w = mount(
                    <SampleUseCustomMapComponent data={data} key={key} renderFn={renderFn} />
                )
        expect(
                w.children()
                ).toHaveLength(3);
    });

})
