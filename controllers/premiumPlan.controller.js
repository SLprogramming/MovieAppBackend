import PremiumPlan from "../models/premiumPlan.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncError.js";

// CREATE
export const createPremiumPlan = CatchAsyncError(async (req, res, next) => {
  try {
    const plan = await PremiumPlan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// READ ALL
export const getAllPremiumPlans = CatchAsyncError(async (req, res, next) => {
  try {
    const plans = await PremiumPlan.find();
    res.status(200).json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// READ SINGLE
export const getPremiumPlanById = CatchAsyncError(async (req, res, next) => {
  try {
    const plan = await PremiumPlan.findById(req.params.id);
    if (!plan) return next(new ErrorHandler("Premium plan not found", 404));
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// UPDATE
export const updatePremiumPlan = CatchAsyncError(async (req, res, next) => {
  try {
    const plan = await PremiumPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) return next(new ErrorHandler("Premium plan not found", 404));
    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// DELETE
export const deletePremiumPlan = CatchAsyncError(async (req, res, next) => {
  try {
    const plan = await PremiumPlan.findByIdAndDelete(req.params.id);
    if (!plan) return next(new ErrorHandler("Premium plan not found", 404));
    res
      .status(200)
      .json({ success: true, message: "Plan deleted successfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
