import express, {Request, Response, NextFunction} from "express";

const PORT = 3000;
const app = express();

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  res.json({hello: 'world'})
  next()
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
