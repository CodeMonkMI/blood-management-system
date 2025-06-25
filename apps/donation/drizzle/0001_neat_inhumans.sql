CREATE TABLE "history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request" uuid NOT NULL,
	"status" "request_status" DEFAULT 'pending' NOT NULL,
	"donor" varchar(255) NOT NULL,
	"details" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "history" ADD CONSTRAINT "history_request_requests_id_fk" FOREIGN KEY ("request") REFERENCES "public"."requests"("id") ON DELETE no action ON UPDATE no action;