import { Hono } from 'hono';
import {
  createPeriod,
  getPeriodsByWorkspace,
  getPeriodById,
  updatePeriod,
  deletePeriod,
  getCurrentPeriod,
} from '../controllers/period.controller';
import { userAuthValidation } from '../middlewares/auth.middleware';

export const periodRoute = new Hono();

// Create a new period for a workspace
periodRoute.post('/', userAuthValidation, createPeriod);

// Get all periods for a specific workspace
periodRoute.get('/workspace/:workspaceId', userAuthValidation, getPeriodsByWorkspace);

// Get current open period for a workspace
periodRoute.get('/workspace/:workspaceId/current', userAuthValidation, getCurrentPeriod);

// Get a specific period by ID
periodRoute.get('/:periodId', userAuthValidation, getPeriodById);

// Update a period (status only)
periodRoute.patch('/:periodId', userAuthValidation, updatePeriod);

// Delete a period (only if open)
periodRoute.delete('/:periodId', userAuthValidation, deletePeriod);

export default periodRoute;
