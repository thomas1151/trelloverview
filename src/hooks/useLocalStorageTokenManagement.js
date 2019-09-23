/**
 * @author Thomas Barratt
 * @email tb@thomasbarratt.co.uk
 * @create date 2019-09-18 13:51:50
 * @modify date 2019-09-18 13:51:50
 * @desc Hook to allow for localStorage management for tokens.
 */

import React, { useEffect, useState } from 'react';
require('dotenv').config();

/**
 * Uses localStorage to store a key and token. The key is either already defined in localStorage or in the .env file which is included in the project.
 * Other developers wanting to change API key should look for the REACT_APP_API_KEY in .env.
 * Revoke, Stash, isStashed do as they would suggest.
 */
export default function useLocalStorageTokenManagement() {

    const [key, setKey] = useState(localStorage.getItem('trelloKey') || process.env.REACT_APP_API_KEY);
    const [token, setToken] = useState(localStorage.getItem('trelloToken'));

    useEffect(() => {
        token ?
            localStorage.setItem('trelloToken', token) : localStorage.removeItem('trelloToken')
    }, [token])

    useEffect(() => {
        key ?
            localStorage.setItem('trelloKey', key) : setKey(process.env.REACT_APP_API_KEY);
    }, [key])


    /**
     * Remove token from state, therefore localStorage. 
     * @param {arr[Function]} cleanupFns (optional) any cleanup functions you want executing will be done here. 
     */
    const revoke = (cleanupFns = []) => {
        //Remove that token!
        setToken();

        //In case any cleanups were passed.
        cleanupFns.forEach((fn) => fn());
    }

    /**
     * Store our token in our state, which prompts an update in localStorage
     * @param {string} token 
     */
    const stash = (token) => {
        setToken(token);
    }

    /**
     * converts our token to a bool, useful for checks.
     */
    const isStashed = (Boolean(token))

    return { stash, revoke, isStashed, token, key, setKey }
}
