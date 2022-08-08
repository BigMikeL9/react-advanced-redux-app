import { createSlice, current } from "@reduxjs/toolkit";

// --------------------------------------------------------
// REMEMBER: Put as much logic in the Redux Reducer functions rather than in components that dispatch actions to the Redux Reducer function
// --------------------------------------------------------

const initialState = { cartItems: [], totalQuantity: 0, totalPrice: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload.newItem;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      //   console.log(current(state));
      // console.log("NEW ITEM", action.payload.newItem);

      if (existingItem) {
        // -- change existing item property values
        existingItem.quantity++;
        existingItem.totalPrice =
          existingItem.totalPrice + action.payload.newItem.price;

        state.totalQuantity++;
        state.totalPrice = state.totalPrice + action.payload.newItem.price;

        // console.log("CartItems AFTER UPDATE: ", current(state.cartItems));
      } else {
        // ------------------------------
        // REMEMBER even tho we are using 'push' method here (which we should NOT use when updating state in standard redux, because we should NOT directly manipulate state properties, instead override it with the same initial state structure). We are not directly manipulating the state here, immer package returns a new state that overrides the previous state, with the same structure, while copying over all the other state properties that did not change.
        // ------------------------------

        state.cartItems.push(newItem);
        state.totalQuantity++;
        state.totalPrice = state.totalPrice + newItem.price;
      }

      console.log(current(state));
    },

    removeItemFromCart(state, action) {
      const itemId = action.payload.item.id;

      const existingItem = state.cartItems.find((item) => item.id === itemId);

      if (existingItem.quantity !== 1) {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;

        state.totalQuantity--;
        state.totalPrice = state.totalPrice - existingItem.price;
      } else {
        state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
        state.totalQuantity--;
        state.totalPrice = state.totalPrice - existingItem.price;
      }

      // console.log(current(state));
    },

    replaceCartItems(state, action) {
      state.cartItems = action.payload.cartItems;

      state.totalQuantity = action.payload.cartItems.reduce(
        (acc, curr) => acc.quantity + curr.quantity
      );

      state.totalPrice = action.payload.cartItems.reduce(
        (acc, curr) => acc.totalPrice + curr.totalPrice
      );

      console.log(current(state));
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;
