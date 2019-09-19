import React, { useEffect } from 'react';

const renderCardFn = (card, list, board) => (
    <div className="card px-4 text-left border-t border-b border-gray-300 py-3 flex flex-row flex-wrap" key={card.id} >

        <div className="card-header flex-1 flex">
            <div className="flex flex-1 flex-wrap">
                <p className="w-full font-semibold py-0">{card.name}</p>
                <div className="w-full text-gray-800 text-sm">{new Date(card.dateLastActivity).toLocaleString()} | {list.name} from {board.name}</div>
            </div>
            <a target="_blank" rel="noopener noreferrer"  className="self-center hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded mx-2 border-box text-sm" href={card.url}>View</a>
        </div>
        <div className="w-full">
            <div className="labels py-2 flex rounded-lg">
                {card.labels.map((label, i) => 
                    <div key={label.id ? label.id: i} 
                    className={"flex pr-3 border rounded-lg font-medium text-sm leading-none border-l-8 " + (i > 0 && 'mx-2')} 
                    style={{ borderColor: label.color }}>
                        <p className="pl-1 py-1 text-xs">{label.name}</p>
                    </div>
                )}
            </div>
        </div>

    </div>
);
export default renderCardFn;
