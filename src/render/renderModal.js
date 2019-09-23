import React from 'react';

export default function RenderModal(props){
    return(
        <div className="absolute flex-1 self-center flex w-full h-full">
            <div className="absolute w-full h-full bg-gray-700  opacity-50 z-0">

            </div>
            <div className="bg-white flex-0 self-center p-8 pb-4 rounded w-full sm:w-1/3 z-10 mx-auto">
                <div className>
                    {props.content && props.content}
                    {props.children && props.children}
                </div>
            </div>
        </div>  
    )

}