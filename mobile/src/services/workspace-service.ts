import { z } from 'zod';
import { apiClient } from '@/lib/api-client';
import type { WorkspaceMember, Workspace, CreateWorkspaceInput } from '@/types/workspace';

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(3, 'মেসের নাম কমপক্ষে ৩ অক্ষরের হতে হবে').max(100),
  slug: z
    .string()
    .trim()
    .min(3, 'মেসের স্লাগ কমপক্ষে ৩ অক্ষরের হতে হবে')
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'স্লাগে শুধু ছোট হাতের অক্ষর, সংখ্যা ও হাইফেন (-) ব্যবহার করা যাবে'),
  description: z.string().trim().max(300).optional(),
});

export const workspaceService = {
  // Get currently active workspace membership for the logged-in user
  async getValidMember(): Promise<WorkspaceMember | null> {
    try {
      const response = await apiClient.get<WorkspaceMember>('/workspaces/member');
      return response.data;
    } catch (err: unknown) {
      // 404 means the user has not joined or created any workspace yet
      if (err instanceof Error && err.message.includes('404')) {
        return null;
      }
      return null;
    }
  },

  // Create a new mess/workspace
  async createWorkspace(input: CreateWorkspaceInput): Promise<{ message: string; workspace: Workspace }> {
    const validated = createWorkspaceSchema.parse(input);
    const response = await apiClient.post<{ message: string; workspace: Workspace }>(
      '/workspaces/create',
      validated
    );
    return response.data;
  },

  // Join an existing mess with Workspace ID
  async joinWorkspace(workspaceId: string): Promise<{ message: string }> {
    const cleanId = workspaceId.trim();
    if (!cleanId) {
      throw new Error('অনুগ্রহ করে সঠিক মেস আইডি বা ইনভাইট কোড দিন');
    }
    const response = await apiClient.post<{ message: string }>('/invitation', {
      workspaceId: cleanId,
    });
    return response.data;
  },

  // Get workspace by ID
  async getWorkspaceById(workspaceId: string): Promise<Workspace> {
    const response = await apiClient.get<Workspace>(`/workspaces/${workspaceId}`);
    return response.data;
  },

  // Get all members of a workspace
  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const response = await apiClient.get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`);
    return response.data;
  },
};
