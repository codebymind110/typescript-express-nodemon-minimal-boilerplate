import express, {Request, Response, NextFunction} from "express";
import bodyParser from "body-parser";
import { validationEmail } from "./routes/validateEmail.route";


const PORT = 3000;
const app = express();
app.use(bodyParser.json())

app.use(validationEmail)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
