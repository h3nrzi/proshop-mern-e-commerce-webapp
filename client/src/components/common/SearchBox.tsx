import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

interface FormData {
  keyword: string;
}

const SearchBox = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue } = useForm<FormData>();

  const [searchParams] = useSearchParams();
  setValue("keyword", searchParams.get("keyword") || "");

  function submitHandler(data: FormData) {
    if (data.keyword) return navigate(`/?q=${data.keyword}`);
    return navigate("/");
  }

  return (
    <Form onSubmit={handleSubmit(submitHandler)} className="d-flex">
      <Form.Control
        type="text"
        placeholder="Search products..."
        className="py-2"
        {...register("keyword")}
      />
      <Button type="submit" variant="outline-light" className="px-3 py-2 mx-2 text-nowrap">
        <FaSearch /> Search
      </Button>
    </Form>
  );
};

export default SearchBox;
