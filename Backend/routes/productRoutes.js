import express from "express";
import { addProduct, removeProduct, singleProduct, listProduct } from "../controllers/productsController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productsRouter = express.Router();

productsRouter.post('/add',adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), addProduct);
productsRouter.post('/remove',adminAuth, removeProduct)
productsRouter.post('/single', singleProduct)
productsRouter.get('/list', listProduct)

export default productsRouter