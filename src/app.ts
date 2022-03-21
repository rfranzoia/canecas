import "reflect-metadata";
import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import './database'
import api from "./api/api";
import morgan from 'morgan';
import helmet from "helmet";

dotenv.config({ path: "./.env" });

const app = express();
const port = process.env.PORT;

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

app.use("/api", api);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

