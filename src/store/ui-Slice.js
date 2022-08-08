import { createSlice, current } from "@reduxjs/toolkit";

const initialState = { showCart: true, notification: null };

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCart(state, action) {
      state.showCart = !state.showCart;

      console.log(current(state));
    },

    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
