//found at the useful: https://www.valentinog.com/blog/hooks/

import { useState, useEffect } from "react";

/**
 * Function to fetch from a list. 
 * 
 * @param {*} arr 
 * 
 */
const defaultSourceFn = (obj) => (obj);
const defaultOutputFn = (obj, out) => Object.assign({ source: obj }, { result: out });

/**
 * Function to take a list and do a fetch for every value.
 * This currently only returns values if NONE fail, so be careful when making your calls.
 * If there's a chance one may fail then maybe don't use this.
 * sourceFn and outputFn have defaults. SourceFn just assumes each is a string it can fetch from.
 * outputFn will assume 
 * @param {Object}      obj      source object we'll be taking data from. Since we optionally process it this can be anything. 
 * @param {?function}    sourceFn This fn should retrieve the fetch URL from the object given or the out of processFn(obj), 
 * @param {?function}    outputFn This fn should be used in conjuction with isBulk to either retrieve the data from each 
 *                                fetch response json, or from the whole array once completed.
 * @param {Boolean}     asBulk   should we call outputFn after all requests (true) or after each (false) 
 * @param {?string[]}    depends  variables which if changed should force a fetch update. 
 */
export default function useFetchList(obj = [], sourceFn = defaultSourceFn, outputFn = defaultOutputFn, asBulk = false, depends = []) {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [data, setData] = useState(obj);
    async function getData() {
        setIsLoading(true);
        setData([]);
        await Promise.all(

            obj.map(async x => {
                // console.log(obj);
                return fetch(sourceFn(x))
                    .then(function (response) {
                        return response.json();
                    }).then(function (json) {
                        if (!asBulk) {
                            let out = outputFn(x, json)
                            return out;
                        }
                        return json;
                    })
            })
        ).then(d => {
            setIsLoading(false);
            if (asBulk) {
                d = outputFn(data, d);
            }
            setData(d);
            return d;

        }).catch((err) => {
            setError(err);
        });
    }


    //Using the useEffect hook from React, the
    // [] means the effect depends on nothing, so it only needs to run
    // once.
    useEffect(() => {
        getData()
    }, depends)

    return { data, error, isLoading };
}
