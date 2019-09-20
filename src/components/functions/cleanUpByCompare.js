/**
 * Given a source array of objects, an output array of objects
 * and the names of their respective properties, will remove the
 * items from outputItems that should no longer be there.
 * Useful in this project for filtering out lists from boards that are
 * no longer selected.
 * @param {Object[][]} sourceItemsArr 
 * @param {Object[][]} outputItemsArr
 * @param {string} sourceProperty property to compare against on the source items
 * @param {string} outputProperty property to compare against on the output items
 */
const cleanUpByCompare = (sourceItemsArr, outputItemsArr, sourceProperty, outputProperty) => {
    return outputItemsArr.map(outputItem => {
        let found = false;
        for (let i = 0; i < sourceItemsArr.length; i++) {
            if (outputItem[outputProperty] == sourceItemsArr[i][sourceProperty]) {
                found = true;
                break;
            }
        }
        if (found) {
            return outputItem;
        }
    }).filter(Boolean);
}


export default cleanUpByCompare