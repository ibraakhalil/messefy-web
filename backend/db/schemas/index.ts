export * from './users.schema';
export * from './accounts.schema';
export * from './auth.schema';
export * from './workspace.schema';
export * from './member.schema';
export * from './invitation.schema';
export * from './period.schema';
export * from './meal.schema';
export * from './transaction.schema';
export * from './adjustment.schema';

export const schemas = {
  users: await import('./users.schema').then((m) => m.users),
  accounts: await import('./accounts.schema').then((m) => m.accounts),
  workspaces: await import('./workspace.schema').then((m) => m.workspaces),
  sessions: await import('./auth.schema').then((m) => m.sessions),
  verificationTokens: await import('./auth.schema').then((m) => m.verificationTokens),
  invitations: await import('./invitation.schema').then((m) => m.invitations),
  mealEntries: await import('./meal.schema').then((m) => m.mealEntries),
  members: await import('./member.schema').then((m) => m.members),
  periods: await import('./period.schema').then((m) => m.periods),
  deposits: await import('./transaction.schema').then((m) => m.deposits),
  expenses: await import('./transaction.schema').then((m) => m.expenses),
  adjustments: await import('./adjustment.schema').then((m) => m.adjustments),
};
