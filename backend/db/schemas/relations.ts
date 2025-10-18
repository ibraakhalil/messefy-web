import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { workspaces } from './workspace.schema';
import { invitations } from './invitation.schema';
import { members } from './member.schema';

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

export const userRelations = relations(users, ({ one }) => ({
  member: one(members, {
    fields: [users.id],
    references: [members.userId],
  }),
}));
