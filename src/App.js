import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";

import { uiActions } from "./store/ui-Slice";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";

// --------------------------------------------------------------
// --------------------------------------------------------------
/* 
⭐⭐⭐⭐⭐⭐ IMPORTANT Technique to do execute or prevent execution of something  ONLY ONCE when the app starts⭐⭐⭐⭐⭐⭐

 -- Dont run execute code inside 'useEffect()', when 'App' component is initialized for the first time.

 -- OUTSIDE of the component function so that 'isInitialized' is not changed when the component re-renders. ONLY when this file is parsed for the first time, when the app starts/mounts.

*/

let isInitialized = true;
// --------------------------------------------------------------
// --------------------------------------------------------------

function App() {
  const dispatch = useDispatch();

  const uiStore = useSelector((state) => state.ui);
  const cartStore = useSelector((state) => state.cart);

  const { showCart, notification } = uiStore;
  const { cartItems } = cartStore;

  // ----------------------------------------------------------------
  // -- Everytime 'cartItems' state property in the Redux store changes. the cart is sent to the database using a 'PUT' request, which overrides the existing 'cart' in the database, with the incoming 'cart' data.abs
  const sendCartHandler = useCallback(async () => {
    // --- prevent sending data to database as the App starts / loads for the first time.

    if (isInitialized) {
      isInitialized = false;
      return;
    }

    try {
      // -- sending request notification
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Sending...",
          message: "Sending Cart Data to Database",
        })
      );

      const response = await fetch(
        "https://react-router-quotes-app-db817-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cartItems),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Sending Cart Data to Database Failed!!!");
      }

      // console.log(response);

      const data = await response.json();

      // console.log(data);

      // -- Data Sent notification
      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success",
          message: "Cart Data successfully sent to Database",
        })
      );
    } catch (error) {
      console.log(error.message);

      // -- request error notification
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "ERROR!!",
          message: "Sending data to Database Failed!",
        })
      );
    }
  }, [cartItems, dispatch]);

  // ----------------------------------------------------------------
  useEffect(() => {
    sendCartHandler();

    // -- hide notification
    const runLater = setTimeout(() => {
      dispatch(uiActions.showNotification({ status: "hide" }));
    }, 4000);

    // cleanup function
    return () => {
      clearTimeout(runLater);
    };
  }, [sendCartHandler, dispatch]);
  // ----------------------------------------------------------------

  return (
    <>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </>
  );
}

export default App;
