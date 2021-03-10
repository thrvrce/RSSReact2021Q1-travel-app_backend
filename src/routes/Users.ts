import { Router } from "express";
import {
  registration,
  authorizeViaLogin,
  checkSession,
  logOut,
} from "../storage/Users";

const router = Router();

router.post("/register", async (req, res) => {
  const { status, token, user } = await registration(req.body);
  res.status(status ? 200 : 403).json(
    status
      ? { status, token, user }
      : {
          message:
            "Registration failed. User with received login or email already exists",
        }
  );
});

router.put("/authorization", async (req, res, next) => {
  const { status, token, user } = await authorizeViaLogin(req.body);
  res
    .status(status ? 200 : 401)
    .json(status ? { status, token, user } : { message: "User not found" });
});

router.put("/checksession", async (req, res) => {
  const { status, user } = await checkSession(req.body.token);
  res.status(status ? 200 : 401).json(
    status
      ? { status, user }
      : {
          message: "Session expired.",
        }
  );
});

router.delete("/logout", async (req, res) => {
  const status = await logOut(req.body.login);
  res.status(200).json({ status });
});

export default router;
