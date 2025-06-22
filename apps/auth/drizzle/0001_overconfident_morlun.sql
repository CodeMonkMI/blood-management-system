ALTER TABLE "user_roles" RENAME TO "roles";--> statement-breakpoint
ALTER TABLE "roles" DROP CONSTRAINT "user_roles_role_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_role_user_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_roles_id_fk" FOREIGN KEY ("role") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_role_unique" UNIQUE("role");