import { createSlice } from '@reduxjs/toolkit'

const userInfoSlice = createSlice({
    name: 'userInfo',
    initialState: {
        isLogged: false,
        name: null
    },
    reducers: {
        storeLoggedUser: (state, action) => {
            state.isLogged = true;
            state.name = action.payload.name;
        },
        resetLoggedUser: (state, action) => {
            state.isLogged = false;
            state.name = null;
        }
    }
})

const { storeLoggedUser, resetLoggedUser } = userInfoSlice.actions

export const selectUserInfo = state => state.userInfo;

export const userInfoReducer = userInfoSlice.reducer;

//------------------

export const loginUser = (name) => async (dispatch) => {
    dispatch(storeLoggedUser({ name: name }));
};

export const logoutUser = () => async (dispatch) => {
    dispatch(resetLoggedUser());
};
