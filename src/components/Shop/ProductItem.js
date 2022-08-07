import { useDispatch } from "react-redux";

import { cartActions } from "../../store/cart-Slice";

import Card from "../UI/Card";
import classes from "./ProductItem.module.css";

const ProductItem = (props) => {
  const dispatch = useDispatch();

  const { id, title, price, description } = props;

  const addToCartHandler = async () => {
    const newItem = { id, title, price, totalPrice: price, quantity: 1 };

    dispatch(
      cartActions.addItemToCart({
        newItem: newItem,
      })
    );

    // -----------------------------------------------------------
    // -- Send Item to database
    const response = await fetch(
      "https://react-router-quotes-app-db817-default-rtdb.firebaseio.com/cart.json",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.status);

    // -- Firebase returns a promise after we SEND a post request
    const data = await response.json();
    // -----------------------------------------------------------
  };

  return (
    <li className={classes.item}>
      <Card>
        <header>
          <h3>{title}</h3>
          <div className={classes.price}>${price.toFixed(2)}</div>
        </header>
        <p>{description}</p>
        <div className={classes.actions}>
          <button onClick={addToCartHandler}>Add to Cart</button>
        </div>
      </Card>
    </li>
  );
};

export default ProductItem;
