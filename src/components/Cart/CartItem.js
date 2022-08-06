import { useDispatch } from "react-redux/es/exports";

import { cartActions } from "../../store/cart-Slice";

import classes from "./CartItem.module.css";

const CartItem = (props) => {
  const dispatch = useDispatch();

  const { id, title, quantity, price, totalPrice } = props.item;

  const addItemHandler = () => {
    dispatch(
      cartActions.addItemToCart({
        newItem: { id, title, quantity, price, totalPrice },
      })
    );
  };

  const removeItemHandler = () => {
    dispatch(
      cartActions.removeItemFromCart({
        item: {
          id,
          title,
          quantity,
          price,
          totalPrice,
        },
      })
    );
  };

  return (
    <li className={classes.item}>
      <header>
        <h3>{title}</h3>
        <div className={classes.price}>
          ${totalPrice.toFixed(2)}
          <span className={classes.itemprice}>(${price.toFixed(2)}/item)</span>
        </div>
      </header>
      <div className={classes.details}>
        <div className={classes.quantity}>
          x <span>{quantity}</span>
        </div>
        <div className={classes.actions}>
          <button onClick={removeItemHandler}>-</button>
          <button onClick={addItemHandler}>+</button>
        </div>
      </div>
    </li>
  );
};

export default CartItem;
