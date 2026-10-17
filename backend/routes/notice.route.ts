import { Hono } from 'hono';
import { userAuthValidation } from '../middlewares/auth.middleware';
import {
  getWorkspaceNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/notice.controller';

export const noticeRoute = new Hono();

// Get active notices for a workspace
noticeRoute.get('/workspace/:workspaceId', userAuthValidation, getWorkspaceNotices);

// Create a new notice (Manager only)
noticeRoute.post('/', userAuthValidation, createNotice);

// Update notice (Manager only)
noticeRoute.patch('/:noticeId', userAuthValidation, updateNotice);

// Delete notice (Manager only)
noticeRoute.delete('/:noticeId', userAuthValidation, deleteNotice);

export default noticeRoute;
