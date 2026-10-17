export type NoticePriority = 'normal' | 'important' | 'urgent';

export interface NoticeAuthor {
  id: string;
  name: string | null;
}

export interface NoticeItem {
  id: string;
  workspaceId: string;
  authorId: string;
  title: string;
  content: string;
  priority: NoticePriority;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  author?: NoticeAuthor;
}

export interface CreateNoticePayload {
  workspaceId: string;
  title: string;
  content: string;
  priority?: NoticePriority;
}

export interface UpdateNoticePayload {
  title?: string;
  content?: string;
  priority?: NoticePriority;
  isActive?: boolean;
}
