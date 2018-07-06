import axios from "axios";
import { ADD_POST, GET_ERRORS, POST_LOADING, GET_POSTS } from "./types";

//ADD POST
export const addPost = postData => dispatch => {
  axios
    .post("/api/posts", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//GET POST
export const getPost = () => dispatch => {
  axios
    .get("/api/posts")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

//SET LOADING STATE
export const setPostingLoading = () => {
  return {
    type: POST_LOADING
  };
};
