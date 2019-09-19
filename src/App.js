import React, { useEffect, useState } from 'react';
import './assets/styles/css/App.css';
import  ListItem from './components/listItem';
import useFetch from './hooks/useFetch';
import useGetData from './hooks/useGetData';
import SelectLists from './views/selectLists';
import Board from './components/board';
import Loading from './render/loading';
import renderCardFn from './render/card';
import renderHeaderFn from './render/header';
import useLocalStorageTokenManagement from './hooks/useLocalStorageTokenManagement';


/**
 * Renders a board, showing name and last activity date.
 * @param {Object} board
 */
const renderBoard = (board, { onClick = () => (console.log("Default click")), isSelected } = {}) => (
  <div className="flex outer boardCard w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4 self-stretch " key={board.id} >
    <div className={"inner p-2 border-2  m-1 bg-white w-full " + (isSelected ? 'border-orange-400 ' : ' border-gray-200 ')} onClick={onClick} >
      <h2 className="font-medium">{board.name}</h2>
      <div className="last-active" className="font-book text-blue-700"><a target="_blank" rel="noopener noreferrer"  href={board.url}>{new Date(board.dateLastActivity).toLocaleString()}</a></div>
    </div>
  </div>
);

/**
 * Gets an element by source to look at, property and value given. Returns first if multiple.
 */
const getElementByProperty = (source, property, value) => (source.find((e) => e[property] === value) || {})



function App() {
  //Trello generated key and token.

  /**
   * We need a key, token, selectedBoards and our selected pots to be able to show the user their boards
   */
  // const [key, setKey] = useState(localStorage.getItem('trelloKey') || "30581530286d16003f643e0ffa4c1700");
  // const [token, setToken] = useState(localStorage.getItem('trelloToken') );
  const [selectedBoards, setSelectedBoards] = useState(JSON.parse(localStorage.getItem('selectedBoards')) || []);
  const [activePots, setActivePots] = useState(JSON.parse(localStorage.getItem('activePots')) || []);

  // useEffect(() => {
  //   localStorage.setItem('trelloToken', token);
  // }, [token])

  useEffect(() => {
    localStorage.setItem('selectedBoards', JSON.stringify(selectedBoards));
  }, [selectedBoards, activePots])

  useEffect(() => {
    localStorage.setItem('activePots', JSON.stringify(activePots));
  }, [selectedBoards, activePots])



  
  const {stash, revoke, isStashed, token, key} = useLocalStorageTokenManagement();
  
  //Gets a list of all the boards the user has access to, based on the generated key and token.
  let fetchData = useFetch('https://api.trello.com/1/members/me/boards?key=' + key + '&token=' + token, [token]);
  
  /**
    <Stage handling logic>
  **/
  const stages = ['addTrelloDetails','selectBoard','selectLists','overview'];
  const chooseState = () => (token && !fetchData.error ?
    localStorage.getItem('selectedBoards') && JSON.parse(localStorage.getItem('selectedBoards')).length > 0 ?
      (localStorage.getItem('activePots') && JSON.parse(localStorage.getItem('activePots')).length > 0 ?
        stages[stages.indexOf('overview')] :
        stages[stages.indexOf('selectLists')])
      : stages[stages.indexOf('selectBoard')]
    :
    stages[0])
  const [stage, setStage] = useState(chooseState);
  
  useEffect(() => {
    switch( stage ){
      case 'addTrelloDetails':
        revoke()
        break;
    }
  }, [stage])



  //Let us just use the slug to generate a title.
  let stageAsTitle = stage.replace(/([A-Z])/g, " $1")
  stageAsTitle = stageAsTitle.charAt(0).toUpperCase() + stageAsTitle.slice(1);

  const handleProgressStage = (regress=false) => {
    switch (stage) {
      case 'addTrelloDetails':


        break;
      case 'selectBoard':
        // localStorage.setItem('selectedBoards', JSON.stringify(selectedBoards));
        break;
      case 'selectLists':
        // localStorage.setItem('activePots', JSON.stringify(activePots));
        break;

    }
    setStage(stages[stages.indexOf(stage) + 1])
  }

  /**
   * Reinitialises the boards and pots to have nothing in.
   * Given a stage will try and route the user there.
   * @param {*} stage 
   */
  const restart = (stage = 'selectBoard') => {
    setSelectedBoards([]);
    setActivePots([]);
    setStage(stage);
  }

  /**
   * Uses the curried restart function to restart back to the add token screen. 
   */
  const logOut = () => (restart('addTrelloDetails', true))
  /**
    </StageHandlingLogic>
  */


  /** 
   *  <Board selection event handlers, sorting, render>
   */

  /**
   * boardClicked event handler, we want to change the state of our selectedBoards to either 
   * add or remove whichever board has been clicked.
   * @param {*} board the board we've just clicked. 
   */
  const boardClicked = (board) => {
    console.log("Board clicked")
    const idx = selectedBoards.map( e => e.id).indexOf(board.id);
    if(idx > -1){
      //App knows board of id IS NOT selected now      
      setSelectedBoards(selectedBoards.filter(item => item.id !== board.id));
    }else{
      ///App knows board of id IS selected now      
      setSelectedBoards(selectedBoards.concat([board]));
    }
  }

  /**
   * Function to sort boards, currently reverse last activity date.
   * @param {array[Object]} arr 
   */
  const boardSortFn = (arr) => (
    arr.sort((a, b) => (new Date(b.dateLastActivity) - new Date(a.dateLastActivity)))
  )

  const BoardListItem = (props) => ListItem(props, { 'onClick': [boardClicked], 'onSelected': [] }); 



  const boardProps = (x) => {
    let bProps = {isSelected: false};
    // console.log(x);

    if (selectedBoards.some(e => e.id === x.id)) {
      bProps.isSelected = true;
    }
    return bProps;
  }
  /**
  *  </Board selection event handlers, sorting, render>
  */


  /**
   * Gets a list by property and value given. Returns first if multiple.
   */
  const getListByProperty = (property, value) => { for(let i = 0; i< activePots.length; i++){
      let r = activePots[i].lists.find(((e) => e[property] === value));
      if(r){
        return r;
      }
    }  
  }



  const renderCard = (card) => {
    let list = getListByProperty('id', card.idList);
    let board = getElementByProperty(selectedBoards, 'id', list.idBoard);
    return renderCardFn(card, list, board)
  }

  const renderOverview = (overviewProps, {onClick = () => (console.log("Default click")), isSelected }) => (    
      <div className="board flex flex-1 overflow-auto mx-2 w-full">
        {activePots.map( (pot) => (
          <div className="flex outer boardCard w-full flex-1 mb-4 mx-1 self-stretch" key={pot.id} >
            <div className={"text-left inner flex flex-col p-2 border-2  m-1 bg-white w-full  " + (isSelected ? 'border-orange-400 ' : ' border-gray-200 ')} onClick={onClick} >
              <div className=" mx-4">
                <h2 className="font-bold text-lg w-full py-1">{pot.name}</h2>
                <div className="font-book text-blue-700 pb-4 text-sm">
                  {pot.lists && pot.lists.map((list) => {
                    let board = getElementByProperty(selectedBoards, 'id', list.idBoard);
                    return(
                      <div className="hover:bg-blue-500 hover:text-white card inline-block border border-blue-700 rounded px-3 my-1 mr-2" key={list.id+pot.id} >
                        <a href={board.url} className={""}>{list.name} from <span className="max-w-xs">{board.name.length > 20 ? board.name.slice(0, 25)+"..." : board.name}</span></a>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="cardList overflow-auto w-full">
                {overviewProps.isLoading ? 
                    <Loading/>
                    :
                    pot.cards &&
                      pot.cards.length > 0 ?
                      pot.cards.map((card) => (
                        renderCard(card)
                      )) :
                      <h1>No cards in these lists.</h1> 
                }
              </div>

            </div>
          </div>        
        ))}
      </div>
  )


  const getData = useGetData(fetchData.error, fetchData.isLoading, fetchData.data, BoardListItem, renderBoard, boardSortFn, boardProps);
  
  return (
    <div className="App bg-gray-100 h-full flex flex-wrap flex-col">
      {renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart)}

      {stage === 'addTrelloDetails' &&

        <React.Fragment>
          <div className="flex-1 overflow-auto max-w-xl self-center flex w-full">
            <div className="bg-white flex-0 self-center p-8 rounded w-full sm:1/3">
              <div className="w-full font-bold text-left">
                {fetchData.error && token && 
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
                target="_blank" rel="noopener noreferrer"  href="https://trello.com/1/authorize?expiration=30days&name=Trelloverview&scope=read&response_type=token&key=30581530286d16003f643e0ffa4c1700">Generate Token</a>
              </div>

              <div className="w-full flex my-8 flex-wrap">
                <label htmlFor="trelloToken" className="w-full self-center pt-4 text-left text-gray-500 font-bold">Trello Token</label>
                <input onBlur={ (e) => stash(e.target.value)} className="flex-1 w-full max-w-full bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 leading-normal" name="trelloToken" type="text"></input>
              </div>

              <div className="w-full flex text-right justify-end">
                <button 
                  onClick={(handleProgressStage)}
                  className="self-center hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded border-box">Next</button>
              </div>
            </div>
          </div>
        </React.Fragment>
      }
      
      {stage === 'selectBoard' &&
        
        <React.Fragment>
        <div className={"boards-wrapper flex flex-1 overflow-auto flex-wrap "+(selectedBoards.length > 0 && 'mb-20')}>
          {getData}
        </div>

        {selectedBoards.length > 0 &&
          <div className="next w-full fixed bottom-0 flex flex-wrap border-t-4 border-blue-500 bg-white p-4">

            <p className="flex-1 text-left self-center text-sm">
              {selectedBoards.length} board(s) selected.
              Click next to select lists.                
            </p>
            <div className="w-full sm:w-auto flex justify-between">
              <button className="hover:bg-gray-500 text-gray-700 font-book hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded mx-2 text-sm"
                onClick={() => (restart())}>Clear selected boards</button>

              <button className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-2"
                onClick={handleProgressStage}>Next</button>
            </div>


          </div>
        }
        </React.Fragment>
      }

      {stage === 'selectLists' &&
        <React.Fragment>
        <div className={"lists-wrapper flex flex-1 overflow-auto flex-wrap flex-row " + (activePots.length > 0 && "mb-20")}>
            <SelectLists setActivePots={setActivePots} activePots={activePots} ApiKey={key} ApiToken={token} selectedBoards={selectedBoards} boardSortFn={boardSortFn} boardProps={boardProps}/>
          </div>

          { activePots.length > 0 &&
            <div className="next w-full fixed bottom-0 flex flex-wrap border-t-4 border-blue-500 bg-white p-4">
              <p className="flex-1 text-left self-center text-sm">
                 list(s) over {activePots.length} pot(s) selected.
              </p>
              <div className="w-full sm:w-auto flex justify-between">
                <button className="hover:bg-gray-500 text-gray-700 font-book hover:text-white py-2 px-4 border border-gray-500 hover:border-transparent rounded mx-2 text-sm"
                  onClick={() => (setSelectedBoards([]))}>Remove all pots.</button>

                <button className="hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mx-2"
                  onClick={handleProgressStage}>Show overview</button>
              </div>

            </div>
          }
        </React.Fragment>
      }


      {stage === 'overview' &&
        <React.Fragment>
          <Board
            activePots={activePots}
            setActivePots= {setActivePots}
            renderFn={renderOverview}
            ApiKey={key} ApiToken={token}
          />
          
        </React.Fragment>
      }

    </div>
  );
}

export default App;
