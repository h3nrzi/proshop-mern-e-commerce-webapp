export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export default interface Auth {
  userInfo?: UserInfo;
}
