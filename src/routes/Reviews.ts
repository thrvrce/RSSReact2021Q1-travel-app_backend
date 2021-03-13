import { ObjectId } from "bson";
import { Router } from "express";

import {
  insertReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
} from "../storage/Reviews";

const router = Router();

router.post("/add", async (req, res) => {
  const reqResult = await insertReview(req.body);
  res.status(200).json(reqResult);
});

router.get("/getall", async (req, res) => {
  const reqResult = await getAllReviews();
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
  const { authorizationStatus, deleted } = await deleteReviewById(
    req.params.id,
    req.header("token") || ""
  );
  if (deleted) {
    res.status(200);
  } else if (authorizationStatus) {
    res.status(500);
  } else {
    res.status(401);
  }
  res.json({ authorizationStatus, deleted });
});

export default router;
