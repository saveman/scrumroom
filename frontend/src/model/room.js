import { createSlice } from '@reduxjs/toolkit'

const roomSlice = createSlice({
    name: 'room',
    initialState: {
        state: {
            users: [],
            voting: {
                title: '',
                votes: {}
            }
        }
    },
    reducers: {
        updateRoomState: (state, action) => {
            state.state = action.payload;
        },
        setVotingTitleInternal: (state, action) => {
            state.state.voting.title = action.payload;
        }
    }
})

const { updateRoomState, setVotingTitleInternal } = roomSlice.actions
export { updateRoomState };

export const selectRoomState = state => state.room.state;

export const roomReducer = roomSlice.reducer;

//------------------

export const setVotingTitle = (title) => async (dispatch) => {
    dispatch(setVotingTitleInternal(title));
    // TODO: send via socket
};
