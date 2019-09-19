import React from 'react';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { renderHook, act } from '@testing-library/react-hooks'
import useGetData from '../useGetData';
import SampleUseCustomMapComponent from '../samples/useCustomMapComponent';
import Loading from '../../render/loading';

//error, isLoading, data, renderComponent = DefaultComponent, renderFn = defaultRenderFn, mapFn = defaultMapFn, additionalProps
describe('useGetData hook', () => {
    let useGetDataHook;
    let data;
    let error;
    let isLoading;
    
    const mapFn = (arr) => arr;
    const renderFn = (x) => <div>{x.id}</div>
    beforeEach(() => {
        data = [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ]
        error  = false;
        isLoading = false;
    })
    it('shows data when not loading or errored', () => {
        useGetDataHook = renderHook(() =>
            useGetData(error, isLoading, data, SampleUseCustomMapComponent, renderFn, mapFn)
        )
        let w = shallow(<div>{useGetDataHook.result.current}</div>)
        expect(w.children()).toHaveLength(data.length)
    })

    it('shows loading when isLoading', () => {
        isLoading = true;
        useGetDataHook = renderHook(() =>
            useGetData(error, isLoading, data, SampleUseCustomMapComponent, renderFn, mapFn)
        )
        let w = mount(useGetDataHook.result.current)
        expect(w.matchesElement(<Loading />)).toEqual(true)
    })

    it('shows error when errored', () => {
        error = new Error("Too cool 4 school");
        useGetDataHook = renderHook(() =>
            useGetData(error, isLoading, data, SampleUseCustomMapComponent, renderFn, mapFn)
        )
        let w = mount(<div>{useGetDataHook.result.current}</div>)
        expect(w.text()).toEqual(error.toString())
    })

    it('renders when no renderComponent, renderFn, mapFn given', () => {

        useGetDataHook = renderHook(() =>
            useGetData(error, isLoading, data, undefined, undefined, undefined)
        )
        let w = mount(<div>{useGetDataHook.result.current}</div>)
        expect( 
                data.map(d => expect(w.children().find('.item'+d.id)).toBeTruthy()  )
        )
    })
})