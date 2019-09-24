import React, {useState, useRef} from 'react';
import RenderModal from './renderModal';

const RenderSettings = (props) => (
    <RenderModal>
        <div className="w-full flex my-2 flex-wrap ">
            <div className="text-lg text-gray-700 font-bold pb-4 w-full flex">
                <h2 className="flex-1 text-left">Edit API Key</h2>
                <button onClick={props.close} className={"align-right font-light px-2 rounded border-gray-100 deg45 font-bold text-xl select-none"}>+</button>
            </div>
            
            <div className="w-full flex flex-wrap mb-4">
                <label htmlFor="trelloToken" className="w-full self-center pt-4 text-left text-gray-500 font-bold">Trello Token</label>
                <p className="font-light text-md text-left text-gray-700 my-2">Leave blank and click save to restore to default.</p>

                <input ref={props.apiRef} defaultValue={props.ApiKey} className="flex-1 w-full max-w-full bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 leading-normal w-full" name="trelloToken" type="text"></input>
            </div>
            <button onClick={props.stash} className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded border-box text-sm">
                Save
            </button>
        </div>
    </RenderModal>
)
const Login = (props) => {
    const [showSettings, setShowSettings] = useState(false);
    const apiRef = useRef(null);
    return(
        <React.Fragment>
            {showSettings && 
                <RenderSettings 
                    apiRef={apiRef} 
                    ApiKey={props.ApiKey} 
                    close={ () => setShowSettings(!showSettings)} 
                    stash={ () => {props.setKey(apiRef.current.value); setShowSettings(!showSettings) }}
                />
            }
            <div className="flex-1 overflow-auto max-w-xl self-center flex w-full">

                <div className="bg-white flex-0 self-center p-8 pb-4 rounded w-full max-h-full overflow-auto sm:1/3">
                    <div className="w-full font-bold text-left">
                        {props.fetchData.error && props.ApiToken &&
                            <div className="rounded px-2 mb-2 w-full bg-red-400 text-lg text-white font-medium">! Error, credentials incorrect - could not connect to Trello!</div>
                        }
                        <h1 className="text-2xl">Trelloverview</h1>
                        <h2 className="text-xl text-gray-500">Welcome!</h2>
                        <p className="font-light text-lg text-gray-700">Trelloverview allows you to route boards to custom lists ('pots'), allowing you to see the contents of multiple boards at a glance.</p>
                        <p className="font-light text-lg text-gray-700 mt-2">In order to use this service, please enter a valid Trello API token. If you have not generated a token for this app (and API key) already, you can generate one by clicking the 'Generate Token' button and following
                            the instructions. Once you have generated a token, you can copy the token, close that tab/window, and paste it in the box below. </p>
                        <p className="font-light text-md text-gray-500 mt-2">In the event of too many users using the default API key at once, it may be desirable to use a custom one. It is recommended that if you generate your own API key, you create a new account to do so. If you have changed the API Key, you will need to generate a new token too.</p>
                    </div>

                    <div className="pt-8 justify-start text-left justify-between flex">
                        <a className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded border-box text-sm"
                            target="_blank" rel="noopener noreferrer" href={"https://trello.com/1/authorize?expiration=30days&name=Trelloverview&scope=read&response_type=token&key="+props.ApiKey}>Generate Token</a>
                        <button className="hover:bg-gray-500 text-gray-500 font-semibold hover:text-white py-1 px-1 border border-gray-300 hover:border-transparent rounded border-box text-sm self-center"
                            onClick={(e) => { e.preventDefault(); setShowSettings(!showSettings)} }>Enter custom API Key</button>
                    </div>

                    <div className="w-full flex my-2 flex-wrap">
                        <label htmlFor="trelloToken" className="w-full self-center pt-4 text-left text-gray-500 font-bold">Trello Token</label>
                        <input onBlur={(e) => props.stash(e.target.value)} className="flex-1 w-full max-w-full bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 leading-normal" name="trelloToken" type="text"></input>
                    </div>

                    {!props.fetchData.error && props.ApiToken &&

                        <div className="w-full flex text-right justify-end">
                            <button
                                onClick={(props.handleProgressStage)}
                                className="self-center hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded border-box">Next</button>
                        </div>
                    }

                    <div className="w-full font-bold text-left border-t border-gray-300 mt-8">
                        <p className="font-bold text-gray-400 mt-2 text-sm ">
                            Made with ❤️ by  <a  className="underline" target="_blank" href="https://thomasbarratt.co.uk">Thomas Barratt</a>. 
                            <a target="_blank" href="https://github.com/thomas1151/trelloverview" rel="noreferrer noopener" 
                                className="hover:text-blue-500 text-blue-300 font-semibold px-1 hover:border-transparent rounded border-box text-sm font-light">Github</a> </p>
                    </div>



                </div>
            </div>
        </React.Fragment>

    )
}

export default Login;