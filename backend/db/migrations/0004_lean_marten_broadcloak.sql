ALTER TABLE "invitations" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "role";--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "token";--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "expires_at";--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "used_at";