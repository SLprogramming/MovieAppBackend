import e from "express";
import { createBankAccount, deleteBankAccount, getAllBankAccounts, getBankAccountById, toggleBankAccount, updateBankAccount } from "../controllers/bankAccount.controller";

const bankAccountRouter = e.Router()

bankAccountRouter.get('/get-all',getAllBankAccounts)
bankAccountRouter.get('/get/:id',getBankAccountById)
bankAccountRouter.post('/create',createBankAccount)
bankAccountRouter.put('/update/:id',updateBankAccount)
bankAccountRouter.delete('/delete/:id',deleteBankAccount)
bankAccountRouter.put('/activate/:id',toggleBankAccount)

export default bankAccountRouter;