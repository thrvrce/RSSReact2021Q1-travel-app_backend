import { Router } from "express";
import {
  registration,
  authorizeViaLogin,
  checkSession,
  logOut,
  updateUSer,
} from "../storage/Users";

import { userUpdateResult } from "../Types";
import { loader, setImage, deleteImage } from "../middleware/Files";

const router = Router();

router.post(
  "/register",
  loader.single("avatar"),
  setImage,
  async (req, res) => {
    try {
      const { authorizationStatus, token, user } = await registration(req.body);
      if (!authorizationStatus && req.file) {
        await deleteImage(req.body.imgPublicId);
      }
      res.status(authorizationStatus ? 200 : 403).json({
        authorizationStatus,
        token,
        user,
        message: authorizationStatus ? "Ok" : "Login or email alredy taken.",
      });
    } catch ({ message, name }) {
      res.status(500).json({
        authorizationStatus: false,
        token: "",
        user: null,
        message: `${name}. ${message}`,
      });
    }
  }
);

router.put("/authorization", async (req, res) => {
  try {
    const { authorizationStatus, token, user } = await authorizeViaLogin(
      req.body
    );
    res.status(authorizationStatus ? 200 : 401).json({
      authorizationStatus,
      token,
      user,
      message: authorizationStatus ? "Ok" : "Not authorized.",
    });
  } catch ({ message, name }) {
    res.status(500).json({
      authorizationStatus: false,
      token: "",
      user: null,
      message: `${name}. ${message}`,
    });
  }
});

router.put("/checksession", async (req, res) => {
  const { authorizationStatus, user } = await checkSession(req.body.token);
  res
    .status(authorizationStatus ? 200 : 401)
    .json({ authorizationStatus, user, token: req.body.token });
});

router.delete("/logout", async (req, res) => {
  try {
    const authorizationStatus = await logOut(req.body.login);
    res.status(200).json({
      authorizationStatus,
      token: "",
      user: null,
      message: "Ок",
    });
  } catch ({ message, name }) {
    res.status(500).json({
      authorizationStatus: false,
      token: "",
      user: null,
      message: `${name}. ${message}`,
    });
  }
});

/*
в строке запроса указывается логин ка кпарметр для последующего поиска записи пользователя для изменения.
в заголовке запроса указывается token для проверки авторизации пользователя вносящего изменения.
При внесении изменний в аватар требуется указать заголовок uploadPreset с значением константы UPLOAD_PRESET_AVATAR (загрузка) или UPLOAD_PRESET_DELETEFILE (удаление). См. setImage.
*/
router.put(
  "/update/:login",
  loader.single("avatar"),
  setImage,
  async (req, res) => {
    if (
      req.params.login &&
      Object.keys(req.body).length &&
      req.header("token") !== undefined
    ) {
      try {
        const updatePArameters = {
          filter: {
            login: req.params.login || "",
          },
          updateFields: {
            ...req.body,
          },
          token: req.header("token") || "",
        };
        const updateResult: userUpdateResult = await updateUSer(
          updatePArameters
        );
        if (updateResult.updateStatus) {
          res.status(200);
        } else if (updateResult.authorizationStatus) {
          res.status(500);
        } else {
          res.status(401);
        }
        res.json(updateResult);
      } catch ({ message, name }) {
        res.status(400).json({ message, name, body: req.body });
      }
    } else {
      res.status(400).json({
        message: "Not all parameters fullfield",
        name: "custom error",
        body: req.body,
      });
    }
  }
);

export default router;
