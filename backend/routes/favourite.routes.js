import express from "express";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { addToFavourites, getFavourites, removeFromFavourites, checkFavourite } from "../controllers/favourite.controller.js";


const favouriteRouter = express.Router();

favouriteRouter.post("/add/:productId", protect, authorize("user"), addToFavourites);
favouriteRouter.get("/", protect, authorize("user"), getFavourites);
favouriteRouter.delete("/:productId", protect, authorize("user"), removeFromFavourites);
favouriteRouter.get("/check/:productId", protect, authorize("user"), checkFavourite);

export default favouriteRouter;