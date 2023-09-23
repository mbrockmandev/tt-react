export interface RegisterUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export interface OutletContextType {
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  setAlertClassName: React.Dispatch<React.SetStateAction<string>>;
}
