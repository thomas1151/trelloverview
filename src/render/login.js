import React from 'react';
const Login = (props) => (
    <div className="flex-1 overflow-auto max-w-xl self-center flex w-full">
        <div className="bg-white flex-0 self-center p-8 rounded w-full sm:1/3">
            <div className="w-full font-bold text-left">
                {props.fetchData.error && props.token &&
                    <div className="rounded px-2 mb-2 w-full bg-red-400 text-lg text-white font-medium">! Error, credentials incorrect - could not connect to Trello!</div>
                }
                <h1 className="text-2xl">Trelloverview</h1>
                <h2 className="text-xl text-gray-500">Welcome!</h2>
                <p className="font-light text-lg text-gray-700">Trelloverview allows you to route boards to custom lists ('pots'), allowing you to see the contents of multiple boards at a glance.</p>
                <p className="font-light text-lg text-gray-700 mt-2">In order to use this service, please enter a valid Trello API token. If you do not have a token already, you can generate one by clicking the 'Generate Token' button and followng
                    the instructions. Once you have generated a token, you can copy the token, close that tab/window, and paste it in the box below. </p>
            </div>

            <div className="pt-8 justify-start text-left">
                <a className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded border-box text-sm"
                    target="_blank" rel="noopener noreferrer" href="https://trello.com/1/authorize?expiration=30days&name=Trelloverview&scope=read&response_type=token&key=30581530286d16003f643e0ffa4c1700">Generate Token</a>
            </div>

            <div className="w-full flex my-8 flex-wrap">
                <label htmlFor="trelloToken" className="w-full self-center pt-4 text-left text-gray-500 font-bold">Trello Token</label>
                <input onBlur={(e) => props.stash(e.target.value)} className="flex-1 w-full max-w-full bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 leading-normal" name="trelloToken" type="text"></input>
            </div>

            {!props.fetchData.error && props.token &&

                <div className="w-full flex text-right justify-end">
                    <button
                        onClick={(props.handleProgressStage)}
                        className="self-center hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded border-box">Next</button>
                </div>
            }
        </div>
    </div>
)

export default Login;