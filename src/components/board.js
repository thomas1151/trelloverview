import React from 'react';
import { useState, useRef, useEffect } from "react";
import RenderModal from '../render/renderModal';
import useLocalStorageManagedState from '../hooks/useLocalStorageManagedState';


const RenderBoardSettings = (props) => (
    <div className="text-left">
        <div className="text-lg text-gray-700 font-bold pb-4 flex">
            <h2 className="flex-1">Edit overview  settings </h2>
            <button onClick={props.close} className={"align-right font-light px-2 rounded border-gray-100 deg45 font-bold text-xl select-none"}>+</button>
        </div>
        <div className="flex-1">
            <label  className="w-full self-center pt-4 text-left text-gray-500 font-bold"
                    for="updateInterval">Update Interval</label>
            <input
                className="flex-1 max-w-full bg-white focus:outline-none border border-gray-300 rounded-lg py-2 px-4 leading-normal" 
                type="number" 
                name="updateInterval"
                defaultValue={props.updateInterval / 1000}  ref={props.inputRef}
                min="15000" step="15000"
                />s
        </div>

        <button 
            className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded my-4"
            type="button" onClick={(e) => { e.preventDefault(); props.setUpdateInterval(props.inputRef.current.value * 1000); props.close(); }}>
            Save
        </button>
    </div>
)
/**
 * Board logic. 
 * @param {*} props 
 */
function Board(props) {

    const [isSelected, setIsSelected] = useState(props.isSelected ? props.isSelected : false);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [toLoad, setToLoad] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const { stash: stashUpdateInterval, remove: removeUpdateInterval, isStashed: isUpdateIntervalStashed, data: updateInterval } = useLocalStorageManagedState('trelloUpdateInterval', 60000);
    const updateIntervalRef = useRef(null);

    
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
        
        let toLoadInterval = !isLoading && setInterval(() => setToLoad(true), updateInterval)

        // this will clear Timeout when component unmont like in willComponentUnmount
        return () => {
            clearInterval(toLoadInterval)
        }
        
    }, [toLoad, updateInterval]);

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
            <div className="absolute bottom-0 right-0 text-xl select-none" onClick={ () => setShowSettings(!showSettings)}>
                ⚙️
            </div>
            {props.renderFn(constructRenderData(), { onRemove: onRemove, onClick: onClick, isSelected: props.isSelected, passedProps: props })}
            {showSettings && <RenderModal content={<RenderBoardSettings close={() => setShowSettings(!showSettings)} updateInterval={updateInterval} inputRef={updateIntervalRef} setUpdateInterval={stashUpdateInterval}/>} />}
        </React.Fragment>
    );
}

export default Board;
