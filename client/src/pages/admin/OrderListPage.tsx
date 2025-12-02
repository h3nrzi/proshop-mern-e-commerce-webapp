import _ from "lodash";
import { Fragment } from "react";
import { Button, Table } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetAllOrdersQuery } from "../../api/orders-api";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import getErrorMessage from "../../utils/getErrorMessage";
import Order from "../../types/Order";

export default function OrderListPage() {
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetAllOrdersQuery();

  return (
    <Fragment>
      <h1 className="mb-5 fw-bold">Orders</h1>
      {ordersLoading ? (
        <Loader />
      ) : ordersError ? (
        <Message variant="danger">{getErrorMessage(ordersError)}</Message>
      ) : (
        <OrdersTable orders={orders} />
      )}
    </Fragment>
  );
}

const OrdersTable = ({ orders }: { orders?: Order[] }) => {
  return (
    <Table responsive="lg" className="text-nowrap" bordered>
      <thead>
        <tr className="text-secondary font-monospace">
          <th className="px-5 px-lg-0">Id</th>
          <th className="px-5 px-lg-0">Name</th>
          <th className="px-5 px-lg-0">Email</th>
          <th className="px-5 px-lg-0">Date</th>
          <th className="px-5 px-lg-0">Total Price</th>
          <th className="px-5 px-lg-0">Paid</th>
          <th className="px-5 px-lg-0">Delivered</th>
          <th className="px-5 px-lg-0"></th>
        </tr>
      </thead>
      <tbody>
        {orders?.map((order) => (
          <tr key={order._id}>
            <td>
              <Link to={`/order/${order._id}`}>{_.takeRight(order._id.split(""), 4).join("")}</Link>
            </td>
            <td>{order.user?.name}</td>
            <td>{order.user?.email}</td>
            <td>{order.createdAt.substring(0, 10)}</td>
            <td>${order.totalPrice}</td>
            <td>
              {order.isPaid ? (
                <span className=" text-success">{order.paidAt?.substring(0, 10)}</span>
              ) : (
                <FaTimes color="red" />
              )}
            </td>
            <td>
              {order.isDelivered ? (
                <span className=" text-success">{order.deliveredAt?.substring(0, 10)}</span>
              ) : (
                <FaTimes color="red" />
              )}
            </td>
            <td>
              {order.isPaid && order.isDelivered ? (
                <FaCheck color="green" />
              ) : (
                <Link to={`/order/${order._id}`}>
                  <Button size="sm" as="span" variant="secondary" className="text-white">
                    Details
                  </Button>
                </Link>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
