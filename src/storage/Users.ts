import md5 from "md5";
import { Collection } from "mongodb";
import { usersCollection, sessionsCollection } from "./Collections";
import {
  userRegistrationData,
  loginCredentials,
  userSchema,
  authorizationResult,
  sessionSchema,
  updateUser,
  userPublicData,
  documentUpdateResult,
  userUpdateResult,
} from "../Types";
import updateOneAnyDocument from "./commonFunctions";

function getPasswordHash(password: string): string {
  return md5(password + process.env.passwordSalt);
}

function createToken(userLogin: string): string {
  return md5(userLogin + process.env.tokenSalt);
}

function setSessionExpireTime(): string {
  return new Date(
    Date.now() + 1000 * Number(process.env.sessionExpireTimeInSeconds)
  ).toISOString();
}

async function isEmailAndLoginAvailable(
  collection: Collection,
  login: string,
  email: string
): Promise<boolean> {
  const countLogins: number = await collection.countDocuments(
    { login },
    { limit: 1 }
  );
  const countEmails: number = await collection.countDocuments(
    { email },
    { limit: 1 }
  );
  return countLogins === 0 && countEmails === 0;
}

function createSession(login: string): sessionSchema {
  return {
    login,
    token: createToken(login),
    expiriesAt: setSessionExpireTime(),
  };
}

async function getCollectionDocumentFields(
  collection: Collection,
  filterObj: { login: string } | { token: string }
): Promise<any> {
  const document = await collection.findOne(filterObj);
  return document;
}

async function getAuthorizationResult(
  login: string
): Promise<authorizationResult> {
  const users = await usersCollection;
  const sessions = await sessionsCollection;
  const insertedUser = await getCollectionDocumentFields(users, { login });
  const insertedSession = await getCollectionDocumentFields(sessions, {
    login,
  });

  return {
    authorizationStatus: insertedUser !== null,
    token: insertedSession.token,
    user: {
      login: insertedUser.login,
      email: insertedUser.email,
      name: insertedUser.name,
      imgPublicId: insertedUser.imgPublicId,
      imgSecureUrl: insertedUser.imgSecureUrl,
    },
  };
}

function setDefaultAuthorizationResult(): authorizationResult {
  return {
    authorizationStatus: false,
    token: "",
    user: null,
  };
}

async function deleteAllUserSessions(login: string) {
  const sessions = await sessionsCollection;
  await sessions.deleteMany({ login });
}

async function registration({
  login,
  email,
  name,
  password,
  imgSecureUrl,
  imgPublicId,
}: userRegistrationData) {
  const users = await usersCollection;
  const isCredentialsAvaliable: boolean = await isEmailAndLoginAvailable(
    users,
    login,
    email
  );
  let result: authorizationResult = setDefaultAuthorizationResult();
  if (isCredentialsAvaliable) {
    const newUser: userSchema = {
      login,
      email,
      name,
      passwordHash: getPasswordHash(password),
      imgSecureUrl,
      imgPublicId,
    };
    users.insertOne(newUser);
    const sessions = await sessionsCollection;
    sessions.insertOne(createSession(login));
    result = await getAuthorizationResult(login);
  }
  return result;
}

async function authorizeViaLogin({
  login,
  password,
}: loginCredentials): Promise<authorizationResult> {
  const users = await usersCollection;
  const user = await users.findOne({
    login,
    passwordHash: getPasswordHash(password),
  });
  let result: authorizationResult = setDefaultAuthorizationResult();
  if (user) {
    await deleteAllUserSessions(login);
    const sessions = await sessionsCollection;
    await sessions.insertOne(createSession(login));
    result = await getAuthorizationResult(login);
  }
  return result;
}

async function checkSession(token: string): Promise<authorizationResult> {
  const sessions = await sessionsCollection;
  const session = await getCollectionDocumentFields(sessions, {
    token,
  });
  let result: authorizationResult = setDefaultAuthorizationResult();
  if (session) {
    if (session.expiriesAt > new Date().toISOString()) {
      sessions.updateOne(session, {
        $set: { expiresAt: setSessionExpireTime() },
      });
      result = await getAuthorizationResult(session.login);
    } else {
      deleteAllUserSessions(session.login);
    }
  }

  return result;
}

async function logOut(login: string): Promise<boolean> {
  deleteAllUserSessions(login);
  return true;
}

async function updateUSer({
  filter,
  updateFields,
  token,
}: updateUser): Promise<userUpdateResult> {
  let updatedUser: userPublicData | null = null;
  const docUpdResult: documentUpdateResult = await updateOneAnyDocument(
    usersCollection,
    filter,
    updateFields,
    token
  );
  if (docUpdResult.updateStatus) {
    const { user } = await checkSession(token);
    updatedUser = user;
  }
  return { ...docUpdResult, updatedUser };
}

export { registration, authorizeViaLogin, checkSession, logOut, updateUSer };
