import ErrorHandler from "../utils/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncError.js";
import PurchaseRequest from "../models/purchaseRequest.model.js";
import cloudinary from "../config/cloudinary.js";

// get all
export const getAllPurchaseRequest = CatchAsyncError(async (req, res, next) => {
    try {
        let result = await PurchaseRequest.find()
        return res.status(200).json({success:true,count:result.length,data:result})
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// get single
export const getPurchaseRequestById = CatchAsyncError(async (req, res, next) => {
    try {
        let result = await PurchaseRequest.findById(req.params.id)
        let data = (await result.populate('user_id')).populate('plan_id')
        return res.status(200).json({success:true,data})
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// create
export const createPurchaseRequest = CatchAsyncError(async (req, res, next) => {
    try {
        const { user_id, plan_id, transitionNumber ,bankAccount_id } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "purchase_requests",
        });

        const purchaseRequest = await PurchaseRequest.create({
            user_id,
            plan_id,
            transitionNumber,
            img: {
                url: result.secure_url,    // Cloudinary URL
                public_id: result.public_id // Cloudinary public_id
            },
            bankAccount_id
        });

        res.status(201).json({
            success: true,
            data: purchaseRequest,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message,500))
    }
})

//delete
export const deletePurchaseRequest = CatchAsyncError(async (req, res, next) => {
    try {
          const { id } = req.params;

        // Find the purchase request
        const request = await PurchaseRequest.findById(id);
        if (!request) {
            return next(new ErrorHandler("Purchase request not found", 404));
        }

        // Delete image from Cloudinary
        if (request.img && request.img.public_id) {
            await cloudinary.uploader.destroy(request.img.public_id);
        }

        // Delete the purchase request document
        await request.remove();

        res.status(200).json({
            success: true,
            message: "Purchase request and image deleted successfully"
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})

// update
export const changePurchaseRequestStatus = CatchAsyncError(async (req, res, next) => {
    try {
        const {id} = req.params
        const {status} = req.body
        let request = await PurchaseRequest.findById(id)
         if (!request) {
            return next(new ErrorHandler("Purchase request not found", 404));
        }
        let data = await request.changeStatus(status)
        return res.status(200).json({success:true,data})
    } catch (error) {
        return next(new ErrorHandler(error.message, 400))
    }
})