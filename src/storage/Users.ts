import md5 from "md5";
import { Collection } from "mongodb";
import { usersCollection, sessionsCollection } from "./Collections";
import {
  userRegistrationData,
  loginCredentials,
  userSchema,
  authorizationResult,
  sessionSchema,
} from "../Types";

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
  filterObj: { login: string }
): Promise<any> {
  const document = await collection.findOne(filterObj);
  return document;
}

async function registration({
  login,
  email,
  name,
  password,
}: userRegistrationData) {
  const users = await usersCollection;
  const isCredentialsAvaliable: boolean = await isEmailAndLoginAvailable(
    users,
    login,
    email
  );
  const result: authorizationResult = {
    status: false,
    token: "",
    user: null,
  };
  if (isCredentialsAvaliable) {
    const newUser: userSchema = {
      login,
      email,
      name,
      passwordHash: getPasswordHash(password),
    };
    users.insertOne(newUser);
    const insertedUser = await getCollectionDocumentFields(users, { login });
    const sessions = await sessionsCollection;
    sessions.insertOne(createSession(login));
    const insertedSession = await getCollectionDocumentFields(sessions, {
      login,
    });
    result.status = insertedUser !== null;
    result.token = insertedSession.token;
    result.user = {
      login: insertedUser.login,
      email: insertedUser.email,
      name: insertedUser.name,
    };
  }
  return result;
}

async function setAuthorizationStatus(
  login: string
): Promise<authorizationResult> {
  const users = await usersCollection;
  const sessions = await sessionsCollection;
  const insertedUser = await getCollectionDocumentFields(users, { login });
  const insertedSession = await getCollectionDocumentFields(sessions, {
    login,
  });

  return {
    status: insertedUser !== null,
    token: insertedSession.token,
    user: {
      login: insertedUser.login,
      email: insertedUser.email,
      name: insertedUser.name,
    },
  };
}

function setDefaultAuthorizationResult(): authorizationResult {
  return {
    status: false,
    token: "",
    user: null,
  };
}

async function deleteAllUserSessions(login: string) {
  const sessions = await sessionsCollection;
  await sessions.deleteMany({ login });
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
    result = await setAuthorizationStatus(login);
  }
  return result;
}

export { registration, authorizeViaLogin };
