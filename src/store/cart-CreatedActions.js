import { uiActions } from "./ui-Slice";
import { cartActions } from "./cart-Slice";

// -------------------
/* 🟡🟠 -- OPTION 2 of implementing Asynchronous code and Redux --  

  [🌟 NOT USING. Prefer to have side-effect logic in component. See 'App.js' 🌟]

  - We create our own 'action creator' with a THUNK. Which returns a function inwhich we can execute side-effect / asynchronous code (since it is not in the Redux store Reducer function). 

*/

export const fetchCartData = () => {
  return async (dispatch) => {
    const sendData = async () => {
      const response = await fetch(
        "https://react-apps-http-default-rtdb.firebaseio.com/cart.json"
      );

      if (!response.ok)
        throw new Error("Failed to Fetch Cart from database 😡 !!");

      const data = await response.json();

      return data;
    };

    try {
      const data = await sendData();

      dispatch(cartActions.replaceCartItems({ cart: data }));
    } catch (error) {
      console.log(error);

      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "ERROR!!",
          message: "Sending data to Database Failed!",
        })
      );
    }
  };
};

export const sendCartData = (cart) => {
  return async (dispatch) => {
    try {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending Cart Data to Database",
        })
      );

      const response = await fetch(
        "https://react-apps-http-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok)
        throw new Error("Sending Cart Data to Database Failed!!!");

      const data = await response.json();

      console.log("Cartitems pushed to Database 👉", data);

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success",
          message: "Cart Data successfully sent to Database",
        })
      );
    } catch (error) {
      console.log(error);

      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "ERROR!!",
          message: "Sending data to Database Failed!",
        })
      );
    }
  };
};
// -------------------
