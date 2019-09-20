import React from 'react';
import ListItem from '../components/listItem';

import useCustomMapData from '../hooks/useCustomMapData';
import { useState } from "react";


const renderListItem = (list, renderListItemProps) => (

        <div className="list" onClick={renderListItemProps.onClick} >
            <p className={"hover:text-blue-500 hover:border-blue-500 text-left rounded my-3 py-3 px-4  border-t-2 border-b-2 border-l-8 border-r-2 " + (!renderListItemProps.isSelected && 'border-gray-300')} 
                style={{ borderColor: (renderListItemProps.isSelected ? '#' +renderListItemProps.props.selectColor : '')}}>
                    {list.name}
            </p>
        </div>
    )


/**
    * Some horrible mix of logic and view, needs splitting out into a selectable listItem and then the render methods.
    * @param {*} board 
    * @param {*} optionalParams innit. 
    */
export default function BoardWithLists(board, { onClick = () => (console.log("Default click")), isSelected, props } = {}) {

    function boardElementListItemClicked(i){
        props.listClickedFn(i);
    }

    const BoardElementListItem = (props) => ListItem(props, { 'onClick': [boardElementListItemClicked], 'onSelected': [] });

    const aProps = (x) => {
        let p = { isSelected: false };
        if (props.selectedElementFn){
            if(props.selectedElementFn(x) >= 0){
                p.isSelected = true;
            }
        }
        let currentPot = props.getCurrentPotFn();
        // console.log(currentPot);
        p.selectColor = (currentPot ? currentPot.color : '000000');
        return p;
    }

    const listData = useCustomMapData(board.lists ? board.lists : [], (a) => (a), BoardElementListItem, renderListItem, aProps );

    return (
        <div className="flex outer boardCard w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 self-stretch" key={board.id} >
            <div className={"inner p-2 border-2  m-1 bg-white w-full"} onClick={onClick} >
                <h2 className="font-medium">{board.name}</h2>
                <div className="last-active" className="font-book text-blue-700"><a target="_blank" rel="noopener noreferrer" href={board.url}>{new Date(Date.parse(board.dateLastActivity)).toLocaleString()}</a></div>
                {listData}
            </div>
        </div>
    )
};
