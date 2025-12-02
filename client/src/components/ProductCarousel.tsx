import { Carousel, Image, Placeholder } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../api/products-api";
import getErrorMessage from "../utils/getErrorMessage";
import Message from "./common/Message";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  if (error) return <Message variant="danger">{getErrorMessage(error)}</Message>;

  return (
    <Carousel pause="hover" className="bg-secondary mb-5 rounded overflow-hidden">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <Carousel.Item key={index}>
              <Placeholder as={Image} className="w-100" height="500px" />
              <Carousel.Caption className="pb-5">
                <Placeholder animation="glow">
                  <Placeholder xs={3} />
                </Placeholder>
                <Placeholder animation="glow" className="ms-3">
                  <Placeholder xs={3} />
                </Placeholder>
              </Carousel.Caption>
            </Carousel.Item>
          ))
        : products?.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image src={product.image} alt={product.name} fluid />
                <Carousel.Caption className="pb-4">
                  <span className="fs-2">{product.name}</span>
                  <span className="ms-3 fs-2 text-danger">${product.price}</span>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
    </Carousel>
  );
};

export default ProductCarousel;
