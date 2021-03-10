import { Router } from "express";
import {
  registration,
  authorizeViaLogin,
  checkSession,
  logOut,
  updateUSer,
} from "../storage/Users";

import { userUpdateResult } from "../Types";

const router = Router();

router.post("/register", async (req, res) => {
  const { authorizationStatus, token, user } = await registration(req.body);
  res.status(authorizationStatus ? 200 : 403).json(
    authorizationStatus
      ? { authorizationStatus, token, user }
      : {
          message:
            "Registration failed. User with received login or email already exists",
        }
  );
});

router.put("/authorization", async (req, res) => {
  const { authorizationStatus, token, user } = await authorizeViaLogin(
    req.body
  );
  res
    .status(authorizationStatus ? 200 : 401)
    .json(
      authorizationStatus
        ? { authorizationStatus, token, user }
        : { message: "User not found" }
    );
});

router.put("/checksession", async (req, res) => {
  const { authorizationStatus, user } = await checkSession(req.body.token);
  res.status(authorizationStatus ? 200 : 401).json(
    authorizationStatus
      ? { authorizationStatus, user }
      : {
          message: "Session expired.",
        }
  );
});

router.delete("/logout", async (req, res) => {
  const authorizationStatus = await logOut(req.body.login);
  res.status(200).json({ authorizationStatus });
});

router.put("/update", async (req, res) => {
  try {
    const updateResult: userUpdateResult = await updateUSer(req.body);
    if (updateResult.updateStatus) {
      res.status(200);
    } else if (updateResult.authorizationStatus) {
      res.status(500);
    } else {
      res.status(401).json(updateResult);
    }
    res.json(updateResult);
  } catch ({ message, name }) {
    res.status(400).json({ message, name, body: req.body });
  }
});
export default router;
