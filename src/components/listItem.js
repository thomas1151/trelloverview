import React from 'react';
import { useState } from "react";
import useFetch from '../hooks/useFetch';

/**
 * Generic ListItem controller. Allows support for selecting/removing, as well
 * as the custom render function that is passed in props.
 * If a fetchUrl is passed in props, the list item can maintain this too and passes it to any
 * render function it executes.
 * 
 * The render function can of course be another component, so you can have nested list items.
 * Maybe renderFn should be changed to a more appropriate name... 
 * @param {Object} props 
 * @param {Object} callbacks 
 */
function ListItem(props, callbacks={onClick: [], onSelected:[]}) {

    //Give ListItems a selected state.
    const [isSelected, setIsSelected] = useState(props.isSelected ? props.isSelected : false);
    let fetchedData = useFetch(props.fetchUrl);

    /**
     * So we have this merging function, if we need to make way for any fetched data, we move the data 
     * THIS component has gotten (props.data) into an initialPropsData key, so the fetched data gets key instead.
     */
    const constructRenderData = () => {
        let f = fetchedData.data ? fetchedData.data : fetchedData;
        return(props.data.constructor === Object ? Object.assign(props.data, { [props.fetchName]: f }) : Object.assign(f, {initialPropsData:props.data}));
    }

    /**
     * Callbacks for onSelected.
     * @param {*} event 
     */
    function onSelected(event){
        callbacks.onSelected.forEach(element => {
            element(props.data);
        });
    }

    /**
     * Callbacks for onRemove.
     * @param {*} event 
     */
    function onRemove(event) {
        callbacks.onRemove.forEach(element => {
            element(props.data);
        });
    }

    /**
     * When we're clicking, this is the baby we want to be fired.
     * @param {*} event 
     */
    function onClick(event){

        //We haven't changed the selectedState yet and we can't reliably check it after we've changed it
        //due to the async nature, so we just check to see if it isn't selected yet, and then fire the
        //isSelected logic.
        if(!isSelected){
            onSelected(event);
        }

        //We don't know how many ListItems this is descendant from - it's possible there's a whole chain of
        //callbacks we might need to fire, so we do that here.
        callbacks.onClick.forEach(element => {
            element(props.data);
        });

        //Finally we need to toggle whatever the selected state - this is only mainainted internally.
        setIsSelected(!isSelected);
    }
    return (
        <React.Fragment>
            {props.renderFn(constructRenderData(), {onRemove:onRemove, onClick:onClick, isSelected: props.isSelected, props: props})}
        </React.Fragment>
    );
}

export default ListItem;
