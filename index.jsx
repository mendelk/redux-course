require('./node_modules/bootstrap/dist/css/bootstrap.min.css');
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';

// const combineReducers = (reducers) => {
//   return (state = {}, action) => {
//     return Object.keys(reducers).reduce((nextState, key) => {
//       nextState[key] = reducers[key](state[key], action);
//       return nextState;
//     }, {});      
//   };
// };
// const createStore = (reducer) => {
//   let state = reducer(undefined, {});
//   let getState = () => state;
//   let dispatch = (action) => {
//     state = reducer(state, action);
//   };
//   return { getState, dispatch };
// };
const todo = (state = {}, action) => {
  switch (action.type) {
  case 'ADD_TODO':
    return { id: action.id, text: action.text, completed: false };
  case 'TOGGLE_TODO':
    if (state.id !== action.id) return state;
    return { ...state, completed: !state.completed };
  default:
    return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
  case 'ADD_TODO':
    return [...state, todo(undefined, action)];
  case 'TOGGLE_TODO':
    return state.map(t => todo(t, action));
  default:
    return state;
  }
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
  switch (action.type) {
  case 'SET_VISIBILITY_FILTER':
    return action.filter;
  default:
    return state;
  }  
};
const todoApp = combineReducers({ todos, visibilityFilter });
const store = createStore(todoApp);

// console.log(store.getState());
// store.dispatch({type: 'SET_VISIBILITY_FILTER', filter: 'MENDEL'});
// console.log(store.getState());

let nextTodoId = 0;

class TodoApp extends React.Component {
  render () {
    return (
      <div>
        <button onClick={() => store.dispatch({type: 'ADD_TODO', text: 'Test', id: nextTodoId++})}>
          Add Todo
        </button>
        <ul>
          {store.getState().todos.map((t) => 
            <li key={t.id}>{t.text}</li>
          )}
        </ul>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp />,
    document.querySelector('#myApp')
  );
};
render();
store.subscribe(render);
