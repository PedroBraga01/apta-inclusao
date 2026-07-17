CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"metadata" jsonb,
	"ip_hash" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"purpose" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" text NOT NULL,
	"used_at" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidate_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"city" text,
	"state" text,
	"education" text,
	"area" text,
	"experience" text,
	"work_mode" text,
	"disability" text,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"accessibility_resources" jsonb DEFAULT '[]'::jsonb,
	"profile_progress" integer DEFAULT 0 NOT NULL,
	"sharing_enabled" boolean DEFAULT false NOT NULL,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_profiles" (
	"user_id" text PRIMARY KEY NOT NULL,
	"legal_name" text NOT NULL,
	"tax_id" text,
	"city" text,
	"state" text,
	"employee_range" text,
	"contact_name" text NOT NULL,
	"contact_email" text NOT NULL,
	"contact_phone" text,
	"contact_area" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"starts_at" text NOT NULL,
	"ends_at" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consents" (
	"id" text PRIMARY KEY NOT NULL,
	"candidate_id" text NOT NULL,
	"type" text NOT NULL,
	"version" text NOT NULL,
	"purpose" text NOT NULL,
	"granted" boolean NOT NULL,
	"recorded_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"revoked_at" text
);
--> statement-breakpoint
CREATE TABLE "consultancies" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"subject" text NOT NULL,
	"notes" text,
	"scheduled_at" text,
	"responsible_id" text,
	"status" text DEFAULT 'REQUESTED' NOT NULL,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"candidate_id" text NOT NULL,
	"message" text,
	"status" text DEFAULT 'REQUESTED' NOT NULL,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"company_id" text NOT NULL,
	"candidate_id" text NOT NULL,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	CONSTRAINT "favorites_company_id_candidate_id_pk" PRIMARY KEY("company_id","candidate_id")
);
--> statement-breakpoint
CREATE TABLE "login_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"email_hash" text NOT NULL,
	"succeeded" boolean DEFAULT false NOT NULL,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"channel" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"scheduled_at" text,
	"sent_at" text,
	"read_at" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"benefits" jsonb DEFAULT '[]'::jsonb,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questionnaire_answers" (
	"id" text PRIMARY KEY NOT NULL,
	"candidate_id" text NOT NULL,
	"questionnaire_id" text NOT NULL,
	"question_id" text NOT NULL,
	"value" jsonb NOT NULL,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questionnaires" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"created_by" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"questionnaire_id" text NOT NULL,
	"prompt" text NOT NULL,
	"help_text" text,
	"audio_key" text,
	"type" text NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb,
	"required" boolean DEFAULT true NOT NULL,
	"position" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" text PRIMARY KEY NOT NULL,
	"candidate_id" text NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"content" "bytea",
	"status" text DEFAULT 'ACTIVE' NOT NULL,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"deleted_at" text
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" text NOT NULL,
	"revoked_at" text,
	"user_agent" text,
	"ip_hash" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "talks" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"starts_at" text NOT NULL,
	"format" text NOT NULL,
	"location" text NOT NULL,
	"price_cents" integer DEFAULT 0 NOT NULL,
	"capacity" integer NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"created_by" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"talk_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"total_cents" integer NOT NULL,
	"status" text DEFAULT 'RESERVED' NOT NULL,
	"payment_provider" text,
	"external_payment_id" text,
	"reservation_expires_at" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"talk_id" text NOT NULL,
	"holder_name" text NOT NULL,
	"code" text NOT NULL,
	"status" text DEFAULT 'VALID' NOT NULL,
	"issued_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"used_at" text
);
--> statement-breakpoint
CREATE TABLE "training_bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"requester_id" text NOT NULL,
	"slot_id" text,
	"topic" text NOT NULL,
	"preferred_starts_at" text,
	"format" text NOT NULL,
	"participants" integer DEFAULT 1 NOT NULL,
	"contact_email" text NOT NULL,
	"status" text DEFAULT 'REQUESTED' NOT NULL,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "training_slots" (
	"id" text PRIMARY KEY NOT NULL,
	"starts_at" text NOT NULL,
	"ends_at" text NOT NULL,
	"format" text NOT NULL,
	"capacity" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_by" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"email_verified_at" text,
	"last_access_at" text,
	"created_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL,
	"updated_at" text DEFAULT to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_profiles" ADD CONSTRAINT "candidate_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_profiles" ADD CONSTRAINT "company_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_subscriptions" ADD CONSTRAINT "company_subscriptions_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_subscriptions" ADD CONSTRAINT "company_subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consents" ADD CONSTRAINT "consents_candidate_id_users_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultancies" ADD CONSTRAINT "consultancies_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultancies" ADD CONSTRAINT "consultancies_responsible_id_users_id_fk" FOREIGN KEY ("responsible_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_candidate_id_users_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_company_id_users_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_candidate_id_users_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_answers" ADD CONSTRAINT "questionnaire_answers_candidate_id_users_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_answers" ADD CONSTRAINT "questionnaire_answers_questionnaire_id_questionnaires_id_fk" FOREIGN KEY ("questionnaire_id") REFERENCES "public"."questionnaires"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_answers" ADD CONSTRAINT "questionnaire_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaires" ADD CONSTRAINT "questionnaires_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_questionnaire_id_questionnaires_id_fk" FOREIGN KEY ("questionnaire_id") REFERENCES "public"."questionnaires"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_candidate_id_users_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "talks" ADD CONSTRAINT "talks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_orders" ADD CONSTRAINT "ticket_orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_orders" ADD CONSTRAINT "ticket_orders_talk_id_talks_id_fk" FOREIGN KEY ("talk_id") REFERENCES "public"."talks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_order_id_ticket_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."ticket_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_talk_id_talks_id_fk" FOREIGN KEY ("talk_id") REFERENCES "public"."talks"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_bookings" ADD CONSTRAINT "training_bookings_requester_id_users_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_bookings" ADD CONSTRAINT "training_bookings_slot_id_training_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."training_slots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_slots" ADD CONSTRAINT "training_slots_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_actor_idx" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_tokens_hash_unique" ON "auth_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "auth_tokens_user_purpose_idx" ON "auth_tokens" USING btree ("user_id","purpose");--> statement-breakpoint
CREATE INDEX "candidate_profiles_location_idx" ON "candidate_profiles" USING btree ("state","city");--> statement-breakpoint
CREATE INDEX "candidate_profiles_area_idx" ON "candidate_profiles" USING btree ("area");--> statement-breakpoint
CREATE INDEX "subscriptions_company_status_idx" ON "company_subscriptions" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "consents_candidate_type_idx" ON "consents" USING btree ("candidate_id","type");--> statement-breakpoint
CREATE INDEX "consultancies_company_status_idx" ON "consultancies" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "contact_requests_candidate_status_idx" ON "contact_requests" USING btree ("candidate_id","status");--> statement-breakpoint
CREATE INDEX "contact_requests_company_idx" ON "contact_requests" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "login_attempts_email_time_idx" ON "login_attempts" USING btree ("email_hash","created_at");--> statement-breakpoint
CREATE INDEX "notifications_user_status_idx" ON "notifications" USING btree ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "answers_candidate_question_unique" ON "questionnaire_answers" USING btree ("candidate_id","question_id");--> statement-breakpoint
CREATE UNIQUE INDEX "questions_questionnaire_position_unique" ON "questions" USING btree ("questionnaire_id","position");--> statement-breakpoint
CREATE INDEX "resumes_candidate_status_idx" ON "resumes" USING btree ("candidate_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "sessions_token_hash_unique" ON "sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expiration_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "ticket_orders_talk_status_idx" ON "ticket_orders" USING btree ("talk_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "ticket_orders_external_payment_unique" ON "ticket_orders" USING btree ("external_payment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tickets_code_unique" ON "tickets" USING btree ("code");--> statement-breakpoint
CREATE INDEX "training_bookings_slot_status_idx" ON "training_bookings" USING btree ("slot_id","status");--> statement-breakpoint
CREATE INDEX "training_bookings_requester_idx" ON "training_bookings" USING btree ("requester_id");--> statement-breakpoint
CREATE UNIQUE INDEX "training_slots_period_unique" ON "training_slots" USING btree ("starts_at","ends_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");