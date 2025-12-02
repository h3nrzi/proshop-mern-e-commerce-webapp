import {
  DISPATCH_ACTION,
  PayPalButtons,
  PayPalButtonsComponentProps,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import moment from "moment";
import { FC, Fragment, useEffect } from "react";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetOrderQuery,
  useGetPayPalClientIdQuery,
  useUpdateOrderToDeliverMutation,
  useUpdateOrderToPaidMutation,
} from "../api/orders-api";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import { RootState } from "../store";
import Order from "../types/Order";
import getErrorMessage from "../utils/getErrorMessage";

export default function OrderPage() {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const userInfo = useSelector((s: RootState) => s.auth.userInfo);
  const {
    data: order,
    isLoading: orderQueryLoading,
    error: orderQueryError,
    refetch: orderQueryRefetch,
  } = useGetOrderQuery({ orderId });
  const {
    data: payPalClientId,
    isLoading: payPalClientIdQueryLoading,
    error: payPalClientIdQueryError,
  } = useGetPayPalClientIdQuery();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [updateOrderToPaidMutation, { isLoading: updateOrderToPaidLoading }] =
    useUpdateOrderToPaidMutation();
  const [updateOrderToDeliverMutation, { isLoading: updateOrderToDeliverLoading }] =
    useUpdateOrderToDeliverMutation();

  useEffect(() => {
    if (!payPalClientIdQueryError && !payPalClientIdQueryLoading && payPalClientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: DISPATCH_ACTION.RESET_OPTIONS,
          value: { clientId: payPalClientId.clientId, currency: "USD" },
        });

        paypalDispatch({
          type: DISPATCH_ACTION.LOADING_STATUS,
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };

      if (order && !order.isPaid) if (!window.paypal) loadPaypalScript();
    }
  }, [payPalClientIdQueryError, payPalClientIdQueryLoading, payPalClientId, order, paypalDispatch]);

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data, actions) => {
    return actions.order?.capture().then(async (details) => {
      try {
        await updateOrderToPaidMutation({ orderId, details });
        orderQueryRefetch();
        toast.success("Payment successful!", {
          onClick: () => navigate("/profile"),
          position: "top-center",
          style: { cursor: "pointer" },
        });
      } catch (err: any) {
        toast.error(err?.data?.message || err.error, { position: "top-center" });
      }
    });
  };

  const onApproveTest = async () => {
    const details = { payer: { email_address: userInfo?.email } };
    await updateOrderToPaidMutation({ orderId, details });
    orderQueryRefetch();
    toast.success("Payment successful!", {
      onClick: () => navigate("/profile"),
      position: "top-center",
      style: { cursor: "pointer" },
    });
  };

  const createOrder: PayPalButtonsComponentProps["createOrder"] = async (data, actions) => {
    return actions.order
      .create({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: order!.totalPrice.toString(),
            },
          },
        ],
      })
      .then((orderId) => orderId);
  };

  const onError: PayPalButtonsComponentProps["onError"] = (err: any) => {
    toast.error(err?.message, { position: "top-center" });
  };

  const deliverOrderHandler = async () => {
    try {
      await updateOrderToDeliverMutation({ orderId });
      orderQueryRefetch();
      toast.success("Order has been delivered", {
        onClick: () => navigate("/admin/order-list"),
        position: "top-center",
        style: { cursor: "pointer" },
      });
    } catch (err: any) {
      toast.error(err?.data?.message || err.error, { position: "top-center" });
    }
  };

  return (
    <Fragment>
      {orderQueryLoading ? (
        <Loader />
      ) : orderQueryError ? (
        <Message variant="danger">{getErrorMessage(orderQueryError)}</Message>
      ) : (
        <Row>
          <Col md={8}>
            <OrderDetails order={order} />
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant="flush">
                <OrderSummary order={order} />
                {!order?.isPaid && userInfo?.email === "admin@gmail.com" && (
                  <ListGroup.Item>
                    {isPending ? (
                      <Loader />
                    ) : (
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      />
                    )}
                  </ListGroup.Item>
                )}
                {!order?.isPaid && (
                  <ListGroup.Item>
                    <TestPaymentButton
                      onApproveTest={onApproveTest}
                      updateOrderToPaidLoading={updateOrderToPaidLoading}
                    />
                  </ListGroup.Item>
                )}
                {userInfo && userInfo.isAdmin && order?.isPaid && !order?.isDelivered && (
                  <ListGroup.Item>
                    <MarkAsDeliveredButton
                      isLoading={updateOrderToDeliverLoading}
                      onDeliverOrder={deliverOrderHandler}
                    />
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </Fragment>
  );
}

interface OrderDetailsProps {
  order?: Order;
}

const OrderDetails: FC<OrderDetailsProps> = ({ order }) => {
  return (
    <ListGroup variant="flush">
      <ListGroup.Item>
        <h2 className="fw-bold">Shipping Address</h2>
        <p>
          <strong className="me-1">Name:</strong>
          {order?.user.name}
        </p>
        <p>
          <strong className="me-1">Email:</strong>
          {order?.user.email}
        </p>
        <p>
          <strong className="me-1">Address:</strong>
          {order?.shippingAddress.address}, {order?.shippingAddress.city},
          {order?.shippingAddress.postalCode}, {order?.shippingAddress.country}
        </p>
        <p>
          <strong className="me-1">Order at:</strong>
          {moment(order?.createdAt).format("dddd - MMMM Do YYYY - h:mm a")}
        </p>
        {order?.isDelivered ? (
          <Message variant="success">
            Delivered on: {moment(order.deliveredAt!).format("dddd - MMMM Do YYYY - h:mm a")}
          </Message>
        ) : (
          <Message variant="danger">Not Delivered!</Message>
        )}
      </ListGroup.Item>

      <ListGroup.Item>
        <h2 className="fw-bold">Payment Method</h2>
        <p>{order?.paymentMethod}</p>
        {order?.isPaid ? (
          <Message variant="success">
            Paid on: {moment(order.paidAt!).format("dddd - MMMM Do YYYY - h:mm a")}
          </Message>
        ) : (
          <Message variant="danger">Not Paid!</Message>
        )}
      </ListGroup.Item>

      <ListGroup.Item>
        <h2 className="fw-bold">Order Items</h2>
        {order?.orderItems.map((item) => (
          <ListGroup key={item._id} className="my-5 my-md-2">
            <Row className="align-items-center gap-2 gap-md-0">
              <Col md={1}>
                <Image src={item.image} alt={item.name} fluid rounded />
              </Col>
              <Col md={5}>
                <Link to={`/product/${item.product}`}>{item.name}</Link>
              </Col>
              <Col className="text-md-end">
                {item.qty > 1
                  ? `${item.qty} X $${item.price} = $${item.qty * item.price}`
                  : `$${item.price}`}
              </Col>
            </Row>
          </ListGroup>
        ))}
      </ListGroup.Item>
    </ListGroup>
  );
};

interface OrderSummaryProps {
  order?: Order;
}

const OrderSummary: FC<OrderSummaryProps> = ({ order }) => {
  return (
    <Fragment>
      <ListGroup.Item>
        <h2 className="fw-bold">Order Summary</h2>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Items Price:</Col>
          <Col>${order?.itemsPrice}</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Shipping Price:</Col>
          <Col>${order?.shippingPrice}</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Tax Price:</Col>
          <Col>${order?.taxPrice}</Col>
        </Row>
      </ListGroup.Item>
      <ListGroup.Item>
        <Row>
          <Col>Total Price:</Col>
          <Col>${order?.totalPrice}</Col>
        </Row>
      </ListGroup.Item>
    </Fragment>
  );
};

interface PaymentButtonsProps {
  onApproveTest: () => void;
  updateOrderToPaidLoading: boolean;
}

const TestPaymentButton: FC<PaymentButtonsProps> = ({
  onApproveTest,
  updateOrderToPaidLoading,
}) => {
  return (
    <Button variant="success" className="text-white mb-2 w-100" onClick={onApproveTest}>
      PAY ORDER
      {updateOrderToPaidLoading && <Loader size="sm" />}
    </Button>
  );
};

interface MarkAsDeliveredButtonProps {
  isLoading: boolean;
  onDeliverOrder: () => void;
}

const MarkAsDeliveredButton = ({ isLoading, onDeliverOrder }: MarkAsDeliveredButtonProps) => {
  return (
    <Button className="w-100 text-white" variant="warning" onClick={onDeliverOrder}>
      Mark as Delivered
      {isLoading && <Loader size="sm" />}
    </Button>
  );
};
