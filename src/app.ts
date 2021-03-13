import express from "express";
import cors from "cors";
import Users from "./routes/Users";
import Countries from "./routes/Countries";

function normalizePort(val: any) {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }
  //
  return false;
}
//
const PORT: number | string | boolean = normalizePort(process.env.PORT || 3001);
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/user", Users);
app.use("/country", Countries);
app.get("/", async (req, res) => {
  res.json({ message: "Hello there" });
});

app.use((req, res) => {
  res.status(404).json({
    statuscode: 404,
    message: "Page not found",
  });
});

app.use((err: any, req: any, res: any) => {
  res.status(500).json({
    statuscode: 500,
    message: err.message,
    stack: err.stack,
  });
});

app.set("port", PORT);
app.listen(PORT, () => {
  console.log(`current port ${app.get("port")}`);
});
console.log(process.env.port, process.env.PORT);
