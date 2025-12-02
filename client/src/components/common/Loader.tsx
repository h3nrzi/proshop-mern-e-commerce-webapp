import { Spinner } from "react-bootstrap";

const Loader = ({ size }: { size?: "sm" }) => {
  return <Spinner animation="border" role="status" size={size} className="ms-1" />;
};

export default Loader;
