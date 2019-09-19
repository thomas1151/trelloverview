import React from 'react';
import { useState, useEffect } from "react";


/**
 * Board logic. There's a big ol' getCards which I think could be converted to use the useFetchList hook, but it's not
 * 100% compatible yet.
 * @param {*} props 
 */
function Board(props) {

    const [isSelected, setIsSelected] = useState(props.isSelected ? props.isSelected : false);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState({});

    /**
     * Let's get all the cards on load.
     * get the cards from the pot-lists, and add them to the pot
     */
    useEffect(() => {
        if (props.activePots && props.activePots[0] !== undefined) {
            setIsLoading(true);
            // wait for nested requests to fulfill
            Promise.all(props.activePots.map(async (pot) => { // Notice callback is async
                pot.cards = [];
                await Promise.all(pot.lists.map(async (list) => {
                    return (fetch('https://api.trello.com/1/lists/' + list.id + '/cards/?key=' + props.ApiKey + '&token=' + props.ApiToken)
                        .then(function (response) {
                            return response.json();
                        }).then(function (json) {
                            pot.cards = pot.cards.concat(json);
                            pot.cards = pot.cards.sort((a, b) => new Date(b.dateLastActivity) - new Date(a.dateLastActivity))
                        })
                    )
                }))
                return pot;
            })).then(d => {
                setIsLoading(false);
                props.setActivePots(d);

            }).catch((err) => {
                setError(err);
            });

        }
    }, []);
   
    /**
     * Construct the necessary properties to pass to any children this may create.
     */
    const constructRenderData = () => {
        let p = Object.assign({},props);
        p.lists = [];
        p.isLoading = isLoading;
        p.error = error;
        return p;
    }

    /**
     * For all your onSelected callbacks, loop through them here and call them as required.
     * @param {*} event 
     */
    function onSelected(event) {
        props.callbacks && props.callbacks.onSelected.forEach(element => {
            element(props.data);
        });
    }

    /**
     * For all your onRemove callbacks, loop through them here and call them as required.
     * @param {*} event
     */
    function onRemove(event) {
        props.callbacks && props.callbacks.onRemove.forEach(element => {
            element(props.data);
        });
    }

    /**
    * For all your onClick callbacks, loop through them here and call them as required.
    * @param {*} event
    */
    function onClick(event) {
        if (!isSelected) {
            onSelected(event);
        }
        props.callbacks && props.callbacks.onClick.forEach(element => {
            element(props.data);
        });
        setIsSelected(!isSelected);
    }

    /**
     * We return the render function given in props, along with the looping callback handlers we've defined above, as well as the props we've constructed for
     * the renderFn AND as a backup the props we've passed to this element.
     */
    return (
        <React.Fragment>
            {props.renderFn(constructRenderData(), { onRemove: onRemove, onClick: onClick, isSelected: props.isSelected, passedProps: props })}
        </React.Fragment>
    );
}

export default Board;
