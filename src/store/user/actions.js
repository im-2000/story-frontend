import { apiUrl } from "../../config/constants";
import axios from "axios";
import { selectToken } from "./selectors";
import { appLoading, appDoneLoading, setMessage } from "../appState/slice";
import { showMessageWithTimeout } from "../appState/actions";
import {
  loginSuccess,
  logOut,
  tokenStillValid,
  spaceUpdated,
  storyDeleteSuccess,
} from "./slice";

export const signUp = (name, email, password) => {
  return async (dispatch, getState) => {
    dispatch(appLoading());
    try {
      const response = await axios.post(`${apiUrl}/auth/signup`, {
        name,
        email,
        password,
      });

      dispatch(
        loginSuccess({ token: response.data.token, user: response.data.user })
      );
      dispatch(showMessageWithTimeout("success", true, "account created"));
      dispatch(appDoneLoading());
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        dispatch(
          setMessage({
            variant: "danger",
            dismissable: true,
            text: error.response.data.message,
          })
        );
      } else {
        console.log(error.message);
        dispatch(
          setMessage({
            variant: "danger",
            dismissable: true,
            text: error.message,
          })
        );
      }
      dispatch(appDoneLoading());
    }
  };
};

export const login = (email, password) => {
  return async (dispatch, getState) => {
    dispatch(appLoading());
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      dispatch(
        loginSuccess({ token: response.data.token, user: response.data.user })
      );
      dispatch(showMessageWithTimeout("success", false, "welcome back!", 1500));
      dispatch(appDoneLoading());
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        dispatch(
          setMessage({
            variant: "danger",
            dismissable: true,
            text: error.response.data.message,
          })
        );
      } else {
        console.log(error.message);
        dispatch(
          setMessage({
            variant: "danger",
            dismissable: true,
            text: error.response.data.message,
          })
        );
      }
      dispatch(appDoneLoading());
    }
  };
};

export const getUserWithStoredToken = () => {
  return async (dispatch, getState) => {
    // get token from the state
    const token = selectToken(getState());

    // if we have no token, stop
    if (token === null) return;

    dispatch(appLoading());
    try {
      // if we do have a token,
      // check wether it is still valid or if it is expired
      const response = await axios.get(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("response", response.data.user);
      // token is still valid
      dispatch(
        tokenStillValid({
          user: response.data.user,
          space: response.data.space,
        })
      );
      dispatch(appDoneLoading());
    } catch (error) {
      if (error.response) {
        console.log(error.response.message);
      } else {
        console.log(error);
      }
      // if we get a 4xx or 5xx response,
      // get rid of the token by logging out
      dispatch(logOut());
      dispatch(appDoneLoading());
    }
  };
};

export const updateMySpace = (title, description, backgroundColor, color) => {
  return async (dispatch, getState) => {
    try {
      const { space, token } = getState().user;
      dispatch(appLoading());

      const response = await axios.patch(
        `${apiUrl}/spaces/${space.id}`,
        {
          title,
          description,
          backgroundColor,
          color,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);

      dispatch(
        showMessageWithTimeout("success", false, "update successfull", 3000)
      );
      dispatch(spaceUpdated(response.data.space));
      dispatch(appDoneLoading());
    } catch (e) {
      console.log(e.message);
    }
  };
};

// DELETE STORY

export const deleteStory = (storyId) => {
  return async (dispatch, getState) => {
    dispatch(appLoading());
    const { space, token } = getState().user;
    const spaceId = space.id;
    // make an axios request to delete
    // and console.log the response if success
    try {
      const response = await axios.delete(
        `${apiUrl}/spaces/${spaceId}/stories/${storyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Story deleted?", response.data);
      dispatch(storyDeleteSuccess(storyId));
      dispatch(appDoneLoading());
    } catch (e) {
      console.error(e);
    }
  };
};
