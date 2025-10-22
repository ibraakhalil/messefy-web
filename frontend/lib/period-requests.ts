/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/utils/axios';
import { Period, CreatePeriodRequest, UpdatePeriodRequest } from '@/types/period';

/**
 * Create a new period for a workspace
 */
export async function createPeriod(data: CreatePeriodRequest): Promise<Period> {
  try {
    const response = await api.post('/periods', data);
    return response.data.period;
  } catch (error) {
    console.error('Error creating period:', error);
    throw error;
  }
}

/**
 * Get all periods for a workspace
 */
export async function getPeriodsByWorkspace(workspaceId: string): Promise<Period[]> {
  try {
    const response = await api.get(`/periods/workspace/${workspaceId}`);
    return response.data.periods;
  } catch (error) {
    console.error('Error fetching periods:', error);
    throw error;
  }
}

/**
 * Get a specific period by ID
 */
export async function getPeriodById(periodId: string): Promise<Period> {
  try {
    const response = await api.get(`/periods/${periodId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching period:', error);
    throw error;
  }
}

/**
 * Get the current open period for a workspace
 */
export async function getCurrentPeriod(workspaceId: string): Promise<Period | null> {
  try {
    const response = await api.get(`/periods/workspace/${workspaceId}/current`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null; // No current period found
    }
    console.error('Error fetching current period:', error);
    throw error;
  }
}

/**
 * Update a period (status only)
 */
export async function updatePeriod(periodId: string, data: UpdatePeriodRequest): Promise<Period> {
  try {
    const response = await api.patch(`/periods/${periodId}`, data);
    return response.data.period;
  } catch (error) {
    console.error('Error updating period:', error);
    throw error;
  }
}

/**
 * Delete a period (only if open)
 */
export async function deletePeriod(periodId: string): Promise<void> {
  try {
    await api.delete(`/periods/${periodId}`);
  } catch (error) {
    console.error('Error deleting period:', error);
    throw error;
  }
}
