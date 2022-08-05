import { useDispatch } from "react-redux";

import { uiActions } from "../../store/ui-Slice";

import classes from "./CartButton.module.css";

const CartButton = () => {
  const dispatch = useDispatch();

  const cartButtonHandler = () => {
    // -- 'Action Creator'. 👇👇  ie: creates an action object that will be dispatched to the store reducer function.
    dispatch(uiActions.toggleCart());
  };

  return (
    <button className={classes.button} onClick={cartButtonHandler}>
      <span>My Cart</span>
      <span className={classes.badge}>1</span>
    </button>
  );
};

export default CartButton;
