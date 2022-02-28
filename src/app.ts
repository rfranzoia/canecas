import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import './database'
import {routes} from "./controller/routes";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

