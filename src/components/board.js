import React from 'react';
import { useState, useEffect } from "react";
import getElementByProperty from './functions/getElementByProperty';

function removeDuplicatesBy(keyFn, array) {
    var mySet = new Set();
    return array.filter(function (x) {
        var key = keyFn(x), isNew = !mySet.has(key);
        if (isNew) mySet.add(key);
        return isNew;
    });
}


const sortByList = (cards) => {
    let out = []
    let lists = {};
    
    // cards.forEach(function (a) {
    //     this[a.idList] || grouped.push(this[a.idList] = []);
    //     this[a.idList].push(a);
    // }, Object.create(null));

    // console.log(grouped);

    const doesCardNeedUpdate = (list, card) => {
        let existingCardIdx = list.findIndex((c) => c.id === card.id);
        if (existingCardIdx != -1){
            if(list[existingCardIdx].dateLastActivity >= card.dateLastActivity){
                console.log("We already have this card up to date!", card.name);
                return list;
           }else{
                console.log("We have this card but it is NOT up to date", card.name);   
                list[existingCardIdx] = card
               
           }
        }else{
            console.log("We don't have this card!", card.name);   

            list = list.concat([card])
        }
        return list;
    }
    cards.map( card => {
        if(card){
            lists[card.idList] ?
                lists[card.idList] = doesCardNeedUpdate(lists[card.idList], card)
                :
                    lists[card.idList] = [card]
        }
    })
    // lists[undefined] = undefined;

    let biggestListLength = 0; 
    Object.keys(lists).map( (listKey) => {
        biggestListLength =  lists[listKey].length > biggestListLength ? lists[listKey].length : biggestListLength; 
        lists[listKey] = lists[listKey].sort( (a,b) => a.pos < b.pos)
    })
    // console.log(biggestListLength);
    // console.log(lists);

    let keys = Object.keys(lists);
    for (let l = 0; l < biggestListLength; l++) {
        let vals =[]
        for(let i=0; i < keys.length; i++){
            // console.log(lists[keys[i]]);
            // console.log(lists[keys[i]]);
            // console.log(lists[keys[i]][l]);
            lists[keys[i]] && lists[keys[i]][l] && vals.push(lists[keys[i]][l])
        }
        // console.log(vals.length);
        out = out.concat(vals.sort((a, b) => new Date(b.dateLastActivity) - new Date(a.dateLastActivity)));
        
    }

    console.log(out);
    return out;
}

/**
 * Board logic. There's a big ol' getCards which I think could be converted to use the useFetchList hook, but it's not
 * 100% compatible yet.
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
                //pot.cards = [];
//                let new;
                await Promise.all(pot.lists.map(async (list) => {
                    return (fetch('https://api.trello.com/1/lists/' + list.id + '/cards/?key=' + props.ApiKey + '&token=' + props.ApiToken)
                        .then(function (response) {
                            return response.json();
                        }).then(function (json) {
                            
                            // console.log(json);
                            // console.log(pot.cards);
                            // pot.cards = mergeTwo(pot.cards ? pot.cards : [], json)
                            // pot.cards =  json;
                            // pot.cards = , pot.cards).sort((a, b) => new Date(b.dateLastActivity) - new Date(a.dateLastActivity))
                            // console.log()
                            // pot.cards = (pot.cards)
                            return json;
                        })
                    )
                })).then( function (results){
                    let out = []
                    let biggestLength = 0;
                    let r = results.map( (list) => {
                        biggestLength = list.length > biggestLength ? list.length: biggestLength;
                        return (list.sort( (a,b) => a.pos > b.pos));
                    })
                    console.log(r);
                    for (let l = 0; l < biggestLength; l++) {
                        let vals = []
                        for (let i = 0; i < r.length; i++) {
                            r[i] && r[i][l]  && vals.push(r[i][l])
                        }
                        out = out.concat(vals.sort((a, b) => new Date(b.dateLastActivity) - new Date(a.dateLastActivity)));

                    }
                    pot.cards = out
                    // console.log(r);
                })
// 
                // await 
                return pot;
            })).then(newPots => {
   
                setIsLoading(false);
                setToLoad(false);
                console.log(newPots)
                if(newPots.some( (pot) => (pot.cards.length > 0))){
                    props.setActivePots(newPots);
                //     for(let i = 0; i < newPots.length; i++){
                //         for (let l = 0; l < activePots.length; l++) {
                //             for( let x = 0; x < activePots[l].cards.length; x++){
                //                 getElementByProperty(activePots[l].cards, 'id', newPots[i])
                //             }
                //         }
                }
                    // props.setActivePots(d.map( 

                    //         activePots.map()
                    //         (pot => 
                    //             {
                    //                 pot.cards = pot.cards.filter( (card) => (
                    //                 )); 
                    //                 return pot;
                    //             })
                    //         ));
                

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
        // setToLoad(false);
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
