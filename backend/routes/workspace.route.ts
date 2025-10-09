import { Hono } from 'hono';
import { createWorkspace, getWorkspaceById, getUserWorkspaces } from '../controllers/workspace.controller';
import { ownerCheck } from '../middlewares/auth.middleware';

export const workspaceRoute = new Hono();

workspaceRoute.post('/create', ownerCheck, createWorkspace);
workspaceRoute.get('/user/:userId', getUserWorkspaces);
workspaceRoute.get('/:id', getWorkspaceById);
