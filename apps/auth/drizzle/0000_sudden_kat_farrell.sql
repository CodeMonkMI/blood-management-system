CREATE TYPE "public"."user_status" AS ENUM('pending', 'progress', 'verified', 'hold', 'suspended', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."users_role" AS ENUM('super_admin', 'admin', 'user');--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"role" "users_role",
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_roles_role_unique" UNIQUE("role")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255),
	"name" varchar(255) NOT NULL,
	"status" "user_status" DEFAULT 'pending',
	"role" uuid,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_user_roles_id_fk" FOREIGN KEY ("role") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;