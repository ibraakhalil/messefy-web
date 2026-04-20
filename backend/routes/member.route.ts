import { Hono } from 'hono';
import { ownerCheck, userAuthValidation } from '../middlewares/auth.middleware';
import { addUserInWorkspace, leaveWorkspace } from '../controllers/member.controller';

export const memberRoute = new Hono();

memberRoute.post('/:workspaceId', ownerCheck, addUserInWorkspace);
memberRoute.delete('/:workspaceId/leave', userAuthValidation, leaveWorkspace);
