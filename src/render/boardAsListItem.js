import React from 'react';

/**
 * Renders a board, showing name and last activity date.
 * @param {Object} board
 */
const RenderBoard = (board, { onClick = () => (console.log("Default click")), isSelected } = {}) => (
    <div className="flex outer boardCard w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 self-stretch " key={board.id} >
        <div className={"inner p-2 border-2  m-1 bg-white w-full " + (isSelected ? 'border-orange-400 ' : ' border-gray-200 ')} onClick={onClick} >
            <h2 className="font-medium">{board.name}</h2>
            <div className="last-active" className="font-book text-blue-700"><a target="_blank" rel="noopener noreferrer" href={board.url}>{new Date(board.dateLastActivity).toLocaleString()}</a></div>
        </div>
    </div>
);

export default RenderBoard