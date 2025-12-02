import { useEffect } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetUserQuery, useUpdateUserMutation } from "../../api/users-api";
import { setCredentials } from "../../app/auth-slice";
import FormContainer from "../../components/common/FormContainer";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import { RootState } from "../../store";
import getErrorMessage from "../../utils/getErrorMessage";

interface FormData {
  _id: string;
  name: string;
  email: string;
  isAdmin: string | boolean;
}

const UserEditPage = () => {
  const { id: userId } = useParams();
  const userInfo = useSelector((s: RootState) => s.auth.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
    refetch: userRefetch,
  } = useGetUserQuery({ userId });

  const [updateUserMutation, { isLoading: updateUserLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setValue("_id", user._id);
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("isAdmin", user.isAdmin ? "true" : "false");
    }
  }, [user, setValue]);

  const submitHandler: SubmitHandler<FormData> = async (data) => {
    try {
      const updatedUser = await updateUserMutation({
        userId,
        data: {
          ...data,
          isAdmin: data.isAdmin === "true" ? true : false,
        },
      }).unwrap();

      if (userInfo?._id === updatedUser._id) dispatch(setCredentials(updatedUser));

      userRefetch();
      toast.success("User updated successfully", { position: "top-center" });
      navigate("/admin/user-list");
    } catch (err: any) {
      toast.error(err?.data?.message || err.error, { position: "top-center" });
    }
  };

  if (userLoading) return <Loader />;
  if (userError) return <Message variant="danger">{getErrorMessage(userError)}</Message>;

  return (
    <FormContainer>
      <h1>Edit User</h1>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Stack gap={4} direction="vertical">
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                  message: "Enter a valid email address",
                },
              })}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="isAdmin">
            <Form.Label>Admin</Form.Label>
            <Stack direction="horizontal" gap={3}>
              <Form.Check
                type="radio"
                label="Yes"
                value="true"
                {...register("isAdmin", { required: "Admin status is required" })}
                isInvalid={!!errors.isAdmin}
              />
              <Form.Check
                type="radio"
                label="No"
                value="false"
                {...register("isAdmin", { required: "Admin status is required" })}
                isInvalid={!!errors.isAdmin}
              />
            </Stack>
            <Form.Control.Feedback type="invalid">{errors.isAdmin?.message}</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" variant="secondary" className="text-white">
            Update {updateUserLoading && <Loader size="sm" />}
          </Button>
        </Stack>
      </Form>
    </FormContainer>
  );
};

export default UserEditPage;
