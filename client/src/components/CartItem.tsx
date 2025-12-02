import { Button, Col, Form, Image, Row } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Product from "../types/Product";

interface CartItemProps {
  item: Product;
  onAddToCart: (item: Product, value: number) => void;
  onRemoveFromCart: (_id: string) => void;
}

const CartItem = ({ item, onAddToCart, onRemoveFromCart }: CartItemProps) => {
  return (
    <Row className="align-items-center text-center mb-5 mb-md-0 gap-2 gap-md-0">
      <Col md={2}>
        <Image src={item.image} alt={item.name} fluid rounded />
      </Col>
      <Col md={3}>
        <Link to={`/product/${item._id}`}>{item.name}</Link>
      </Col>
      <Col md={3}>${item.price}</Col>
      <Col md={2}>
        <Form.Control
          as="select"
          value={item.qty}
          onChange={(e) => onAddToCart(item, +e.target.value)}>
          {Array.from({ length: item.countInStock })
            .map((_, i) => i + 1)
            .map((num) => (
              <option value={num} key={num} className="text-center">
                {num}
              </option>
            ))}
        </Form.Control>
      </Col>
      <Col md={2}>
        <Button
          variant="danger"
          className="text-white w-100"
          onClick={() => onRemoveFromCart(item._id)}>
          <FaTrash size={23} />
        </Button>
      </Col>
    </Row>
  );
};

export default CartItem;
