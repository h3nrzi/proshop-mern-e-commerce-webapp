import { useEffect } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../api/users-api";
import { setCredentials } from "../app/auth-slice";
import FormContainer from "../components/common/FormContainer";
import { RootState } from "../store";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const userInfo = useSelector((s: RootState) => s.auth.userInfo);
  const [registerMutation, { isLoading: registerLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (data: FormData) => {
    if (data.password !== data.confirmPassword) return toast.warn("Passwords do not match");

    try {
      const res = await registerMutation(data).unwrap();
      dispatch(setCredentials(res));
      navigate(redirect);
    } catch (err: any) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Form.Group controlId="name" className="my-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Your Name..." {...register("name")} />
        </Form.Group>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Enter Your Email..." {...register("email")} />
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Your Password..."
            {...register("password")}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Your Password..."
            {...register("confirmPassword")}
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="mt-2 w-25" disabled={registerLoading}>
          Register
          {registerLoading && <Spinner size="sm" className="ms-2" />}
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          Already have an account?
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"} className="ms-1">
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterPage;
