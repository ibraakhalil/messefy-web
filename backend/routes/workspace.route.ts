import { Hono } from 'hono';
import { createWorkspace, getWorkspaceById, getWorkspaceByUser } from '../controllers/workspace.controller';
import { ownerCheck, userValidation } from '../middlewares/auth.middleware';

export const workspaceRoute = new Hono();

workspaceRoute.post('/create', ownerCheck, createWorkspace);
workspaceRoute.get('/user', userValidation, getWorkspaceByUser);
workspaceRoute.get('/:id', userValidation, getWorkspaceById);
