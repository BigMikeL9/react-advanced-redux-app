import { useDispatch } from "react-redux";

import { cartActions } from "../../store/cart-Slice";

import Card from "../UI/Card";
import classes from "./ProductItem.module.css";

const ProductItem = (props) => {
  const dispatch = useDispatch();

  console.log(cartActions);

  const { id, title, price, description } = props;

  const addToCartHandler = () => {
    dispatch(
      cartActions.addItemToCart({
        newItem: { id, title, price, quantity: 1 },
      })
    );
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
