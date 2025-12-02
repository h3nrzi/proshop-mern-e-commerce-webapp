import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart, removeFromCart } from "../app/cart-slice";
import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import Message from "../components/common/Message";
import { RootState } from "../store";
import Product from "../types/Product";
import CheckoutSteps from "../components/common/CheckoutSteps";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderItems = useSelector((s: RootState) => s.cart.orderItems);

  const addToCartHandler = (item: Product, qty: number) => {
    dispatch(addToCart({ ...item, qty }));
    toast.success("Quantity updated successfully.", { position: "top-center" });
  };

  const removeFromCartHandler = (_id: string) => {
    dispatch(removeFromCart({ _id }));
    toast.success("Product remove from cart.", { position: "top-center" });
  };

  const checkoutHandler = () => {
    navigate("/login?isprivate=true&redirect=/shipping");
  };

  return (
    <Row>
      <CheckoutSteps step1 />
      <Col md={8}>
        <h1 className="mb-5 fw-bold">Shopping Cart</h1>
        {orderItems.length === 0 ? (
          <Message variant="info">
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {orderItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <CartItem
                  item={item}
                  onAddToCart={addToCartHandler}
                  onRemoveFromCart={removeFromCartHandler}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <CartSummary orderItems={orderItems} onCheckout={checkoutHandler} />
        </Card>
      </Col>
    </Row>
  );
};

export default CartPage;
