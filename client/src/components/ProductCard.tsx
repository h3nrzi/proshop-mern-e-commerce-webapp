import { FC } from "react";
import { Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import Product from "../types/Product";
import Rating from "./common/Rating";

interface Props {
  product: Product;
}

const ProductCard: FC<Props> = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`product/${product._id}`} className=" text-decoration-none">
        <Image src={product.image} fluid thumbnail />
        <Card.Body>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
          <Card.Text as="div">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </Card.Text>
          <Card.Text as="h3">${product.price}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default ProductCard;
