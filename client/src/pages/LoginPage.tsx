import { useEffect } from "react";
import { Button, Col, Form, Row, Spinner, Stack, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginMutation } from "../api/users-api";
import { setCredentials } from "../app/auth-slice";
import FormContainer from "../components/common/FormContainer";
import { RootState } from "../store";

interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const userInfo = useSelector((s: RootState) => s.auth.userInfo);
  const [loginMutation, { isLoading: LoginLoading }] = useLoginMutation();
  const { register, handleSubmit } = useForm<FormData>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";
  const isprivate = Boolean(searchParams.get("isprivate"));
  const isAdmin = Boolean(searchParams.get("isAdmin"));

  useEffect(() => {
    if (isAdmin) toast.warn("Unauthorized to perform this action", { position: "top-center" });
    if (!userInfo && isprivate) toast.warn("Please login first!", { position: "top-center" });
    if (userInfo) navigate(redirect);
  }, [userInfo, redirect, navigate, isprivate, isAdmin]);

  const submitHandler = async (data: FormData) => {
    try {
      const res = await loginMutation(data).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error, { position: "top-center" });
    }
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Stack gap={3}>
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter Your Email..." {...register("email")} />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter Your Password..."
              {...register("password")}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-25" disabled={LoginLoading}>
            Sign In
            {LoginLoading && <Spinner size="sm" className="ms-2" />}
          </Button>
        </Stack>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer?
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"} className="ms-1">
            Register
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Alert variant="info" className="text-red">
            Discover as Admin: admin@gmail.com | password: 123456
          </Alert>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginPage;
