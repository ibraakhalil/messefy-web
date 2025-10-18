import { Hono } from 'hono';
import { ownerCheck } from '../middlewares/auth.middleware';
import { addUserInWorkspace } from '../controllers/member.controller';

export const memberRoute = new Hono();

memberRoute.get('/:workspaceId/:email', ownerCheck, addUserInWorkspace);
