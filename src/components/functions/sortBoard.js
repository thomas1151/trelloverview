/**
 * Function to sort boards, currently reverse last activity date.
 * @param {array[Object]} arr
*/
const sortBoard = (arr) => (
    arr.sort((a, b) => (new Date(b.dateLastActivity) - new Date(a.dateLastActivity)))
)

export default sortBoard;