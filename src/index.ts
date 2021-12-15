import express, {ErrorRequestHandler} from "express";
import axios from "axios";
import path from "path";
import {promises as fs} from "fs";
import {NextFunction, Request, Response} from "express/ts4.0";
import cors from 'cors';
import * as swaggerDocument from './swagger.json';
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);


app.get("/double/:number", (req:Request,res:Response, next:NextFunction)=> {
  try {
    res.json({result: Number(req.params.number) * 2 });
  } catch(err) {
    next(err);
  }
});

app.get('/count', async (req:Request,res:Response, next:NextFunction)=> {
  const baseDir = path.join(process.cwd());
  const filePath = `${baseDir}/.count.txt`;
  try {
    const data = await fs.readFile(filePath, "utf8").catch(err => {
      if (err.code === 'ENOENT') {
        fs.writeFile(filePath, '1', 'utf-8');

        res.json({count: 1});
      } else {
        next(err);
      }
    });
    if(data) {
      const parseData = Number(data);
      const newCount = parseData + 1;
      await fs.writeFile(filePath, '' + newCount);

      res.json({ count: newCount });
    }

  } catch (err) {
    next(err);
  }
});

app.get('/joke', async(req:Request,res:Response, next:NextFunction)=> {
  try {
    const resp = await axios.get('https://api.jokes.one/jod');
    const joke = resp.data.contents;
    res.json({ joke });
  } catch(err) {
    next(err);
  }
});

app.use(function (req:Request,res:Response) {
  res.status(404).send("Not Found");
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
  next(err) ;
};
app.use(errorHandler);




app.listen(port, () => console.log(`Running on port ${port}`));
