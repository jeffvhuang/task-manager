import C from "./userConstants";
import T from "../tasks/taskConstants";
import userService from "../../services/userService";
import cookieService from "../../services/cookieService";
import { message } from "antd";

export const login = (email, password) => async (dispatch, getState) => {
    // Only load data if it's something we don't already have (and are not already loading)
    const appState = getState();
    if (appState.user?.email !== email) {
        dispatch({ type: C.LOGIN_USER_REQUEST });

        try {
            const response = await userService.login(email, password);

            cookieService.setUserToken(response.token);
            delete response.token

            dispatch({ type: C.LOGIN_USER_SUCCESS, payload: response.user });
            return;
        } catch (e) {
            dispatch({ type: C.LOGIN_USER_FAILURE });
            message.error(e);
            return Promise.reject(e);
        }
    }
}

export const logout = () => async (dispatch) => {
    dispatch({ type: C.LOGOUT_USER_REQUEST });
    dispatch({ type: T.CLEAR_TASKS })

        try {
            const token = cookieService.getUserToken()
            await userService.logout(token);
            cookieService.removeUserToken()

            dispatch({ type: C.LOGOUT_USER_SUCCESS });
        } catch (e) {
            dispatch({ type: C.LOGOUT_USER_FAILURE });
            message.error(e);
        }
}

export const createAccount = (user) => async (dispatch) => {
    dispatch({ type: C.CREATE_USER_REQUEST });

    try {
        const response = await userService.createUser(user);
        cookieService.setUserToken(response.token);
        delete response.token

        dispatch({ type: C.CREATE_USER_SUCCESS, payload: response.user });
        return;
    } catch (e) {
        dispatch({ type: C.CREATE_USER_FAILURE });
        message.error(e);
        return Promise.reject(e)
    }
}