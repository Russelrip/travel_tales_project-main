import { Router } from "express";
import { getCountriesByName } from "../controllers/country-controller";
import { authenticate } from "../middleware/auth-middleware";

const countryRouter = Router();

// Authenticated route
countryRouter.get("/:name", authenticate, getCountriesByName);

export default countryRouter;