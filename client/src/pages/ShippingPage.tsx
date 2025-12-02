import { useEffect } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { saveShippingAddress } from "../app/cart-slice";
import FormContainer from "../components/common/FormContainer";
import { RootState } from "../store";
import CheckoutSteps from "../components/common/CheckoutSteps";

type FormData = {
  address: string;
  city: string;
  country: string;
  postalCode: string;
};

const ShippingPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const { orderItems, shippingAddress } = useSelector((s: RootState) => s.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setValue("address", shippingAddress?.address as string);
    setValue("city", shippingAddress?.city as string);
    setValue("country", shippingAddress?.country as string);
    setValue("postalCode", shippingAddress?.postalCode as string);

    if (orderItems.length === 0) {
      toast.warn("Please pick a product", { position: "top-center" });
      navigate("/cart");
    }
  }, [orderItems, navigate, shippingAddress, setValue]);

  const submitHandler = (data: FormData) => {
    dispatch(saveShippingAddress(data));
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1 className="fw-bold">Shipping Address</h1>
      <Form className="mt-5" onSubmit={handleSubmit(submitHandler)}>
        <Stack direction="vertical" gap={3}>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your address..."
              {...register("address", { required: true })}
            />
            {errors.address && <span className="text-danger">Address is required</span>}
          </Form.Group>
          <Form.Group controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your city..."
              {...register("city", { required: true })}
            />
            {errors.city && <span className="text-danger">City is required</span>}
          </Form.Group>
          <Form.Group controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your postal code..."
              {...register("postalCode", { required: true })}
            />
            {errors.postalCode && <span className="text-danger">Postal code is required</span>}
          </Form.Group>
          <Form.Group controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your country..."
              {...register("country", { required: true })}
            />
            {errors.country && <span className="text-danger">Country code is required</span>}
          </Form.Group>
          <Button type="submit" variant="primary" className="w-25">
            Continue
          </Button>
        </Stack>
      </Form>
    </FormContainer>
  );
};

export default ShippingPage;
