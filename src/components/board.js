import React from 'react';
import { useState, useEffect } from "react";

/**
 * Board logic. 
 * @param {*} props 
 */
function Board(props) {

    const [isSelected, setIsSelected] = useState(props.isSelected ? props.isSelected : false);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toLoad, setToLoad] = useState(true);
    const getData = () => {


        if (props.activePots && props.activePots[0] !== undefined && navigator.onLine) {

            setIsLoading(true);
            // wait for nested requests to fulfill
            Promise.all(props.activePots.map(async (pot) => { // Notice callback is async
                await Promise.all(pot.lists.map(async (list) => {
                    return (fetch('https://api.trello.com/1/lists/' + list.id + '/cards/?key=' + props.ApiKey + '&token=' + props.ApiToken)
                        .then(function (response) {
                            return response.json();
                        })
                    )
                })).then( function (results){
                    let out = []
                    let biggestLength = 0;
                    let r = results.map( (list) => {
                        biggestLength = list.length > biggestLength ? list.length: biggestLength;
                        return (list.sort( (a,b) => a.pos > b.pos));
                    })

                    for (let l = 0; l < biggestLength; l++) {
                        let vals = []
                        for (let i = 0; i < r.length; i++) {
                            r[i] && r[i][l]  && vals.push(r[i][l])
                        }
                        out = out.concat(vals.sort((a, b) => new Date(b.dateLastActivity) - new Date(a.dateLastActivity)));

                    }
                    pot.cards = out
                })
                return pot;
            })).then(newPots => {
   
                setIsLoading(false);
                setToLoad(false);
                console.log(newPots)
                if(newPots.some( (pot) => (pot.cards.length > 0))){
                    props.setActivePots(newPots);
                }
            }).catch((err) => {
                console.log(err)
                // setIsLoading(true);

                props.setActivePots(props.activePots);
                setError(err);
            });

        }
    }

    /**
     * Let's get all the cards on load.
     * get the cards from the pot-lists, and add them to the pot
     */
    useEffect(() => {
        
        let toLoadInterval = !isLoading && setInterval(() => setToLoad(true), 10000)

        // this will clear Timeout when component unmont like in willComponentUnmount
        return () => {
            clearInterval(toLoadInterval)
        }
        
    }, [toLoad]);

    useEffect(() => {
        if(toLoad){
            getData()
        }
    }, [toLoad])
   

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
