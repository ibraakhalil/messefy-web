import { Hono } from 'hono';
import {
  acceptInvitationByOwner,
  cancelInvitationByOwner,
  cancelInvitationByUser,
  createWorkspace,
  getInvitationsByUser,
  getWorkspaceById,
  getWorkspaceInvitations,
  getValidWorkspaceMember,
  setInvitationsByUser,
} from '../controllers/workspace.controller';
import { ownerCheck, userAuthValidation } from '../middlewares/auth.middleware';

export const workspaceRoute = new Hono();

workspaceRoute.post('/create', ownerCheck, createWorkspace);
workspaceRoute.get('/member', userAuthValidation, getValidWorkspaceMember);

workspaceRoute.get('/invitation', userAuthValidation, getInvitationsByUser);
workspaceRoute.post('/invitation', userAuthValidation, setInvitationsByUser);
workspaceRoute.delete('/invitation/:invitationId', userAuthValidation, cancelInvitationByUser);

workspaceRoute.post('/invitations/:invitationId/accept', ownerCheck, acceptInvitationByOwner);
workspaceRoute.delete('/invitations/:invitationId/cancel', ownerCheck, cancelInvitationByOwner);

workspaceRoute.get('/:workspaceId/invitations', userAuthValidation, getWorkspaceInvitations);
workspaceRoute.get('/:workspaceId', userAuthValidation, getWorkspaceById);
