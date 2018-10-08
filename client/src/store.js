// import { createStore, applyMiddleware, compose } from "redux";
// import thunk from "redux-thunk";
// import rootReducer from "./reducers";

// const initialState = {};

// const middleware = [thunk];

// const store = createStore(
//   rootReducer,
//   initialState,
//   compose(
//     applyMiddleware(...middleware),
//     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
//   )
// );

// export default store;
import { createStore, compose, applyMiddleware } from "redux";
import { createEpicMiddleware } from "redux-observable";
import { createReducer } from "./reducer";
import { epic } from "./epic";

import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {};

const configureStore = () => {
  const epicMiddleware = createEpicMiddleware(epic);
  const enhancers = composeEnhancers(applyMiddleware(epicMiddleware));
  const store = createStore(
    createReducer(),
    initialState,
    composeWithDevTools(
      applyMiddleware(epicMiddleware)
      // other store enhancers if any
    )
  );
  return store;
};

export { configureStore };
