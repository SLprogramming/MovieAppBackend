import e from "express";
import { changePurchaseRequestStatus, createPurchaseRequest, deletePurchaseRequest, getAllPurchaseRequest, getPurchaseRequestById } from "../controllers/purchaseRequest.contrller.js";
import upload from "../config/multer.js";

const purchaseRequestRouter = e.Router()

purchaseRequestRouter.get('/get-all',getAllPurchaseRequest)
purchaseRequestRouter.get('/get/:id',getPurchaseRequestById)
purchaseRequestRouter.post('/create',upload.single('img'),createPurchaseRequest)
purchaseRequestRouter.put('/update/:id',changePurchaseRequestStatus)
purchaseRequestRouter.delete('/delete/:id',deletePurchaseRequest)

export default purchaseRequestRouter