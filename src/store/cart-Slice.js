import { createSlice, current } from "@reduxjs/toolkit";

// REMEMBER: Put as much logic in the Redux Reducer functions rather than in components that dispatch actions to the Redux Reducer funciton

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
      //   console.log("NEW ITEM", action.payload.newItem);

      if (existingItem) {
        console.log("ITEM TO UPDATE: ", current(state.cartItems));

        existingItem.quantity++;
        existingItem.price = existingItem.price + action.payload.newItem.price;

        console.log("UPDATED ITEM: ", current(state.cartItems));
      } else {
        // remember even tho we are using 'push' method here (which we should NOT use when updating state in standard redux, because we should NOT directly manipulate the state instead override it with the same initial structure). We are not directly manipulating the state here, immer package returns a new state that overrides the previous state with the same structure.

        state.cartItems.push(newItem);
        console.log(current(state));
      }
    },

    removeItemFromCart(state, action) {},
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice;
