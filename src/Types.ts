type loginCredentials = {
  login: string;
  password: string;
};

type userRegistrationData = loginCredentials & { email: string; name: string };

type userPublicData = {
  login: string;
  email: string;
  name: string;
};

type userSchema = userPublicData & { passwordHash: string };

type registrationResult = {
  status: boolean;
  token: string;
  user: userPublicData | null;
};

type sessionSchema = {
  login: string;
  token: string;
  expiriesAt: string;
};
export {
  userRegistrationData,
  loginCredentials,
  userSchema,
  registrationResult,
  sessionSchema,
};
