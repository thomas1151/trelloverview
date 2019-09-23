import React, { useEffect, useState } from 'react';
import './assets/styles/css/App.css';
import  ListItem from './components/listItem';
import useFetch from './hooks/useFetch';
import useGetData from './hooks/useGetData';
import SelectLists from './views/selectLists';
import Board from './components/board';
import renderHeaderFn from './render/header';
import useLocalStorageTokenManagement from './hooks/useLocalStorageTokenManagement';
import renderOverview from './render/boardOverview';
import BoardSelection from './components/boardSelection';
import boardProps from './components/functions/propGenerators/boardAsListItemProps';
import sortBoard from './components/functions/sortBoard';
import cleanUpByCompare from './components/functions/cleanUpByCompare';
import Login from './render/login';



function App() {
  //Trello generated key and token.

  /**
   * We need a key, token, selectedBoards and our selected pots to be able to show the user their boards
   */
  // const [key, setKey] = useState(localStorage.getItem('trelloKey') || "30581530286d16003f643e0ffa4c1700");
  // const [token, setToken] = useState(localStorage.getItem('trelloToken') );
  const [selectedBoards, setSelectedBoards] = useState(JSON.parse(localStorage.getItem('selectedBoards')) || []);
  const [activePots, setActivePots] = useState(JSON.parse(localStorage.getItem('activePots')) || []);

  /**
   * Pot logic
   */
  const [potsCleaned, setPotsCleaned] = useState(false);
  
  /**
   * This removes any lists that may still be kicking around despite not being selected anymore.
   * Getting rid of these means that if the user was to select the list again, the config wouldn't magically reappear,
   * and that the overview display wouldn't try and show dead lists.
   */
  const potsCleanup = () => {
    if (activePots){
      let r = activePots.map(pot => {
        pot.lists = cleanUpByCompare(selectedBoards, pot.lists, 'id', 'idBoard');
        return pot;
      })
      setActivePots(r);
    }else{
      setActivePots([]);
    }
    setPotsCleaned(true);
  }

  useEffect(() => {
    setPotsCleaned(false);
  }, [selectedBoards])
  useEffect(() => {
    if (!potsCleaned) {
      potsCleanup();
    }
  }, [potsCleaned])



  useEffect(() => {
    localStorage.setItem('selectedBoards', JSON.stringify(selectedBoards));
  }, [selectedBoards, activePots])

  useEffect(() => {
    localStorage.setItem('activePots', JSON.stringify(activePots));
  }, [selectedBoards, activePots])


  //cleanUpPots();
  const {stash, revoke, isStashed, token, key, setKey} = useLocalStorageTokenManagement();
  
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
  const logOut = () => (restart('addTrelloDetails'))
  /**
    </StageHandlingLogic>
  */

  // complete the boardProps by passing selectedBoards.
  const BoardProps = (x) => (boardProps(selectedBoards, x))

  return (
    <div className="App bg-gray-100 h-full flex flex-wrap flex-col">
      {renderHeaderFn(stages, stage, setStage, stageAsTitle, logOut, restart)}

      {stage === 'addTrelloDetails' &&
        <Login ApiKey={key} ApiToken={token} stash={stash} fetchData={fetchData} handleProgressStage={handleProgressStage} setKey={setKey} />
      }
      
      {stage === 'selectBoard' &&
        
        <React.Fragment>
        <div className={"boards-wrapper flex flex-1 overflow-auto flex-wrap "+(selectedBoards.length > 0 && 'mb-20')}>
          <BoardSelection setSelectedBoards={setSelectedBoards} selectedBoards={selectedBoards} boardsFetch={fetchData} />
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
            <SelectLists setActivePots={setActivePots} activePots={activePots} ApiKey={key} ApiToken={token} selectedBoards={selectedBoards} boardSortFn={sortBoard} boardProps={BoardProps}/>
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
            selectedBoards = {selectedBoards}
          />
          
        </React.Fragment>
      }

    </div>
  );
}

export default App;
