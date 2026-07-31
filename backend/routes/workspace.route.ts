import { Hono } from 'hono';
import {
  acceptInvitationByOwner,
  cancelInvitationByOwner,
  createWorkspace,
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaceInvitations,
  getValidWorkspaceMember,
  getWorkspaceMembers,
  updateWorkspace,
} from '../controllers/workspace.controller';
import { ownerCheck, userAuthValidation } from '../middlewares/auth.middleware';

export const workspaceRoute = new Hono();

workspaceRoute.get('/member', userAuthValidation, getValidWorkspaceMember);
workspaceRoute.post('/create', userAuthValidation, createWorkspace);
workspaceRoute.get('/:workspaceId/members', userAuthValidation, getWorkspaceMembers);

workspaceRoute.get('/:workspaceId/invitations', ownerCheck, getWorkspaceInvitations);
workspaceRoute.post('/:workspaceId/invitations/:invitationId/accept', ownerCheck, acceptInvitationByOwner);
workspaceRoute.delete('/:workspaceId/invitations/:invitationId/cancel', ownerCheck, cancelInvitationByOwner);
workspaceRoute.delete('/:workspaceId', ownerCheck, deleteWorkspace);
workspaceRoute.patch('/:workspaceId', ownerCheck, updateWorkspace);

workspaceRoute.get('/:workspaceId', userAuthValidation, getWorkspaceById);
