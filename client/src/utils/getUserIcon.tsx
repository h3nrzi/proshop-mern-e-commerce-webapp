import { FaCheck, FaCheckSquare, FaTimes } from "react-icons/fa";
import { UserInfo } from "../types/Auth";

export default function getAdminIcon(user: UserInfo) {
  if (user.isAdmin)
    return user.email === "admin@gmail.com" ? (
      <FaCheckSquare color="gold" size="25px" />
    ) : (
      <FaCheck color="green" size="20px" />
    );

  return <FaTimes color="red" size="25px" />;
}
