import { Hono } from 'hono';
import {
  acceptInvitationByOwner,
  cancelInvitationByOwner,
  createWorkspace,
  getWorkspaceById,
  getWorkspaceInvitations,
  getValidWorkspaceMember,
  getWorkspaceMembers,
} from '../controllers/workspace.controller';
import { ownerCheck, userAuthValidation } from '../middlewares/auth.middleware';

export const workspaceRoute = new Hono();

workspaceRoute.get('/member', userAuthValidation, getValidWorkspaceMember);
workspaceRoute.post('/create', ownerCheck, createWorkspace);
workspaceRoute.get('/:workspaceId/members', ownerCheck, getWorkspaceMembers);

workspaceRoute.get('/:workspaceId/invitations', ownerCheck, getWorkspaceInvitations);
workspaceRoute.post('/:workspaceId/invitations/:invitationId/accept', ownerCheck, acceptInvitationByOwner);
workspaceRoute.delete('/:workspaceId/invitations/:invitationId/cancel', ownerCheck, cancelInvitationByOwner);

workspaceRoute.get('/:workspaceId', userAuthValidation, getWorkspaceById);
