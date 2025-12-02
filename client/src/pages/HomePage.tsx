import { Col, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useGetAllProductsQuery } from "../api/products-api";
import Message from "../components/common/Message";
import Paginate from "../components/common/Paginate";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import getErrorMessage from "../utils/getErrorMessage";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/common/Meta";

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("q") || "";
  const { data, isLoading, error, isFetching } = useGetAllProductsQuery({ pageNumber, keyword });

  if (data?.products.length === 0) return <Message variant="info">No products found</Message>;

  return (
    <Fragment>
      <Meta />
      {!keyword && <ProductCarousel />}
      <h1 className="fw-bold">Latest Products</h1>
      <Row>
        {isLoading || isFetching ? (
          <Fragment>
            {Array.from({ length: 8 }).map((_, i) => (
              <Col sm={12} md={6} lg={4} xl={3} key={i}>
                <ProductCardSkeleton />
              </Col>
            ))}
          </Fragment>
        ) : error ? (
          <Message variant="danger">{getErrorMessage(error)}</Message>
        ) : (
          data!.products.map((product) => (
            <Col sm={12} md={6} lg={4} xl={3} key={product._id}>
              <ProductCard product={product} />
            </Col>
          ))
        )}
      </Row>
      <div className="my-3">
        <Paginate isAdmin={false} page={data?.page} pages={data?.pages} keyword={keyword} />
      </div>
    </Fragment>
  );
};

export default HomePage;
