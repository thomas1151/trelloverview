import React from 'react';

const renderHeaderFn = (stages,  stage, setStage, stageAsTitle, logOut, restart) => (
    <header className="bg-blue-500 px-4 flex w-full">
        <h1 className="text-lg font-bold text-left text-white flex-1 self-center">{stageAsTitle}</h1>
        <div className="flex flex-wrap  px-2">
            {stages.indexOf(stage) > 0 &&
                <div className="button-wrap">
                    <button id="logoutButton"  className="text-white border-white hover:bg-blue-700 font-semibold py-1 px-4 border hover:border-blue-500 hover:border-transparent rounded mx-2 my-1"
                        onClick={() => logOut()}>
                        Logout
                    </button>

                    <button id="restartButton"  className="text-white border-white hover:bg-blue-700 font-semibold py-1 px-4 border hover:border-blue-500 hover:border-transparent rounded mx-2 my-1"
                        onClick={() => restart()}>
                        Restart
                    </button>
                    {stages.indexOf(stage) > 1  &&
                        <button id="backButton" className="text-white border-white hover:bg-blue-700  font-semibold py-1 px-4 border hover:border-blue-500 hover:border-transparent rounded mx-2 my-1"
                            onClick={() => (setStage(stages[stages.indexOf(stage) - 1]))}>
                            Back
                        </button>
                    }
                </div>
            }
        </div>
    </header>
);
export default renderHeaderFn;


