import { Hono } from 'hono';
import {
  createMealEntry,
  createBatchMealEntries,
  getMealEntriesByPeriod,
  getMealEntriesByMember,
  getMealEntryById,
  updateMealEntry,
  deleteMealEntry,
} from '../controllers/meal.controller';
import { userAuthValidation } from '../middlewares/auth.middleware';

export const mealRoute = new Hono();

// Create a new meal entry
mealRoute.post('/', userAuthValidation, createMealEntry);

// Batch create meal entries
mealRoute.post('/batch', userAuthValidation, createBatchMealEntries);

// Get all meal entries for a specific period
mealRoute.get('/period/:periodId', userAuthValidation, getMealEntriesByPeriod);

// Get meal entries for a specific member in a period
mealRoute.get('/period/:periodId/member/:memberId', userAuthValidation, getMealEntriesByMember);

// Get a specific meal entry by ID
mealRoute.get('/:mealId', userAuthValidation, getMealEntryById);

// Update a meal entry
mealRoute.patch('/:mealId', userAuthValidation, updateMealEntry);

// Delete a meal entry
mealRoute.delete('/:mealId', userAuthValidation, deleteMealEntry);

export default mealRoute;
