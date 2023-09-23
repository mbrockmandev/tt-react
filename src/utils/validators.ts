export const isValidEmail = (email: string) => {
  const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return pattern.test(email);
};

export const isValidPassword = (password: string) => {
  // const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  // return pattern.test(password);

  // for testing only
  return password.length >= 6 && password.length <= 20;
};

export const doPasswordsMatch = (password: string, confirmPassword: string) => {
  return password === confirmPassword;
};

export const isValidName = (name: string) => {
  return name.length >= 3 && name.length <= 20;
};
