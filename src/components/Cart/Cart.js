import { useSelector } from "react-redux/es/exports";

import Card from "../UI/Card";
import classes from "./Cart.module.css";
import CartItem from "./CartItem";

const Cart = (props) => {
  const cartStore = useSelector((state) => state.cart);

  const { cartItems } = cartStore;

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
