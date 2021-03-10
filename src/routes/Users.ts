import { Router } from "express";
import { registration } from "../storage/Users";

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

export default router;
