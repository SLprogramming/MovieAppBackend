import BankAccount from "../models/bankAccount.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import CatchAsyncError from "../middleware/catchAsyncError.js";

// CREATE
export const createBankAccount = CatchAsyncError(async (req, res, next) => {
  try {
    const account = await BankAccount.create(req.body);
    let data = await account.populate('paymentType_id')
    res.status(201).json({ success: true, data });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// READ ALL
export const getAllBankAccounts = CatchAsyncError(async (req, res, next) => {
  try {
    const accounts = await BankAccount.find().populate("paymentType_id", "name");
    res.status(200).json({ success: true, count: accounts.length, data: accounts });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// READ SINGLE
export const getBankAccountById = CatchAsyncError(async (req, res, next) => {
  try {
    const account = await BankAccount.findById(req.params.id).populate(
      "paymentType_id",
      "name"
    );
    if (!account) return next(new ErrorHandler("Bank account not found", 404));
    res.status(200).json({ success: true, data: account });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const getBankAccountByPaymentId = CatchAsyncError(
  async (req, res, next) => {
    try {
      const { id } = req.params;

      // Fetch all bank accounts with matching paymentType_id
      const response = await BankAccount.find({ paymentType_id: id });

      // If no accounts found, you can handle it (optional)
      if (!response || response.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No bank accounts found for this payment type",
        });
      }

      // Success response
      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);


// UPDATE
export const updateBankAccount = CatchAsyncError(async (req, res, next) => {
  try {
    const account = await BankAccount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("paymentType_id", "name");

    if (!account) return next(new ErrorHandler("Bank account not found", 404));
    res.status(200).json({ success: true, data: account });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// DELETE
export const deleteBankAccount = CatchAsyncError(async (req, res, next) => {
  try {
    const account = await BankAccount.findByIdAndDelete(req.params.id);
    if (!account) return next(new ErrorHandler("Bank account not found", 404));
    res
      .status(200)
      .json({ success: true, message: "Bank account deleted successfully" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// TOGGLE isActive
export const toggleBankAccount = CatchAsyncError(async (req, res, next) => {
  try {
    const { flag = true } = req.body; // optional, default true
    const account = await BankAccount.findById(req.params.id).populate("paymentType_id");
    if (!account) return next(new ErrorHandler("Bank account not found", 404));

    const updatedAccount = await account.activeToggle(flag);
    res.status(200).json({ success: true, data: updatedAccount });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
