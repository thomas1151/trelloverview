// browser mocks

//found at:https://github.com/facebook/jest/issues/2098#issuecomment-260733457
const localStorageMock = (function () {
    let store = {}
    return {
        getItem: function (key) {
            return store[key] || null
        },
        setItem: function (key, value) {
            store[key] = value.toString()
        },
        removeItem: function (key) {
            delete store[key]
        },
        clear: function () {
            store = {}
        },
    }
})()

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
})


global.fetch = require('jest-fetch-mock')
