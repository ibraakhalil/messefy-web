import { apiClient } from '@/lib/api-client';
import type { NoticeItem, CreateNoticePayload, UpdateNoticePayload } from '@/types/notice';

export const noticeService = {
  // Get active notices for a workspace
  async getNotices(workspaceId: string): Promise<NoticeItem[]> {
    try {
      const response = await apiClient.get<{ notices: NoticeItem[] }>(
        `/notices/workspace/${workspaceId}`
      );
      return response.data?.notices || [];
    } catch (err: unknown) {
      console.error('Failed to fetch notices:', err);
      return [];
    }
  },

  // Create notice (Manager only)
  async createNotice(payload: CreateNoticePayload): Promise<NoticeItem> {
    const response = await apiClient.post<{ message: string; notice: NoticeItem }>(
      '/notices',
      payload
    );
    return response.data.notice;
  },

  // Update notice (Manager only)
  async updateNotice(noticeId: string, payload: UpdateNoticePayload): Promise<NoticeItem> {
    const response = await apiClient.patch<{ message: string; notice: NoticeItem }>(
      `/notices/${noticeId}`,
      payload
    );
    return response.data.notice;
  },

  // Delete notice (Manager only)
  async deleteNotice(noticeId: string): Promise<void> {
    await apiClient.delete(`/notices/${noticeId}`);
  },
};
