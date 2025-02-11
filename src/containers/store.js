import { configureStore } from "@reduxjs/toolkit";

import userSocketStatusReducer from "./userSocketStatusSlice";

export const myStore = configureStore({
  reducer: {
    userSocketStatus: userSocketStatusReducer,
  },
})