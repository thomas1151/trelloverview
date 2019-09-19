import React from 'react';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { renderHook, act } from '@testing-library/react-hooks'
import useFetch from '../useFetch';
import SampleUseCustomMapComponent from '../samples/useCustomMapComponent';

describe('useFetch hook', () => {
    let useFetchHook;

    let url = "https://thomasbarratt.co.uk" //my site -> check it out!;
    let result = [
        {'id':'1'},
        {'id':'2'},
        {'id':'3'},
    ]
    let depends = [];
    beforeEach( () => {
         
    }) 
    it('url results in fetch and no error', async () => {
        // data = []
        fetch.mockResponse(JSON.stringify(result))

        await act(async () => {
            useFetchHook = renderHook(() =>
                useFetch(undefined, depends)
            )
        }
        )
        await expect(useFetchHook.result.current.error).toEqual(expect.any(Error))
    })


    it('url results in fetch and no error', async () => {
        // data = []
        fetch.mockResponse(JSON.stringify(result))

        await act( async () => {useFetchHook = renderHook( () => 
            useFetch(url, depends)
            )}
        )
        await expect(useFetchHook.result.current.data).toHaveLength(result.length)
    })

    it('catches any errors from fetch', async () => {
        // data = []
        let e = Error("500");
        fetch.mockReject(e)

        await act(async () => {
            useFetchHook = renderHook(() =>
                useFetch(url, depends)
            )
        }
        )
        await expect(useFetchHook.result.current.error).toEqual(e)
    })

    // it('renders given dataset', () => {
    //     useFetchHook  = renderHook(() => 
    //         useFetch(data, mapFn, SampleUseCustomMapComponent, renderFn)
    //     )
    //     expect(useFetchHook.result.current).toHaveLength(data.length)
    // })
})