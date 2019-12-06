// import * as Redux from "redux";
import { createStore } from "redux";

// Nodes
const input = document.querySelector("input");
const ul = document.querySelector("ul");
let todos = {
  0: {
    text: "Ir al cine",
    done: false
  },
  1: {
    text: "Cenar",
    done: true
  },
  2: {
    text: "Grabar",
    done: false
  }
};

// Functions
const drawTodos = () => {
  ul.innerHTML = "";
  // Sustituimos los todos antes de dibujar
  todos = store.getState();
  for (const key in todos) {
    let li = document.createElement("li");
    const doneClass = todos[key].done ? "done" : "";
    li.innerHTML = `
        <span id="${key}" class="${doneClass}">${todos[key].text}</span>
        <span data-id="${key}" data-action="delete">X</span>
    `;
    setListeners(li);
    ul.appendChild(li);
  }
};

const setListeners = li => {
  li.addEventListener("click", e => {
    if (e.target.getAttribute("data-action") === "delete") {
      const key = e.target.getAttribute("data-id");
      // Redux: Borrando
      store.dispatch({
        type: "DELETE_TODO",
        id: key
      });
      // delete todos[key];
      // drawTodos();
      return;
    }
    const key = e.target.id;
    todos[key].done = !todos[key].done;
    store.dispatch({
      type: "UPDATE_TODO",
      todo: todos[key]
    });

    // Redux: Al estar suscrito, Redux llama a la función drawTodos cuando detecta un cambio
    // drawTodos();
  });
};

// Listeners
input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    // const text = e.target.value;
    // const id = Object.keys(todos).length;
    // todos[id] = { text, done: false };
    // drawTodos();
    // input.value = "";

    // Con Redux
    const text = e.target.value;
    const todo = { text, done: false };
    // Redux: EL método dispatch ejecuta acciones del reducer y recibe como parámetro un objeto con lo que hayamos programado (type y todo)
    store.dispatch({
      type: "CREATE_TODO",
      todo
    });
    // Limpiamos el campo
    input.value = "";
  }
});

/*******************************/
/************ REDUX ************/
/*******************************/

// Reducer: una función que se dedica a trabajar con los datos que viven en el store
const todosReducer = (state = {}, action) => {
  switch (action.type) {
    case "CREATE_TODO":
      // Redux necesita inmutabilidad, por lo que no es recomendable hacer push o algo del estilo:
      // { state[Object.keys(state).length] : action.todo }
      // Es mejor reemplazar el objeto anterior haciendo una copia con el spread operator
      // NOTA: Asignamos la propiedad id a cada todo para después poder actualizarla con el update_todo
      action.todo["id"] = Object.keys(state).length;
      return { ...state, [Object.keys(state).length]: action.todo };
    case "UPDATE_TODO":
      return { ...state, [action.todo.id]: action.todo };
    case "DELETE_TODO":
      delete state[action.id];
      return { ...state };
    default:
      return state;
  }
};

// Store: almacén de datos - Se crea con el método createStore de redux y el reducer se pasa como parámetro
let store = createStore(todosReducer, {
  // Como segundo parámetro, podemos decirle a redux con qué data queremos inicializar el store
  0: {
    id: 0,
    text: "Crear store",
    done: true
  }
});

// Subscribe: Cuando escuche algún cambio en el store, entonces dibujaré los todos de nuevo
store.subscribe(drawTodos);

// Init
drawTodos();
