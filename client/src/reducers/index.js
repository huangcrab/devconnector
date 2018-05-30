import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errReducer from "./errReducer";
export default combineReducers({
  auth: authReducer,
  errors: errReducer
});
