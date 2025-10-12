import { Hono } from 'hono';
import {
  cancelInvitationByUser,
  createWorkspace,
  getInvitationsByUser,
  getWorkspaceById,
  getWorkspaceByUser,
  setInvitationsByUser,
} from '../controllers/workspace.controller';
import { ownerCheck, userAuthValidation } from '../middlewares/auth.middleware';

export const workspaceRoute = new Hono();

workspaceRoute.post('/create', ownerCheck, createWorkspace);
workspaceRoute.get('/user', userAuthValidation, getWorkspaceByUser);

workspaceRoute.get('/invitation', userAuthValidation, getInvitationsByUser);
workspaceRoute.post('/invitation', userAuthValidation, setInvitationsByUser);
workspaceRoute.delete('/invitation/:invitationId', userAuthValidation, cancelInvitationByUser);

workspaceRoute.get('/:workspaceId', userAuthValidation, getWorkspaceById);
