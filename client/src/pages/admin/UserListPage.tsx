import _ from "lodash";
import { FC } from "react";
import { Badge, Button, Table } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment } from "react/jsx-runtime";
import { useDeleteUserMutation, useGetAllUserQuery, useLogoutMutation } from "../../api/users-api";
import { clearCredentials } from "../../app/auth-slice";
import { resetCart } from "../../app/cart-slice";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import { RootState } from "../../store";
import { UserInfo } from "../../types/Auth";
import getErrorMessage from "../../utils/getErrorMessage";
import getUserIcon from "../../utils/getUserIcon";

const UserListPage = () => {
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: usersRefetch,
  } = useGetAllUserQuery();
  const [deleteUserMutation, { isLoading: deleteUserLoading }] = useDeleteUserMutation();
  const userInfo = useSelector((s: RootState) => s.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  async function deleteUserHandler(userId: string) {
    const message = `Are you sure you want to delete ${
      userInfo?._id === userId ? "yourself" : "this user"
    }?`;

    if (window.confirm(message)) {
      try {
        const res = await deleteUserMutation({ userId }).unwrap();

        if (userInfo?._id === userId) {
          await logoutMutation();
          dispatch(clearCredentials());
          dispatch(resetCart());
          navigate("/");
          location.reload();
        }

        usersRefetch();
        toast.success(res.message, { position: "top-center" });
      } catch (err: any) {
        toast.error(err?.data?.message || err.error, { position: "top-center" });
      }
    }
  }

  return (
    <Fragment>
      <h1 className="mb-5 fw-bold">Users</h1>
      {usersLoading || deleteUserLoading ? (
        <Loader />
      ) : usersError ? (
        <Message variant="danger">{getErrorMessage(usersError)}</Message>
      ) : (
        <UsersTable users={users} userInfo={userInfo} onDelete={deleteUserHandler} />
      )}
    </Fragment>
  );
};

interface UsersTableProps {
  users?: UserInfo[];
  userInfo?: UserInfo;
  onDelete: (userId: string) => void;
}

const UsersTable: FC<UsersTableProps> = ({ users, userInfo, onDelete }) => {
  return (
    <Table responsive="lg" className="text-nowrap" bordered>
      <thead>
        <tr className="text-secondary font-monospace">
          <th className="px-5 px-lg-0">Id</th>
          <th className="px-5 px-lg-0">Name</th>
          <th className="px-5 px-lg-0">Email</th>
          <th className="px-5 px-lg-0">Admin</th>
          <th className="px-5 px-lg-0"></th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user._id}>
            <td>{_.takeRight(user._id?.split(""), 4).join("")}</td>
            <td>
              {user._id === userInfo?._id ? <Badge className="fs-6">{user.name}</Badge> : user.name}
            </td>
            <td>{<a href={`mailto:${user.email}`}>{user.email}</a>}</td>
            <td>{getUserIcon(user)}</td>
            <td>
              {user.email === "admin@gmail.com" ? null : (
                <Fragment>
                  <Link to={`/admin/user/${user._id}/edit`}>
                    <Button variant="info" className="btn-sm text-white">
                      <FaEdit size={20} />
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="btn-sm ms-1"
                    onClick={() => onDelete(user._id)}>
                    <FaTrash size={15} color="white" />
                  </Button>
                </Fragment>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserListPage;
