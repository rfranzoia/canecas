import "reflect-metadata";
import './database'
import app from "./api/api";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });
const port = process.env.PORT;

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

