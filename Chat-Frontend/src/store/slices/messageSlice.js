import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "messages",
    initialState: {},
    reducers: {
        addMessages: (state, action) => {
            state[action.payload.id] = action.payload.messages;
            return state;
        },
        addEmptyMessage: (state, action) => {
            state[action.payload] = [];
            return state;
        },
        addNewMessage: (state, action) => {
            if (state[action.payload.senderId])
                state[action.payload.senderId].push(action.payload);
            if (state[action.payload.receiverId])
                state[action.payload.receiverId].push(action.payload);
            return state;

        },       
        deleteMessage: (state, action) => {
            state[action.payload.id] = state[action.payload.id].filter(msg => msg._id !== action.payload.mId);
            return state;
        }
    }
});
export const messageActions = messageSlice.actions;
export default messageSlice;