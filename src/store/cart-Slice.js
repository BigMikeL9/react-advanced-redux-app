import { createSlice, current } from "@reduxjs/toolkit";

// --------------------------------------------------------
// REMEMBER: Put as much logic in the Redux Reducer functions rather than in components that dispatch actions to the Redux Reducer function
// --------------------------------------------------------

const initialState = {
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  updated: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action) {
      // -- so that when we call 'replaceCartItems()' reducer method below from 'App.js' and 'state.updated = false;'  ->  a request is not sent to the database.
      state.updated = true;

      const newItem = action.payload.newItem;

      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      //   console.log(current(state));

      if (existingItem) {
        // -- change existing item property values
        existingItem.quantity++;
        existingItem.totalPrice =
          existingItem.totalPrice + action.payload.newItem.price;

        state.totalQuantity++;
        state.totalPrice = state.totalPrice + action.payload.newItem.price;
      } else {
        // ------------------------------
        // REMEMBER even tho we are using 'push' method here (which we should NOT use when updating state in standard redux, because we should NOT directly manipulate state properties, instead override it with the same initial state structure). We are not directly manipulating the state here, immer package returns a new state that overrides the previous state, with the same structure, while copying over all the other state properties that did not change.
        // ------------------------------

        state.cartItems.push(newItem);
        state.totalQuantity++;
        state.totalPrice = state.totalPrice + newItem.price;
      }

      console.log("ADD Item, current store state 👇", current(state));
    },

    removeItemFromCart(state, action) {
      state.updated = true;

      const itemId = action.payload.item.id;

      const existingItem = state.cartItems.find((item) => item.id === itemId);

      if (existingItem.quantity !== 1) {
        existingItem.quantity--;
        existingItem.totalPrice = existingItem.totalPrice - existingItem.price;

        state.totalQuantity--;
        state.totalPrice = state.totalPrice - existingItem.price;
      } else {
        // remove item from cart if quantity is equal to 1
        state.cartItems = state.cartItems.filter((item) => item.id !== itemId);

        state.totalQuantity--;
        state.totalPrice = state.totalPrice - existingItem.price;
      }

      console.log("REMOVE Item, current store state 👇", current(state));
    },

    replaceCartItems(state, action) {
      state.cartItems = action.payload.cart.cartItems;

      state.totalPrice = action.payload.cart.totalPrice;

      state.totalQuantity = action.payload.cart.totalQuantity;

      console.log(
        "Redux Store current state, after fetching cart from database 👇",
        current(state)
      );
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;
