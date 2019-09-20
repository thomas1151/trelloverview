/**
 * Gets an element by source to look at, property and value given. Returns first if multiple.
 */
const getElementByProperty = (source, property, value) => (source.find((e) => e[property] === value) || {})

export default getElementByProperty;