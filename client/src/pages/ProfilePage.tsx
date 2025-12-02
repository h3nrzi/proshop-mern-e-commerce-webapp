import _ from "lodash";
import { FC, useEffect } from "react";
import { Button, Col, Form, Row, Stack, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetMyOrdersQuery } from "../api/orders-api";
import { useUpdateProfileMutation } from "../api/users-api";
import { setCredentials } from "../app/auth-slice";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import { RootState } from "../store";
import Order from "../types/Order";
import getErrorMessage from "../utils/getErrorMessage";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [updateProfileMutation, { isLoading: updateProfileLoading }] = useUpdateProfileMutation();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetMyOrdersQuery();

  const submitHandler = async ({ name, email, password, confirmPassword }: FormData) => {
    if (password !== confirmPassword)
      return toast.error("Passwords do not match!", { position: "top-center" });

    try {
      const res = await updateProfileMutation({ name, email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Profile updated successfully!", { position: "top-center" });
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error, { position: "top-center" });
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2 className="mb-3">User Info</h2>
        <ProfileForm onSubmit={submitHandler} updateProfileLoading={updateProfileLoading} />
      </Col>
      <Col md={9}>
        <h2 className="mb-3">Orders</h2>
        {ordersLoading ? (
          <Loader />
        ) : ordersError ? (
          <Message variant="danger">{getErrorMessage(ordersError)}</Message>
        ) : (
          <OrdersTable orders={orders} />
        )}
      </Col>
    </Row>
  );
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ProfileFormProps {
  onSubmit: (data: FormData) => void;
  updateProfileLoading: boolean;
}

const ProfileForm: FC<ProfileFormProps> = ({ onSubmit, updateProfileLoading }) => {
  const userInfo = useSelector((s: RootState) => s.auth.userInfo);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (userInfo) {
      setValue("name", userInfo.name);
      setValue("email", userInfo.email);
    }
  }, [userInfo, setValue]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mb-5 mb-md-0">
      <Stack gap={4}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your name"
            {...register("name", { required: true })}
          />
          {errors.name && <span className="text-danger">Name is required</span>}
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            {...register("email", { required: true })}
          />
          {errors.email && <span className="text-danger">Email is required</span>}
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            {...register("password")}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your confirm password"
            {...register("confirmPassword")}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-50">
          Update
          {updateProfileLoading && <Loader size="sm" />}
        </Button>
      </Stack>
    </Form>
  );
};

interface OrdersTableProps {
  orders?: Order[];
}

const OrdersTable: FC<OrdersTableProps> = ({ orders }) => {
  return (
    <Table responsive="lg" className="text-nowrap">
      <thead>
        <tr>
          <th className="px-5 px-lg-0">ID</th>
          <th className="px-5 px-lg-0">DATE</th>
          <th className="px-5 px-lg-0">TOTAL PRICE</th>
          <th className="px-5 px-lg-0">PAID</th>
          <th className="px-5 px-lg-0">DELIVERED</th>
          <th className="px-5 px-lg-0"></th>
        </tr>
      </thead>
      <tbody>
        {orders?.map((order) => (
          <tr key={order._id}>
            <td>
              <Link to={`/order/${order._id}`}>{_.takeRight(order._id.split(""), 4).join("")}</Link>
            </td>
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
