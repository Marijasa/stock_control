import { createSlice } from '@reduxjs/toolkit';

const dollarReducer = createSlice({
    name: 'dollar',
    initialState: {
        data: {}
        // compra:0,
        // venta:0,
    },
    reducers: {
        setDollar: (state, action) => {
            state.data = action.payload;
            // state.compra = action.payload.compra;
            // state.venta = action.payload.venta;
            // console.log('dollar data in store', state.data)
        },
    }
});

export const { setDollar  } = dollarReducer.actions;

export default dollarReducer.reducer;


