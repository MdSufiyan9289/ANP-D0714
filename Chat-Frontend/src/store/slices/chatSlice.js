import { createSlice } from "@reduxjs/toolkit";

const chatSlice=createSlice({
    name:"chat",
    initialState:true,
    reducers:{
        isVisible:(state,action)=>{
            state=action.payload
            return state;
        }
    }
});

export const chatActions= chatSlice.actions;
export default chatSlice;