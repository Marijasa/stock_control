import { configureStore } from '@reduxjs/toolkit';

import dollarReducer from "./dollar.reducer";


const store = configureStore({
    reducer: {
        dollar: dollarReducer,
    }
});

export default store;

