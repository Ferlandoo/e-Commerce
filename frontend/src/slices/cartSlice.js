import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('card') ? JSON.parse(localStorage.getItem('card')) : {cartItems: []};

const addDencimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);

}

const cardSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if (existItem) {
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x);
            }
            else {
                state.cartItems = [...state.cartItems, item];
            }
            // Calculat items price
            state.itemsPrice = addDencimal(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
            // Calculate shipping price
            state.shippingPrice = addDencimal(state.itemsPrice > 100 ? 0 : 10);
            // Calculate tax price
            state.taxPrice = addDencimal(Number((0.20 * state.itemsPrice).toFixed(2)));
            // Calculate total price
            state.totalPrice = Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice).toFixed(2);
            localStorage.setItem('cart', JSON.stringify(state));
        }
    }
});

export const { addToCart } = cardSlice.actions;

export default cardSlice.reducer;
