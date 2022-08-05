import { createSlice, current } from "@reduxjs/toolkit";

const initialState = { showCart: true };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCart(state, action) {
      state.showCart = !state.showCart;

      console.log(current(state));
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
