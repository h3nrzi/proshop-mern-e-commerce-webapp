import { FC } from "react";
import { Alert } from "react-bootstrap";

interface Props {
  variant: "info" | "danger" | "success";
  children: React.ReactNode;
}

const Message: FC<Props> = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;
