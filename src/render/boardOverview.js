import React from 'react';
import getElementByProperty from '../components/functions/getElementByProperty'
import Card from '../components/card'
import Loading from '../render/loading'

const renderOverview = (props, { onClick = () => (console.log("Default click")), isSelected }) => (
    <div className="board flex flex-1 overflow-auto mx-2 w-full">
        {props.activePots.map((pot) => (
            <div className="flex outer boardCard w-full flex-1 mb-4 mx-1 self-stretch" key={pot.id} >
                <div className={"text-left inner flex flex-col p-2 border-2  m-1 bg-white w-full  " + (isSelected ? 'border-orange-400 ' : ' border-gray-200 ')} onClick={onClick} >
                    <div className="mx-4">
                        <div className=" w-full py-1 flex">
                            <div className="font-bold text-lg">{pot.name}</div>
                            {pot.cards && pot.cards.length > 0 && props.isLoading && <div className="inline-block border border-blue-700 rounded px-3 ml-2">Updating</div>}
                        </div >
                        <div className="font-book text-blue-700 pb-4 text-sm  max-h-10vh overflow-auto">
                            {pot.lists && pot.lists.map((list) => {
                                let board = getElementByProperty(props.selectedBoards, 'id', list.idBoard);
                                return (
                                    <div className="hover:bg-blue-500 hover:text-white card inline-block border border-blue-700 rounded px-3 my-1 mr-2" key={list.id + pot.id} >
                                        <a target="_blank" rel="noopener noreferrer" href={board.url} className={""}>{list.name} from <span className="max-w-xs">{board.name.length > 20 ? board.name.slice(0, 25) + "..." : board.name}</span></a>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="cardList overflow-auto w-full">

                        { 
                            pot.cards && pot.cards.length > 0?
                                    pot.cards.map((card) => (
                                        <Card key={card.id} card={card} selectedBoards={props.selectedBoards} activePots={props.activePots} />
                                    ))
                                :
                                props.isLoading ? 
                                    <Loading/>
                                    :
                                    <div className="text-center">No cards to display.</div>
                            
                        }




                    </div>

                </div>
            </div>
        ))}
    </div>
)

export default renderOverview;