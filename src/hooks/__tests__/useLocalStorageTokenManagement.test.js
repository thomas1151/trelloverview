import React from 'react';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { renderHook, act } from '@testing-library/react-hooks'
import useLocalStorageTokenManagement from '../useLocalStorageTokenManagement';
import SampleUseCustomMapComponent from '../samples/useCustomMapComponent';
require('dotenv').config();


describe('useLocalStorageTokenManagement hook', () => {
    let useLocalStorageTokenManagementHook;

    it("fetches from env when no key in localStorage", ()=>{
        useLocalStorageTokenManagementHook = renderHook(() =>
            useLocalStorageTokenManagement()
        ) 
        expect(useLocalStorageTokenManagementHook.result.current.key).toEqual(process.env.REACT_APP_API_KEY)
    })

    it("stashes a key in localStorage using stash", () => {
        let testKey = "testKey";
        useLocalStorageTokenManagementHook = renderHook(() =>
            useLocalStorageTokenManagement()
        ) 
        act( () => {
            useLocalStorageTokenManagementHook.result.current.stash(testKey)
        })
        expect(localStorage.getItem("trelloToken")).toEqual(testKey);
    })


    it("revokes a key in localStorage using revoke and noCleanUpFns", () => {
        let testKey = "testKey";
        useLocalStorageTokenManagementHook = renderHook(() =>
            useLocalStorageTokenManagement()
        )
        act(() => {
            useLocalStorageTokenManagementHook.result.current.revoke()
        })

        expect(localStorage.getItem("trelloToken")).toEqual(null);
    })


    it("revokes a key in localStorage using revoke with sample cleanUpFns", () => {
        let testKey = "testKey";
        let cleanUpFns = [jest.fn(), jest.fn()]
        useLocalStorageTokenManagementHook = renderHook(() =>
            useLocalStorageTokenManagement()
        )
        act(() => {
            useLocalStorageTokenManagementHook.result.current.revoke(cleanUpFns)
        })
        expect(localStorage.getItem("trelloToken")).toEqual(null);
    })
})