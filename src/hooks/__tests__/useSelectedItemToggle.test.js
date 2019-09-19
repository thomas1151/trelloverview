import React from 'react';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { renderHook, act } from '@testing-library/react-hooks'
import useSelectedItemToggle from '../useSelectedItemToggle';
import SampleUseCustomMapComponent from '../samples/useCustomMapComponent';

describe('useSelectedItemToggle hook', () => {
    let useSelectedItemToggleHook;
    let item = { 'name': "yo!" }

    it('returns no selected item by default when none is given', () => {
        // data = []
        useSelectedItemToggleHook = renderHook(() =>
            useSelectedItemToggle()
        )
        expect(useSelectedItemToggleHook.result.current.selectedState.selectedItem).not.toBeTruthy()
    })
    it('returns no selected item by default when none is given', () => {
        // data = []
        useSelectedItemToggleHook = renderHook(() =>
            useSelectedItemToggle()
        )
        expect(useSelectedItemToggleHook.result.current.selectedState.selectedItem).not.toBeTruthy()
    })

    it('returns correct selected item in isSelected when one is given on init', () => {
        useSelectedItemToggleHook = renderHook(() =>
            useSelectedItemToggle(item)
        )
        expect(useSelectedItemToggleHook.result.current.isSelectedFn(item)).toBeTruthy();
    })

    it('makes item selected when initially no item is selected', () =>{
        useSelectedItemToggleHook = renderHook(() =>
            useSelectedItemToggle()
        )
        act(() => (useSelectedItemToggleHook.result.current.toggleSelected(item)))
        expect(useSelectedItemToggleHook.result.current.isSelectedFn(item)).toBeTruthy();
    })

    it('makes item unselected when initially item is selected', () => {
        useSelectedItemToggleHook = renderHook(() =>
            useSelectedItemToggle(item)
        )
        act(() => (useSelectedItemToggleHook.result.current.toggleSelected(item)))
        expect(useSelectedItemToggleHook.result.current.isSelectedFn(item)).not.toBeTruthy();
    })
    // it('renders given dataset', () => {
    //     useSelectedItemToggleHook = renderHook(() =>
    //         useSelectedItemToggle()
    //     )
    //     expect(useSelectedItemToggleHook.result.current).toHaveLength(data.length)
    // })
})