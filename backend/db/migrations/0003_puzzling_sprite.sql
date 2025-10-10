ALTER TABLE "workspaces" RENAME COLUMN "subdomain" TO "slug";--> statement-breakpoint
ALTER TABLE "workspaces" DROP CONSTRAINT "workspaces_subdomain_unique";--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_slug_unique" UNIQUE("slug");