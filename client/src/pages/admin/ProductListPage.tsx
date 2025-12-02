import _ from "lodash";
import { Fragment } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDeleteProductMutation, useGetAllProductsQuery } from "../../api/products-api";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import Product from "../../types/Product";
import getErrorMessage from "../../utils/getErrorMessage";
import Paginate from "../../components/common/Paginate";

export default function ProductListPage() {
  const [searchParams] = useSearchParams();
  const pageNumber = Number(searchParams.get("page")) || 1;
  const {
    data,
    isLoading: productsLoading,
    error: productsError,
    refetch: productsRefetch,
    isFetching: productsFetching,
  } = useGetAllProductsQuery({ pageNumber });
  const [deleteProductMutation, { isLoading: deleteProductLoading }] = useDeleteProductMutation();

  const deleteProductHandler = async (id: string) => {
    if (window.confirm("Are you sure you want to delete")) {
      try {
        const res = await deleteProductMutation({ productId: id }).unwrap();
        productsRefetch();
        toast.success(res.message, { position: "top-center" });
      } catch (err: any) {
        toast.error(err?.data?.message || err.error, { position: "top-center" });
      }
    }
  };

  return (
    <Fragment>
      <Row className="align-items-center mb-5">
        <Col>
          <h1 className="fw-bold">Products</h1>
        </Col>
        <Col className="text-end">
          <CreateNewProductButton />
        </Col>
      </Row>
      <Paginate isAdmin={true} page={data?.page} pages={data?.pages} />
      {productsLoading || deleteProductLoading || productsFetching ? (
        <Loader />
      ) : productsError ? (
        <Message variant="danger">{getErrorMessage(productsError)}</Message>
      ) : (
        <ProductsTable products={data?.products} onDeleteProduct={deleteProductHandler} />
      )}
    </Fragment>
  );
}

const CreateNewProductButton = () => {
  return (
    <Link to="/admin/product/new">
      <Button className="m-3 px-2 py-1 text-center text-white" variant="warning">
        Create New Product
      </Button>
    </Link>
  );
};

interface ProductsTableProps {
  products?: Product[];
  onDeleteProduct: (productId: string) => void;
}

const ProductsTable = ({ products, onDeleteProduct }: ProductsTableProps) => {
  return (
    <Table responsive="lg" bordered className="text-nowrap">
      <thead>
        <tr className="text-secondary font-monospace">
          <th className="px-5 px-lg-0">Id</th>
          <th className="px-5 px-lg-0">Name</th>
          <th className="px-5 px-lg-0">Price</th>
          <th className="px-5 px-lg-0">Category</th>
          <th className="px-5 px-lg-0">Brand</th>
          <th className="px-5 px-lg-0">Count</th>
          <th className="px-5 px-lg-0"></th>
        </tr>
      </thead>
      <tbody>
        {products?.map((product) => (
          <tr key={product._id}>
            <td>{<Link to={`/product/${product._id}`}>{_.takeRight(product._id, 4)}</Link>}</td>
            <td>{product.name}</td>
            <td>{`$${product.price}`}</td>
            <td>{product.category}</td>
            <td>{product.brand}</td>
            <td>{product.countInStock}</td>
            <td>
              <Link to={`/admin/product/${product._id}/edit`}>
                <Button variant="info" className="btn-sm text-white">
                  <FaEdit size={20} />
                </Button>
              </Link>
              <Button
                variant="danger"
                className="btn-sm ms-1"
                onClick={() => onDeleteProduct(product._id)}>
                <FaTrash size={15} color="white" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
