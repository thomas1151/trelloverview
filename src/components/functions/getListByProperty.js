/**
 * @author Thomas Barratt
 * @email tb@thomasbarratt.co.uk
 * @create date 2019-09-20 13:26:07
 * @modify date 2019-09-20 13:26:07
 * @desc  getListByProperty
 */
/**
 * Gets a list from a pots array by property and value given. Returns first if multiple.
 */
const getListByProperty = (pots, property, value) => {
    for (let i = 0; i < pots.length; i++) {
        let r = pots[i].lists.find(((e) => e[property] === value));
        if (r) {
            return r;
        }
    }
}

export default getListByProperty;