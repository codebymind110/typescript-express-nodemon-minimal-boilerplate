import { Router } from "express";
import { validateEmail } from "../controllers/validateEmail.controller";

const validationEmail = Router()

validationEmail.post('/',validateEmail)

export {
    validationEmail
}