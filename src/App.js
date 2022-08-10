import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";

import { uiActions } from "./store/ui-Slice";
import { cartActions } from "./store/cart-Slice";
import { fetchCartData, sendCartData } from "./store/cart-CreatedActions";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";

// --------------------------------------------------------------
// --------------------------------------------------------------
/* 
⭐⭐⭐⭐⭐⭐  IMPORTANT Technique to execute something  ONLY ONCE when the app starts  ⭐⭐⭐⭐⭐⭐

    -- Dont run / execute code inside 'useEffect()', when 'App' component is initialized for the first time.

     -- Add 'isInitialized' OUTSIDE of the component function so that it does not changed when the component re-renders. ONLY when this file is parsed for the first time, when the app starts/mounts.

*/

let isInitialized = true;
// --------------------------------------------------------------
// --------------------------------------------------------------

function App() {
  const dispatch = useDispatch();

  const uiStore = useSelector((state) => state.ui);
  const cart = useSelector((state) => state.cart);

  const { showCart, notification } = uiStore;

  // ----------------------------------------------------------------
  // ----------------------------------------------------------------
  // ----------------------------------------------------------------
  // -------------------

  /* 🟡🟠 -- OPTION 1 of implementing Asynchronous code and Redux --  

  - Where we simply ignore Redux and execute side-effects and async tasks in components (in 'useEffect()' hook). 

*/

  // ----------------------------
  // -- fetch cart items from database as app starts
  const fetchCartData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://react-apps-http-default-rtdb.firebaseio.com/cart.json"
      );

      const data = await response.json();

      const transformedData = {
        cartItems: data.cartItems || [], // fall back for bug when 'cartItems' in database is undefined
        totalPrice: data.totalPrice,
        totalQuantity: data.totalQuantity,
        updated: data.updated,
      };

      if (!response.ok) throw new Error("Could not fetch cart from database!!");

      dispatch(cartActions.replaceCartItems({ cart: transformedData }));
    } catch (error) {
      console.log(error);

      // -- error notification
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "ERROR!!",
          message: "Sending data to Database Failed!",
        })
      );
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);
  // ----------------------------

  // -- Everytime 'cartItems' state property in the Redux store changes. the cart is sent to the database using a 'PUT' request, which overrides the existing 'cart' in the database, with the incoming 'cart' data.abs
  const sendCartData = useCallback(async () => {
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
        "https://react-apps-http-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
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

      // -- error notification
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "ERROR!!",
          message: "Sending data to Database Failed!",
        })
      );
    }
  }, [cart, dispatch]);

  // ----------------------------------------------------------------
  // ----------------------------------------------------------------
  // ----------------------------------------------------------------
  // ----------------------------------------------------------------

  // --- 🟠 Option 2 - creating our own 'action creator' in 'cart-CreatedActions.js'
  // [NOT USING 👇👇]
  // useEffect(() => {
  //   dispatch(fetchCartData());
  // }, [dispatch]);

  // ------
  useEffect(() => {
    // --- prevent sending data to database as the App starts / loads for the first time.
    if (isInitialized) {
      isInitialized = false;
      return;
    }

    // --- 🟡 Option 1 - add asynchronous code in component
    // 🌟 ' if (!cart.updated) return; ' --> is so that when we call 'replaceCartItems()' reducer method and 'state.updated = false;'  ->  a request is not sent to the database.
    if (!cart.updated) return;
    sendCartData();

    // --- 🟠 Option 2 - creating our own 'action creator' in 'cart-CreatedActions.js'
    // [NOT USING 👇👇]
    // if (cart.updated) {
    //   dispatch(sendCartData(cart));
    // }

    // ------------
    // -- hide notification
    const runLater = setTimeout(() => {
      dispatch(uiActions.showNotification({ status: "hide" }));
    }, 4000);

    // cleanup function
    return () => {
      clearTimeout(runLater);
    };
    // ------------
  }, [sendCartData, cart.updated, dispatch]);
  // ------

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
