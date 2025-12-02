import { Button, Card, ListGroup } from "react-bootstrap";
import Product from "../types/Product";

interface CartSummaryProps {
  orderItems: Product[];
  onCheckout: () => void;
}

const CartSummary = ({ orderItems, onCheckout }: CartSummaryProps) => {
  const itemCount = orderItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);

  return (
    <Card>
      <ListGroup variant="flush">
        <ListGroup.Item>
          <h3 className="fw-bolder">
            Subtotal
            <span className="mx-1 text-decoration-underline">{itemCount}</span>
            Items
          </h3>
          <h6>${totalPrice}</h6>
        </ListGroup.Item>

        <ListGroup.Item className="text-center">
          <Button
            type="button"
            className="w-100 text-white"
            disabled={orderItems.length === 0}
            onClick={onCheckout}>
            Proceed To Checkout
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default CartSummary;
