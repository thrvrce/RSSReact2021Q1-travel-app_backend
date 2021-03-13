import { Router } from "express";
import { getAllPlacess, getPlaceByName, insertPlace } from "../storage/Places";

const router = Router();

router.get("/getall", async (req, res) => {
  const reqResult = await getAllPlacess();
  res.status(200).json(reqResult);
});

router.get("/getbyname/:name", async (req, res) => {
  const reqResult = await getPlaceByName(req.params.name);
  res.status(200).json(reqResult);
});

router.post("/add", async (req, res) => {
  const reqResult = await insertPlace(req.body);
  res.status(200).json(reqResult);
});
export default router;
