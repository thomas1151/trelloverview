import React from 'react';
import Enzyme, { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { renderHook, act } from '@testing-library/react-hooks'
import useFetchList from '../useFetchList';
import SampleUseCustomMapComponent from '../samples/useCustomMapComponent';

describe('useFetchList hook', () => {
    let useFetchListHook;

    let url = "https://thomasbarratt.co.uk" //my site -> check it out!;
    let result = [
        { 'id': '1' },
        { 'id': '2' },
        { 'id': '3' },
    ]
    let urls = [url,url,url];
    let depends = [];
    let sampleSourceFn = (obj) => (obj)
    let sampleOutputFn = (data, d) => (d)
    let asBulk = false;
    beforeEach(() => {
        let asBulk = false;
        let urls = [url, url, url];
        let depends = [];
    })

    it('returns empty arr when no data is passed', async () => {
        // data = []
        //fetch.mockResponse(JSON.stringify(result))
        fetch.mockResponse(JSON.stringify(result))
        await act(async () => {
            useFetchListHook = renderHook(() =>
                useFetchList(undefined, undefined, undefined, asBulk, depends)
            )
        }
        )
        await expect(useFetchListHook.result.current.data).toEqual([])
    })


    it('results in all fetches and no error (!bulk)', async () => {
        // data = []
        fetch.mockResponse(JSON.stringify(result))

        await act(async () => {
            useFetchListHook = renderHook(() =>
                useFetchList(urls, sampleSourceFn, sampleOutputFn, asBulk, depends)
            )
        }
        )
        await expect(useFetchListHook.result.current.data).toHaveLength(urls.length)
    })


    it('results in no fetches and error (!bulk)', async () => {
        // data = []
        //fetch.mockResponse(JSON.stringify(result))
        let e = Error("500");
        fetch.mockReject(e)
        await act(async () => {
            useFetchListHook = renderHook(() =>
                useFetchList(urls, sampleSourceFn, sampleOutputFn, asBulk, depends)
            )
        }
        )
        await expect(useFetchListHook.result.current.error).toEqual(e)
    })

    it('processes bulk correctly when bulk == true', async () => {
        // data = []
        //fetch.mockResponse(JSON.stringify(result))
        
        asBulk = true
        fetch.mockResponse(JSON.stringify(result))
        await act(async () => {
            useFetchListHook = renderHook(() =>
                useFetchList(urls, sampleSourceFn, sampleOutputFn, asBulk, depends)
            )
        }
        )
        await expect(useFetchListHook.result.current.data).toEqual(urls.map( (url,i)  => result))
    })

    it('still fetches and returns usable data when no source, output functions, asBulk, depends are given', async () => {
        // data = []
        //fetch.mockResponse(JSON.stringify(result))
        fetch.mockResponse(JSON.stringify(result))
        await act(async () => {
            useFetchListHook = renderHook(() =>
                useFetchList(urls, undefined, undefined, undefined, undefined)
            )
        }
        )
        // await expect(useFetchListHook.result.current.data).toEqual(urls.map((url, i) => ({ "result": result), "source": urls.map((url, i) => url)}))
        await expect(useFetchListHook.result.current.data).toEqual(urls.map((url, i) => ( {"result":result, "source":url} ))) 
    })
    // it('url results in fetch and no error', async () => {
    //     // data = []
    //     fetch.mockResponse(JSON.stringify(result))

    //     await act(async () => {
    //         useFetchListHook = renderHook(() =>
    //             useFetchList(url, depends)
    //         )
    //     }
    //     )
    //     await expect(useFetchListHook.result.current.data).toHaveLength(result.length)
    // })

    // it('catches any errors from fetch', async () => {
    //     // data = []
    //     let e = Error("500");
    //     fetch.mockReject(e)

    //     await act(async () => {
    //         useFetchListHook = renderHook(() =>
    //             useFetchList(url, depends)
    //         )
    //     }
    //     )
    //     await expect(useFetchListHook.result.current.error).toEqual(e)
    // })

    // it('renders given dataset', () => {
    //     useFetchListHook  = renderHook(() => 
    //         useFetchList(data, mapFn, SampleUseCustomMapComponent, renderFn)
    //     )
    //     expect(useFetchListHook.result.current).toHaveLength(data.length)
    // })
})