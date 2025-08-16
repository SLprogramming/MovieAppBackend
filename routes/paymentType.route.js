import e from "express";
import {
  createPaymentType,
  deletePaymentType,
  getAllPaymentTypes,
  getPaymentTypeById,
  togglePaymentType,
  updatePaymentType,
} from "../controllers/paymentType.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const paymentTypeRouter = e.Router();

paymentTypeRouter.get("/get-all", getAllPaymentTypes);
paymentTypeRouter.get("/get/:id", getPaymentTypeById);
paymentTypeRouter.post("/create",isAuthenticated,authorizeRoles(['superAdmin','admin']), createPaymentType);
paymentTypeRouter.put("/update/:id",isAuthenticated,authorizeRoles(['superAdmin','admin']), updatePaymentType);
paymentTypeRouter.delete("/delete/:id",isAuthenticated,authorizeRoles(['superAdmin','admin']), deletePaymentType);
paymentTypeRouter.post("/activate/:id",isAuthenticated,authorizeRoles(['superAdmin','admin']), togglePaymentType);

export default paymentTypeRouter;
