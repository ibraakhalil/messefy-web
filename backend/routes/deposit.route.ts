import { Hono } from 'hono';
import { userAuthValidation } from '../middlewares/auth.middleware';
import {
  createDeposit,
  deleteDeposit,
  getDepositsByMember,
  getDepositsByPeriod,
  updateDeposit,
} from '../controllers/deposit.controller';

export const depositRoute = new Hono();

depositRoute.post('/', userAuthValidation, createDeposit);
depositRoute.get('/period/:periodId', userAuthValidation, getDepositsByPeriod);
depositRoute.get('/period/:periodId/member/:memberId', userAuthValidation, getDepositsByMember);
depositRoute.patch('/:depositId', userAuthValidation, updateDeposit);
depositRoute.delete('/:depositId', userAuthValidation, deleteDeposit);
