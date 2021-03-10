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

type authorizationResult = {
  authorizationStatus: boolean;
  token: string;
  user: userPublicData | null;
};

type sessionSchema = {
  login: string;
  token: string;
  expiriesAt: string;
};

type updateUser = {
  filter: {
    login: string;
  };
  updateFields: {
    name: string;
  };
  token: string;
};

type documentUpdateResult = {
  authorizationStatus: boolean;
  updateStatus: boolean;
  message: string;
};

type userUpdateResult = documentUpdateResult & {
  updatedUser: userPublicData | null;
};
type updateAnyDocFilterObj = updateUser;
export {
  userRegistrationData,
  loginCredentials,
  userSchema,
  authorizationResult,
  sessionSchema,
  updateUser,
  updateAnyDocFilterObj,
  userPublicData,
  documentUpdateResult,
  userUpdateResult,
};
