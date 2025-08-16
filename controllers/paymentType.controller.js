import PaymentType from "../models/paymentType.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncError.js";

// CREATE
export const createPaymentType = CatchAsyncError(async (req, res, next) => {
  try {
    const paymentType = await PaymentType.create(req.body);
    res.status(201).json({ success: true, data: paymentType });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// READ ALL
export const getAllPaymentTypes = CatchAsyncError(async (req, res, next) => {
  try {
    const types = await PaymentType.find();
    res.status(200).json({ success: true, count: types.length, data: types });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// READ SINGLE
export const getPaymentTypeById = CatchAsyncError(async (req, res, next) => {
  try {
    const type = await PaymentType.findById(req.params.id);
    if (!type) return next(new ErrorHandler("Payment type not found", 404));
    res.status(200).json({ success: true, data: type });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// UPDATE
export const updatePaymentType = CatchAsyncError(async (req, res, next) => {
  try {
    const type = await PaymentType.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!type) return next(new ErrorHandler("Payment type not found", 404));
    res.status(200).json({ success: true, data: type });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// DELETE
export const deletePaymentType = CatchAsyncError(async (req, res, next) => {
  try {
    const type = await PaymentType.findByIdAndDelete(req.params.id);
    if (!type) return next(new ErrorHandler("Payment type not found", 404));
    res
      .status(200)
      .json({ success: true, message: "Payment type deleted successfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// TOGGLE isActive
export const togglePaymentType = CatchAsyncError(async (req, res, next) => {
  try {
    const { flag = true } = req.body; // optional, default true
    const type = await PaymentType.findById(req.params.id);
    if (!type) return next(new ErrorHandler("Payment type not found", 404));

    const updatedType = await type.activeToggle(flag);
    res.status(200).json({ success: true, data: updatedType });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
