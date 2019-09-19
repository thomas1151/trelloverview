import React from 'react';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { renderHook, act } from '@testing-library/react-hooks'
import useCustomMapData from '../useCustomMapData';
import SampleUseCustomMapComponent from '../samples/useCustomMapComponent';

describe('useCustomMapData hook', () => {
    let useCustomMapDataHook;
    const mapFn = (arr) => arr;
    const renderFn = (x) => <div>{x.id}</div>
    let data;
    beforeEach( () => {
        data = [
            { id: 1 },
            { id: 2 },
            { id: 3 }
        ] 
    })
    it('renders given empty dataset', () => {
        data = []
        useCustomMapDataHook = renderHook(() =>
            useCustomMapData(data, mapFn, SampleUseCustomMapComponent, renderFn)
        )
        expect(useCustomMapDataHook.result.current).toHaveLength(data.length)
    })

    it('renders given dataset', () => {
        useCustomMapDataHook  = renderHook(() => 
            useCustomMapData(data, mapFn, SampleUseCustomMapComponent, renderFn)
        )
        expect(useCustomMapDataHook.result.current).toHaveLength(data.length)
    })
})