export class UserDto {
  _id!: string;
  name!: string;
  email!: string;
  isAdmin!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AuthPayload {
  user!: UserDto;
  token!: string;
}
