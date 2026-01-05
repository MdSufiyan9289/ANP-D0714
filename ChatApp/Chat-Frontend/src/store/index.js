import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slices/chatSlice";
import messageSlice from "./slices/messageSlice";

const chatStore=configureStore({
    reducer:{
        isVisible:chatSlice.reducer,
        messages:messageSlice.reducer
    }
});
export default chatStore;