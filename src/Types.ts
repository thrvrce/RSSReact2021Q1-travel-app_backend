import { ObjectId } from "bson";

type loginCredentials = {
  login: string;
  password: string;
};

type userRegistrationData = loginCredentials & {
  email: string;
  name: string;
  imgSecureUrl: string;
  imgPublicId: string;
};

type userPublicData = {
  login: string;
  email: string;
  name: string;
  imgSecureUrl: string;
  imgPublicId: string;
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
    name?: string;
    imgSecureUrl?: string;
    imgPublicId?: string;
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

type Place = {
  countryIsoCode: string;
  photoUrl: string;
  localizations: {
    lang: string;
    description: string;
    name: string;
  }[];
};

type Review = {
  placeId: string;
  userLogin: string;
  rating: number;
  reviewText: string;
};

type updateReview = {
  filter: {
    _id: ObjectId;
  };
  updateFields: {
    rating?: number;
    reviewText?: string;
  };
  token: string;
};

type reviewInsDelResult = {
  authorizationStatus: boolean;
  operationResult: boolean;
};

type Country = {
  capitalLocation: {
    coordinates: number[];
    type: string;
  };
  imageUrl: string;
  videoUrl: string;
  currency: string;
  ISOCode: string;
  UTCTimezone: number;
  localizations: {
    lang: string;
    capital: string;
    description: string;
    name: string;
  }[];
  timeZone: string;
};
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
  Place,
  Review,
  updateReview,
  Country,
  reviewInsDelResult,
};
