import { Hono } from 'hono';
import { userAuthValidation } from '../middlewares/auth.middleware';
import {
  createExpense,
  deleteExpense,
  getExpensesByPeriod,
  updateExpense,
} from '../controllers/expense.controller';

export const expenseRoute = new Hono();

expenseRoute.post('/', userAuthValidation, createExpense);
expenseRoute.get('/period/:periodId', userAuthValidation, getExpensesByPeriod);
expenseRoute.patch('/:expenseId', userAuthValidation, updateExpense);
expenseRoute.delete('/:expenseId', userAuthValidation, deleteExpense);
