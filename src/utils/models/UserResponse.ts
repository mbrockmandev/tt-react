export interface UserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export const emptyUserResponse: UserResponse = {
  id: 0,
  email: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
  role: "",
};
