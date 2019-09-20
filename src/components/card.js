import getElementByProperty from './functions/getElementByProperty'
import getListByProperty from './functions/getListByProperty'
import renderCardFn from  '../render/card'

const Card = (props) => {
    let list = getListByProperty(props.activePots, 'id', props.card.idList);
    let board = getElementByProperty(props.selectedBoards, 'id', list.idBoard);
    return renderCardFn(props.card, list, board)
}

export default Card;