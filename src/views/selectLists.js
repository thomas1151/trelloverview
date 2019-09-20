// https://api.trello.com/1/boards/{idBoard}?key={yourKey}&token={yourToken}

import React from 'react';
import ListItem from '../components/listItem';

import useCustomMapData from '../hooks/useCustomMapData';
import { useState, useEffect } from "react";
import useSelectedItemToggle from '../hooks/useSelectedItemToggle';
import SelectPots from './selectPots';
import BoardWithLists from '../components/boardWithLists';
import useFetchList from '../hooks/useFetchList';
import Loading from '../render/loading';

function SelectLists(props) {


    const ListsOfBoardListItem = (props) => ListItem(props, { 'onClick': [], 'onSelected': [] });
    const activePots = props.activePots;
    const setActivePots = props.setActivePots;
    function getCurrentPotFn() {
        if(activePots){
            let a = activePots.find((el) => (
                 el.selected
            ))
            // console.log(a);
            //console.log(activePots);
            return a;

        }
    }

    const listClicked = (id) => {
        // console.log(id);
        setSelectedElementList(id);
        //console.log(activePots);
    }

    /**
     * Returns index if true, false if false. Can be evaluated as boolean too.
     * @param {Object} pot to evaluate 
     */
    function isSelectedElementList(el) {
        let cP = getCurrentPotFn();
        //  console.log("This one has been called tho");
        if (cP){ 
            // console.log(cP);
            // console.log(el);
            let r = cP.lists ? cP.lists.findIndex((e) => (el.id === e.id)) : false; 
            // console.log(r, el);
            return r;

        }
        else{
            return(-1);
        }    
    }

    function setSelectedElementList(el){
        
        // console.log(activePots);
        if(activePots && activePots.length > 0){
            // console.log(activePots);
            let aP = activePots.map((x) => {
                // console.log(x);
                if (x.selected == true) {
                    if (isSelectedElementList(el) >= 0) {
                        console.log("removing!");
                        //TODO: make this variable, not necess id?
                        x.lists = x.lists.filter((e) => e.id !== el.id);
                    } else {
                        console.log("adding!");
                        x.lists = x.lists.concat([el]);
                    }
                }
                return x;

            })
            console.log(aP);
            setActivePots(aP);
        }

            
    }
        
    

    
    const boardWithListProps = (x) => {
        let additionalProps = {};
        // additionalProps.fetchUrl = 'https://api.trello.com/1/boards/' + x.id + '/lists/?key=' + props.ApiKey + '&token=' + props.ApiToken;
        // additionalProps.fetchName = 'lists';
        additionalProps.listClickedFn = listClicked;
        additionalProps.activePots = activePots;
        additionalProps.selectedElementFn = isSelectedElementList;
        additionalProps.getCurrentPotFn = getCurrentPotFn;
        // console.log(x);
        return  additionalProps;
    }

    // const boardsWithLists = ;


    /**
     * I think this edits the state without using set? Not sure :(
     * @param {*} el 
     */
    const sCurrentPot = (el) => {
        setActivePots(prevPots => prevPots.map((p) => {
            //console.log(p);
            if (p === el) {
                p.selected = true;
            } else {
                p.selected = false;
            }
            return p;
        }))


    }

    const { toggleSelected: toggleSelectedPot, isSelectedFn: isSelectedPotFn, } = useSelectedItemToggle();


     
    //Keeping this as a member of state prevents reloads when the selectPots require it.
    // let renderedLists = useCustomMapData(props.selectedBoards, props.boardSortFn, ListsOfBoardListItem, BoardWithLists, boardWithListProps);
    // let ls = useFetchList()
    console.log(props.selectedBoards);
    const { data:boardsWithLists, error:boardsWithListsError, isLoading:boardsWithListsIsLoading} = useFetchList(
            props.selectedBoards, 
            (board) => ('https://api.trello.com/1/boards/' + board.id + '/lists/?key=' + props.ApiKey + '&token=' + props.ApiToken),
            (board, lists) => {board.lists = lists; return board },
            false,
            [props.selectedBoards] 
            )

    console.log(boardsWithLists);
    console.log(boardsWithListsIsLoading);
    let renderedLists = useCustomMapData(boardsWithLists[0] ? (boardsWithLists[0].lists ? boardsWithLists : []) :[], props.boardSortFn, ListsOfBoardListItem, BoardWithLists, boardWithListProps)
    // console.log(renderedLists);
    return(
        
            <div className="flex w-full flex-wrap">
                <aside className="pots w-full sm:w-1/5 p-2 border-r border-gray-300 bg-white rounded  self-start p-2 border-2 m-1">
                    <SelectPots 
                        setCurrentPot={sCurrentPot} 
                        currentPot={ getCurrentPotFn} 
                        activePots={activePots} 
                        setActivePots={setActivePots}
                        toggleSelectedPot={toggleSelectedPot} //
                        isSelectedPotFn={isSelectedPotFn} //
                        selectedPotState={ getCurrentPotFn} //
                        />
                </aside>
                <main className="flex-1 flex flex-wrap">
                    {getCurrentPotFn() ? 
                        boardsWithListsIsLoading ? 
                            <Loading/>

                            :
                            boardsWithListsError?
                                <div>error</div>
                                :
                                (boardsWithLists.length > 0 ?
                                    // <div>lists with {boardsWithLists.length}</div>
                                    <React.Fragment>
                                        {renderedLists}
                                    </React.Fragment>
                                    :
                                    <div>No lists!</div>
                                )
                        
                    :
                        <div className="self-center text-center w-full text-lg font-bold text-gray-600">{activePots.length > 0 ?  "Please select an existing pot or create a new one." : "Please create a pot to get started."}</div>
                    }
                </main>
            </div>

    )

}

export default SelectLists;
