import React from 'react';


import getElementByProperty from '../components/functions/getElementByProperty'
import useGetData from '../hooks/useGetData';
import ListItem from './listItem';
import RenderBoard from '../render/boardAsListItem';
import sortBoard from './functions/sortBoard';
import boardProps from './functions/propGenerators/boardAsListItemProps';


const BoardSelection = (props) => {

    /** 
  *  <Board selection event handlers, sorting, render>
  */

    /**
     * boardClicked event handler, we want to change the state of our selectedBoards to either 
     * add or remove whichever board has been clicked.
     * @param {*} board the board we've just clicked. 
     */
    const boardClicked = (board) => {
        const idx = props.selectedBoards.map(e => e.id).indexOf(board.id);
        if (idx > -1) {
            //App knows board of id IS NOT selected now      
            props.setSelectedBoards(props.selectedBoards.filter(item => item.id !== board.id));
        } else {
            ///App knows board of id IS selected now      
            props.setSelectedBoards(props.selectedBoards.concat([board]));
        }
    }

    
    const BoardListItem = (props) => ListItem(props, { 'onClick': [boardClicked], 'onSelected': [] });
    
    const BoardProps = (x) => ( boardProps(props.selectedBoards, x))
    /**
    *  </Board selection event handlers, sorting, render>
    */



    //Get our boards and map according to the parameters we've just decided.
    const getData = useGetData(props.boardsFetch.error, props.boardsFetch.isLoading, props.boardsFetch.data, BoardListItem, RenderBoard, sortBoard, BoardProps);

    return(
        getData
    )
} 

export default BoardSelection;