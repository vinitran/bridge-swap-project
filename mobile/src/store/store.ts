import { configureStore } from "@reduxjs/toolkit";
import walletRducer from "./wallet.slice";

export const store = configureStore({
    reducer: walletRducer
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch