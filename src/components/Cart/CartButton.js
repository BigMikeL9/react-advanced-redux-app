import { useDispatch, useSelector } from "react-redux";

import { uiActions } from "../../store/ui-Slice";

import classes from "./CartButton.module.css";

const CartButton = () => {
  const cartStore = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const { totalQuantity } = cartStore;

  const cartButtonHandler = () => {
    // -- 'Action Creator'. 👇👇  ie: creates an action object that will be dispatched to the store reducer function.
    dispatch(uiActions.toggleCart());
  };

  return (
    <button className={classes.button} onClick={cartButtonHandler}>
      <span>My Cart</span>
      <span className={classes.badge}>{totalQuantity}</span>
    </button>
  );
};

export default CartButton;
