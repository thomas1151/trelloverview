/**
 * @author Thomas Barratt
 * @email tb@thomasbarratt.co.uk
 * @create date 2019-09-18 13:51:50
 * @modify date 2019-09-18 13:51:50
 * @desc Hook to allow for localStorage to manage abritrary data.
 */

import React, { useEffect, useState } from 'react';
require('dotenv').config();

/**
 * Uses localStorage to store arbitrary data. 
 */
export default function useLocalStorageManagedState(prop, initialValue) {

    const [key, setKey] = useState( prop );
    const [data, setData] = useState(localStorage.getItem(prop) && JSON.parse(localStorage.getItem(prop)) || initialValue );

    useEffect(() => {
        data ?
            localStorage.setItem(key, JSON.stringify(data))
            :
            localStorage.removeItem(key)
    }, [data])

    /**
     * Remove token from state, therefore localStorage. 
     * @param {arr[Function]} cleanupFns (optional) any cleanup functions you want executing will be done here. 
     */
    const remove = () => {
        //Remove that token!
        setData();
        return true;
    }

    /**
     * Store our token in our state, which prompts an update in localStorage
     * @param {string} token 
     */
    const stash = (d) => {
        setData(d);
    }

    /**
     * converts our token to a bool, useful for checks.
     */
    const isStashed = (Boolean(data))

    return { stash, remove, isStashed, data }
}
