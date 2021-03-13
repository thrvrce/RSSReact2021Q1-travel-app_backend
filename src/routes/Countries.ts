import { Router } from "express";
import {
  getAllCounties,
  getCountryByNameOrCapital,
  insertCountry,
  deleteCountry,
} from "../storage/Countries";
const router = Router();

router.get("/getall", async (req, res) => {
  const reqResult = await getAllCounties();
  res.status(200).json(reqResult);
});

router.get("/getbyname/:name", async (req, res) => {
  const reqResult = await getCountryByNameOrCapital(req.params.name);
  res.status(200).json(reqResult);
});

router.post("/add", async (req, res) => {
  const inserted = await insertCountry(req.body);
  res.status(200).json(inserted);
});

router.delete("/deletebyname/:name", async (req, res) => {
  const deleted = deleteCountry(req.params.name);
  res.status(200).json(deleted);
});

export default router;
