import { Hono } from 'hono';
import { userAuthValidation } from '../middlewares/auth.middleware';
import { getCurrentWorkspaceSummary, getPeriodSummary } from '../controllers/summary.controller';

export const summaryRoute = new Hono();

summaryRoute.get('/period/:periodId', userAuthValidation, getPeriodSummary);
summaryRoute.get('/workspace/:workspaceId/current', userAuthValidation, getCurrentWorkspaceSummary);
