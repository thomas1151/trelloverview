import React, { useEffect, useState } from 'react';
import useCustomMapData from "./useCustomMapData";
import Loading from '../render/loading';

const defaultMapFn = (arr) => (arr)
const DefaultComponent = <div></div>
const defaultRenderFn = (x) => undefined;

require('dotenv').config();

export default function useLocalStorageTokenManagement(cleanupFns) {

    const [key, setKey] = useState(localStorage.getItem('trelloKey') || process.env.REACT_APP_API_KEY);
    const [token, setToken] = useState(localStorage.getItem('trelloToken'));

    useEffect(() => {
        localStorage.setItem('trelloToken', token);
    }, [token])

    const logout = () => {
        localStorage.removeItem('trelloToken');
        cleanupFns.forEach((fn) => fn())
    }

    return { token }
}


