
// https://api.trello.com/1/boards/{idBoard}?key={yourKey}&token={yourToken}

import React from 'react';
import ListItem from '../components/listItem';
import useCustomMapData from '../hooks/useCustomMapData';



function SelectPots(props) {
    const newPotForm = (e) => {
        e.preventDefault();
        newPot(e.target.potName.value);
    }


    const defaultRenderListItem = (pot, { onClick = () => (console.log("Default click")), isSelected, onRemove } = {}) => {
        return (
            <div className="pot" onClick={onClick} >
                <div className={" py-2 px-4 hover:bg-blue-400 text-left border-t border-b border-gray-300 py-3 rounded flex " + (pot.selected && 'text-white')} style={pot.selected ? {background: '#'+pot.color} : {}}>
                    <p className="flex-1">{pot.name}</p>
                    <button onClick={onRemove} className={" font-light px-2 rounded border-gray-100 deg45 font-bold text-xl select-none" + (pot.selected ? 'text-white' : 'text-gray-700')}>+</button>

                </div>
            </div>
        )
    }

    //Unpack our needed props.
    const renderListItem = props.renderListItemFn ? props.renderListItemFn : defaultRenderListItem;
    
    const setCurrentPot = (el) => (
        props.setCurrentPot && props.setCurrentPot(el)
    )

    const setActivePots = (el) => {

        props.setActivePots(el);
    }
    const newPot = (name) => {
        let d = {};
        d.date = new Date();
        d.name = name;
        d.id = d.date.getTime() + d.name;
        d.lists = [];
        d.selected = true;
        d.color = d.date.getTime().toString().slice(-6);
        props.setActivePots(props.activePots.concat([d])    );
        props.setCurrentPot(d);
        // return d;
    }
    // console.log(props.activePots);
    // console.log(props.activePots.concat([newPot('to do')]));
    const activePots = props.activePots;
    


    const potRemoved = (el) => { console.log(el);  props.setActivePots(activePots.filter( (e) => e !== el))};


    const potClicked = (el) => { props.toggleSelectedPot && props.toggleSelectedPot(el); props.setCurrentPot && props.setCurrentPot(el)}

    // const potClicked = (el) => {  }
    const PotsListItem = (props) => ListItem(props, { 'onClick': [potClicked], 'onSelected': [], 'onRemove' : [potRemoved] });


    const pots = useCustomMapData(activePots, (a) => (a), PotsListItem, renderListItem, (a) =>  ( {isSelected: props.isSelectedPotFn(a)} ));

    return (
        <React.Fragment>
            {pots}
            < div className="list flex " >
                <form className={"py-2 px-4 text-left border-t border-b border-gray-300 py-3 self-end flex justify-center w-full"} onSubmit={newPotForm}>
                    <input name="potName" className="flex-1 max-w-full bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 leading-normal" autoComplete="off" />
                    <button className="flex-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">+</button>

                </form>
            </div >
        </React.Fragment>

    )
}

export default SelectPots;
