import { ObjectId } from "bson";
import { Router } from "express";
import { reviewInsDelResult } from "../Types";
import {
  insertReview,
  getAllReviewsByPlaceId,
  getReviewById,
  updateReviewById,
  deleteReviewById,
} from "../storage/Reviews";
import { setResStatus } from "../storage/commonFunctions";

const router = Router();

router.post("/add", async (req, res) => {
  const reqResult = await insertReview(req.body, req.header("token") || "");
  res.status(setResStatus(reqResult));
  res.json(reqResult);
});

router.get("/getallbyplaceid/:placeid", async (req, res) => {
  const reqResult = await getAllReviewsByPlaceId(req.params.placeid);
  res.status(200).json(reqResult);
});

router.get("/getbyid/:id", async (req, res) => {
  const reqResult = await getReviewById(req.params.id);
  res.status(200).json(reqResult);
});

router.put("/updatebyid/:id", async (req, res) => {
  try {
    const updatePArams = {
      filter: {
        _id: new ObjectId(req.params.id || ""),
      },
      updateFields: {
        ...req.body,
      },
      token: req.header("token") || "",
    };
    const updateResult = await updateReviewById(updatePArams);
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
});

router.delete("/deletebyid/:id", async (req, res) => {
  const reqResult: reviewInsDelResult = await deleteReviewById(
    req.params.id,
    req.header("token") || ""
  );
  res.status(setResStatus(reqResult));
  res.json(reqResult);
});

export default router;
