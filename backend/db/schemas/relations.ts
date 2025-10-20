import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { workspaces } from './workspace.schema';
import { invitations } from './invitation.schema';
import { members } from './member.schema';
import { periods } from './period.schema';

export const invitationsRelations = relations(invitations, ({ one }) => ({
  user: one(users, {
    fields: [invitations.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [invitations.workspaceId],
    references: [workspaces.id],
  }),
}));

export const membersRelations = relations(members, ({ one }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [members.workspaceId],
    references: [workspaces.id],
  }),
}));

export const workspaceRelations = relations(workspaces, ({ many }) => ({
  periods: many(periods),
}));

export const periodsRelations = relations(periods, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [periods.workspaceId],
    references: [workspaces.id],
  }),
}));

export const userRelations = relations(users, ({ one }) => ({
  member: one(members, {
    fields: [users.id],
    references: [members.userId],
  }),
}));
