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

const FilterLink = ({ currentFilter, filter, children, onClick}) => {
  if (currentFilter === filter) {
    return (
      <span>{children}</span>
    )
  }
  return (
    <a href="#" onClick={e => {
      e.preventDefault();
      onClick(filter);
    }}>{children}</a>
  );
};

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
  case 'SHOW_ALL':
    return todos;
  case 'SHOW_ACTIVE':
    return todos.filter(t => !t.completed);
  case 'SHOW_COMPLETED':
    return todos.filter(t => t.completed);
  }
}

const Todo = ({ onClick, completed, text }) => {
  return (
    <li
      style={{textDecoration: completed ? 'line-through' : 'none'}}
      onClick={onClick}
    >{text}</li>
  )
}

const TodoList = ({ todos, onTodoClick }) => {
  return (
    <ul>
      {todos.map((t) => <Todo onClick={() => onTodoClick(t.id)} key={t.id}  {...t} /> )}
    </ul>    
  );
}

const AddTodo = ({ onAddClick }) => {
  let input;
  return (
    <div>
      <input ref={node => input = node} />
      <button onClick={() => {
        onAddClick(input.value)
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  )
}

const Footer = ({ visibilityFilter, onFilterClick }) => {
  return (
    <p>
      <FilterLink filter='SHOW_ALL' currentFilter={visibilityFilter} onClick={onFilterClick}>All</FilterLink>
      <FilterLink filter='SHOW_ACTIVE' currentFilter={visibilityFilter} onClick={onFilterClick}>Active</FilterLink>
      <FilterLink filter='SHOW_COMPLETED' currentFilter={visibilityFilter} onClick={onFilterClick}>Completed</FilterLink>
    </p>
  );
}

const TodoApp = ({ todos, visibilityFilter }) => {
  return (
    <div>
      <AddTodo onAddClick={text => store.dispatch({type: 'ADD_TODO', text, id: nextTodoId++})} />
      <TodoList todos={getVisibleTodos(todos, visibilityFilter)} onTodoClick={id => store.dispatch({type: 'TOGGLE_TODO', id })} />
      <Footer visibilityFilter={visibilityFilter} onFilterClick={(filter) => store.dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter
      })} />
    </div>
  );
}

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />,
    document.querySelector('#myApp')
  );
};
render();
store.subscribe(render);
