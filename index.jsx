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

let nextTodoId = 0;

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

const AddTodo = ({ store }) => {
  let input;
  return (
    <div>
      <input ref={node => input = node} />
      <button onClick={() => {
        store.dispatch({type: 'ADD_TODO', text: input.value, id: nextTodoId++})
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  )
}

const Link = ({ active, onClick, children}) => {
  if (active) {
    return <span>{children}</span>;
  }
  return <a href="#" onClick={onClick}>{children}</a>;
};

class FilterLink extends React.Component {
  componentDidMount () {
    this.unsubscribe = this.props.store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  render () {
    const props = this.props;
    const {store} = props;
    const state = store.getState();
    return (
      <Link
        active={props.visibilityFilter === state.visibilityFilter}
        onClick={() => store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          filter: props.filter
        })}
      >{props.children}</Link>
    ) 
  }
}

class VisibleTodoList extends React.Component {
  componentDidMount () {
    this.unsubscribe = this.props.store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  render () {
    const { store } = this.props;
    const state = store.getState();
    return (
      <TodoList
        todos={getVisibleTodos(state.todos, state.visibilityFilter)}
        onTodoClick={id => store.dispatch({type: 'TOGGLE_TODO', id })}
      />
    )
  }
}


const Footer = ({ store }) => {
  return (
    <p>
      <FilterLink store={store} filter='SHOW_ALL'>All</FilterLink>
      <FilterLink store={store} filter='SHOW_ACTIVE'>Active</FilterLink>
      <FilterLink store={store} filter='SHOW_COMPLETED'>Completed</FilterLink>
    </p>
  );
}

const TodoApp = ({ store }) => {
  return (
    <div>
      <AddTodo store={store} />
      <VisibleTodoList store={store} />
      <Footer store={store} />
    </div>
  );
}

const todoApp = combineReducers({ todos, visibilityFilter });

ReactDOM.render(
  <TodoApp store={createStore(todoApp)} />,
  document.querySelector('#myApp')
);
