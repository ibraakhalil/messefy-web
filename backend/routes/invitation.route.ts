import { Hono } from 'hono';
import { userAuthValidation } from '../middlewares/auth.middleware';
import {
  cancelInvitationByUser,
  getInvitationsByUser,
  setInvitationsByUser,
} from '../controllers/workspace.controller';

export const invitationRoute = new Hono();

invitationRoute.get('/', userAuthValidation, getInvitationsByUser);
invitationRoute.post('/', userAuthValidation, setInvitationsByUser);
invitationRoute.delete('/:invitationId', userAuthValidation, cancelInvitationByUser);
