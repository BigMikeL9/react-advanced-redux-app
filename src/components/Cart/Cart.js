import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux/es/exports";

import { cartActions } from "../../store/cart-Slice";

import Card from "../UI/Card";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";

const Cart = (props) => {
  const dispatch = useDispatch();
  const cartStore = useSelector((state) => state.cart);

  const { cartItems } = cartStore;

  //-----------------------------------------------------------
  // -- fetch cart items from database as app starts
  const fetchCartItemsHandler = useCallback(async () => {
    try {
      const response = await fetch(
        "https://react-router-quotes-app-db817-default-rtdb.firebaseio.com/cart.json"
      );

      const data = await response.json();

      if (!response.ok) throw new Error("Something went WRONG!!!");

      console.log(data);

      dispatch(cartActions.replaceCartItems({ cartItems: data }));

      // data.forEach((item) => {
      //   dispatch(cartActions.addItemToCart({ newItem: item }));
      // });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCartItemsHandler();
  }, [fetchCartItemsHandler]);
  //-----------------------------------------------------------

  return (
    <Card className={classes.cart}>
      <h2>Your Shopping Cart</h2>
      <ul>
        {cartItems.map((item) => {
          return (
            <CartItem
              key={item.id}
              item={{
                id: item.id,
                title: item.title,
                quantity: item.quantity,
                price: item.price,
                totalPrice: item.totalPrice,
              }}
            />
          );
        })}
      </ul>
    </Card>
  );
};

export default Cart;
