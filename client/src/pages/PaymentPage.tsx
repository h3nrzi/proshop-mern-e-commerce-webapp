import { FormEvent, useEffect, useRef } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { savePaymentMethod } from "../app/cart-slice";
import CheckoutSteps from "../components/common/CheckoutSteps";
import FormContainer from "../components/common/FormContainer";
import { RootState } from "../store";

const PaymentPage = () => {
  const ref = useRef<HTMLInputElement>(null);
  const shippingAddress = useSelector((s: RootState) => s.cart.shippingAddress);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
      toast.warn("Please fill out the shipping address", { position: "top-center" });
    }
  }, [shippingAddress, navigate]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(savePaymentMethod(ref.current?.value));
    navigate("/placeorder");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="fw-bold">Payment Method</h1>
      <Form onSubmit={handleSubmit} className="mt-5">
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              required
              value="PayPal"
              name="paymentMethod"
              ref={ref}
            />
            <Button type="submit" variant="primary" className="mt-3 w-25">
              Continue
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </FormContainer>
  );
};

export default PaymentPage;
