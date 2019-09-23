import getElementByProperty from './functions/getElementByProperty'
import getListByProperty from './functions/getListByProperty'
import renderCardFn from  '../render/card'

const Card = (props) => {
    let list = getListByProperty(props.activePots, 'id', props.card.idList);
    let board = list && getElementByProperty(props.selectedBoards, 'id', list.idBoard);

    if(board){
        return renderCardFn(props.card, list, board)
    }else{
        return null;
    }
}

export default Card;