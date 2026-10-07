export interface MealEntry {
  id: string;
  workspaceId: string;
  periodId: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  breakfast: number;
  lunch: number;
  dinner: number;
  createdAt?: string;
  updatedAt?: string;
  member?: {
    id: string;
    name: string | null;
    user?: {
      id: string;
      name: string | null;
      email: string;
    } | null;
  };
}

export interface MealChartEntry {
  id: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface MealChartMember {
  id: string;
  name: string;
}

export interface MealChartResponse {
  members: MealChartMember[];
  entries: MealChartEntry[];
}

export interface CreateMealInput {
  workspaceId: string;
  periodId: string;
  memberId: string;
  date: string; // YYYY-MM-DD
  breakfast?: number;
  lunch?: number;
  dinner?: number;
}

export interface UpdateMealInput {
  mealId: string;
  breakfast?: number;
  lunch?: number;
  dinner?: number;
}

export interface BatchMealItem {
  memberId: string;
  breakfast?: number;
  lunch?: number;
  dinner?: number;
}

export interface BatchCreateMealInput {
  workspaceId: string;
  periodId: string;
  date: string; // YYYY-MM-DD
  meals: BatchMealItem[];
}
