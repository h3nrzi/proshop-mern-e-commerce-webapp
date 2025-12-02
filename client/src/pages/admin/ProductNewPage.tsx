import { useEffect, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreateProductMutation, useUploadProductImageMutation } from "../../api/products-api";
import FormContainer from "../../components/common/FormContainer";
import Loader from "../../components/common/Loader";
import Product from "../../types/Product";

type FormData = Product;

const electronicBrand = [
  { value: "Apple", label: "Apple" },
  { value: "Samsung", label: "Samsung" },
];

const sportBrand = [
  { value: "Nike", label: "Nike" },
  { value: "Adidas", label: "Adidas" },
];

const ProductNewPage = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>();
  const [selectedCategory, setSelectedCategory] = useState("Electronics");
  const [createProductMutation, { isLoading: createProductLoading }] = useCreateProductMutation();
  const navigate = useNavigate();
  const [uploadProductImageMutation, { isLoading: uploadProductImageLoading }] =
    useUploadProductImageMutation();

  useEffect(() => setValue("image", "/images/sample.jpg"), [setValue]);

  const submitHandler: SubmitHandler<FormData> = async (data) => {
    try {
      await createProductMutation({ data });
      toast.success("Product created successfully!", { position: "top-center" });
      navigate("/admin/product-list");
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error, { position: "top-center" });
    }
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await uploadProductImageMutation(formData).unwrap();
        setValue("image", res.image);
        toast.success(res.message, { position: "top-center" });
      } catch (err: any) {
        toast.error(err?.data?.message || err?.error, { position: "top-center" });
      }
    }
  };

  return (
    <FormContainer>
      <h1 className="mb-5">Create new Product</h1>
      <Form onSubmit={handleSubmit(submitHandler)}>
        <Stack gap={4} direction="vertical">
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="text-danger">{errors.name.message}</p>}
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label> {uploadProductImageLoading && <Loader size="sm" />}
            <Stack gap={4} direction="horizontal">
              <Form.Control type="file" onChange={uploadFileHandler} />
              <Form.Control type="text" {...register("image")} disabled />
            </Stack>
          </Form.Group>
          <Stack gap={4} direction="horizontal">
            <Form.Group controlId="category" className="flex-grow-1">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                {...register("category", { required: "Category is required" })}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="Electronics">Electronics</option>
                <option value="Sports">Sports</option>
              </Form.Control>
              {errors.category && <p className="text-danger">{errors.category.message}</p>}
            </Form.Group>
            <Form.Group controlId="brand" className="flex-grow-1">
              <Form.Label>Brand</Form.Label>
              <Form.Control as="select" {...register("brand", { required: "Brand is required" })}>
                {selectedCategory === "Electronics"
                  ? electronicBrand.map((b) => (
                      <option key={b.label} value={b.value}>
                        {b.label}
                      </option>
                    ))
                  : sportBrand.map((b) => (
                      <option key={b.label} value={b.value}>
                        {b.label}
                      </option>
                    ))}
              </Form.Control>
              {errors.brand && <p className="text-danger">{errors.brand.message}</p>}
            </Form.Group>
          </Stack>
          <Stack direction="horizontal" gap={4}>
            <Form.Group controlId="price" className="flex-grow-1">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                min=".00"
                step=".01"
                {...register("price", { valueAsNumber: true, required: "Price is required" })}
              />
              {errors.price && <p className="text-danger">{errors.price.message}</p>}
            </Form.Group>
            <Form.Group controlId="countInStock" className="flex-grow-1">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                min="0"
                {...register("countInStock", {
                  valueAsNumber: true,
                  required: "Count In Stock is required",
                })}
              />
              {errors.countInStock && <p className="text-danger">{errors.countInStock.message}</p>}
            </Form.Group>
          </Stack>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <p className="text-danger">{errors.description.message}</p>}
          </Form.Group>
          <Button type="submit" variant="primary" className="text-white">
            Create {createProductLoading && <Loader size="sm" />}
          </Button>
        </Stack>
      </Form>
    </FormContainer>
  );
};

export default ProductNewPage;
