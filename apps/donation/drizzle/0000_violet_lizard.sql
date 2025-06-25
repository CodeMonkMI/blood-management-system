CREATE TYPE "public"."blood_type" AS ENUM('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('pending', 'verified', 'progress', 'ready', 'hold', 'completed');--> statement-breakpoint
CREATE TABLE "requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"date" varchar(255) NOT NULL,
	"blood" "blood_type" NOT NULL,
	"description" varchar(255),
	"status" "request_status" DEFAULT 'pending' NOT NULL,
	"metadata" varchar(255),
	"donor" varchar(255),
	"details" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
