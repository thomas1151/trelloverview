//found at the useful: https://www.valentinog.com/blog/hooks/

import { useState, useEffect } from "react";

/**
 * Little fetch hook with data error and loading.
 * Only interesting tidbit is there is an 'error' string returned if there is no URL passed.
 * This is useful if you're using it with other hooks that just always loop.
 * @param {string} url the url we're fetching from.
 */
export default function useFetch(url, depends) {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    async function getData() {

        setIsLoading(true);
        setError(null);
        setData([]);
        try {
            const response = await fetch(url); //let's wait for us to get our response;
            // console.log("fetching from "+url)
            const data = await response.json();
            setData(data);
            setIsLoading(false);
        } catch (error) {
            setError(error.toString());
            setIsLoading(false);

        }
    }

    //Using the useEffect hook from React, the
    // [] means the effect depends on nothing, so it only needs to run
    // once.
    useEffect(() => {
        if (url) {
            getData();
        } else {
            setError('WARN: No URL Passed');
        }
    }, depends)

    return { data, error, isLoading };
}