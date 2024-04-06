import { createSlice } from "@reduxjs/toolkit";

interface WalletSlice {
    address: string;
}

const defaultState: WalletSlice = {
    address: ''
}

const walletSlice = createSlice({
    name: 'wallet',
    initialState: defaultState,
    reducers: {
        setWalletAddress: (state, action) => {
            state.address = action.payload
        }
    }
})

export const { setWalletAddress } = walletSlice.actions;

export default walletSlice.reducer