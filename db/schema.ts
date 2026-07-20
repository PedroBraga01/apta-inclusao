import { sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgTable as sqliteTable,
  primaryKey,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

const isoTimestampDefault = sql`to_char(timezone('UTC', current_timestamp), 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`;

const createdAt = () =>
  text("created_at").notNull().default(isoTimestampDefault);
const updatedAt = () =>
  text("updated_at").notNull().default(isoTimestampDefault);

export const users = sqliteTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", {
      enum: ["CANDIDATE", "COMPANY", "ADMIN"],
    }).notNull(),
    status: text("status", {
      enum: ["PENDING", "ACTIVE", "BLOCKED", "DELETED"],
    })
      .notNull()
      .default("PENDING"),
    emailVerifiedAt: text("email_verified_at"),
    lastAccessAt: text("last_access_at"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: text("expires_at").notNull(),
    revokedAt: text("revoked_at"),
    userAgent: text("user_agent"),
    ipHash: text("ip_hash"),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_unique").on(table.tokenHash),
    index("sessions_user_idx").on(table.userId),
    index("sessions_expiration_idx").on(table.expiresAt),
  ],
);

export const authTokens = sqliteTable(
  "auth_tokens",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    purpose: text("purpose", {
      enum: ["VERIFY_EMAIL", "RESET_PASSWORD"],
    }).notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: text("expires_at").notNull(),
    usedAt: text("used_at"),
    createdAt: createdAt(),
  },
  (table) => [
    uniqueIndex("auth_tokens_hash_unique").on(table.tokenHash),
    index("auth_tokens_user_purpose_idx").on(table.userId, table.purpose),
  ],
);

export const loginAttempts = sqliteTable(
  "login_attempts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    emailHash: text("email_hash").notNull(),
    succeeded: boolean("succeeded").notNull().default(false),
    createdAt: createdAt(),
  },
  (table) => [
    index("login_attempts_email_time_idx").on(table.emailHash, table.createdAt),
  ],
);

export const candidateProfiles = sqliteTable(
  "candidate_profiles",
  {
    userId: text("user_id")
      .primaryKey()
      .references(() => users.id, { onDelete: "cascade" }),
    fullName: text("full_name").notNull(),
    phone: text("phone"),
    city: text("city"),
    state: text("state"),
    education: text("education"),
    area: text("area"),
    experience: text("experience"),
    workMode: text("work_mode"),
    disability: text("disability"),
    skills: jsonb("skills").$type<string[]>().default([]),
    accessibilityResources: jsonb("accessibility_resources")
      .$type<string[]>()
      .default([]),
    profileProgress: integer("profile_progress").notNull().default(0),
    sharingEnabled: boolean("sharing_enabled")
      .notNull()
      .default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("candidate_profiles_location_idx").on(table.state, table.city),
    index("candidate_profiles_area_idx").on(table.area),
  ],
);

export const companyProfiles = sqliteTable("company_profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  legalName: text("legal_name").notNull(),
  taxId: text("tax_id"),
  city: text("city"),
  state: text("state"),
  employeeRange: text("employee_range"),
  contactName: text("contact_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  contactArea: text("contact_area"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const consents = sqliteTable(
  "consents",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type", {
      enum: ["PROFILE_SHARING", "RESUME_SHARING", "COMMUNICATIONS"],
    }).notNull(),
    version: text("version").notNull(),
    purpose: text("purpose").notNull(),
    granted: boolean("granted").notNull(),
    recordedAt: text("recorded_at").notNull().default(isoTimestampDefault),
    revokedAt: text("revoked_at"),
  },
  (table) => [index("consents_candidate_type_idx").on(table.candidateId, table.type)],
);

export const resumes = sqliteTable(
  "resumes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    originalName: text("original_name").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    content: bytea("content"),
    status: text("status", { enum: ["ACTIVE", "REPLACED", "DELETED"] })
      .notNull()
      .default("ACTIVE"),
    createdAt: createdAt(),
    deletedAt: text("deleted_at"),
  },
  (table) => [
    index("resumes_candidate_status_idx").on(table.candidateId, table.status),
  ],
);

export const questionnaires = sqliteTable("questionnaires", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  status: text("status", { enum: ["DRAFT", "PUBLISHED", "ARCHIVED"] })
    .notNull()
    .default("DRAFT"),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const questions = sqliteTable(
  "questions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    questionnaireId: text("questionnaire_id")
      .notNull()
      .references(() => questionnaires.id, { onDelete: "cascade" }),
    prompt: text("prompt").notNull(),
    helpText: text("help_text"),
    audioKey: text("audio_key"),
    type: text("type", {
      enum: ["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TEXT"],
    }).notNull(),
    options: jsonb("options").$type<string[]>().default([]),
    required: boolean("required").notNull().default(true),
    position: integer("position").notNull(),
  },
  (table) => [
    uniqueIndex("questions_questionnaire_position_unique").on(
      table.questionnaireId,
      table.position,
    ),
  ],
);

export const questionnaireAnswers = sqliteTable(
  "questionnaire_answers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionnaireId: text("questionnaire_id")
      .notNull()
      .references(() => questionnaires.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    value: jsonb("value").$type<string | string[]>().notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("answers_candidate_question_unique").on(
      table.candidateId,
      table.questionId,
    ),
  ],
);

export const favorites = sqliteTable(
  "favorites",
  {
    companyId: text("company_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (table) => [primaryKey({ columns: [table.companyId, table.candidateId] })],
);

export const contactRequests = sqliteTable(
  "contact_requests",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    companyId: text("company_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    message: text("message"),
    status: text("status", {
      enum: ["REQUESTED", "ACCEPTED", "DECLINED", "CANCELLED"],
    })
      .notNull()
      .default("REQUESTED"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("contact_requests_candidate_status_idx").on(
      table.candidateId,
      table.status,
    ),
    index("contact_requests_company_idx").on(table.companyId),
  ],
);

export const talks = sqliteTable("talks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startsAt: text("starts_at").notNull(),
  format: text("format", { enum: ["ONLINE", "IN_PERSON"] }).notNull(),
  location: text("location").notNull(),
  priceCents: integer("price_cents").notNull().default(0),
  capacity: integer("capacity").notNull(),
  status: text("status", {
    enum: ["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"],
  })
    .notNull()
    .default("DRAFT"),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const ticketOrders = sqliteTable(
  "ticket_orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    talkId: text("talk_id")
      .notNull()
      .references(() => talks.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    totalCents: integer("total_cents").notNull(),
    status: text("status", {
      enum: ["RESERVED", "PAID", "EXPIRED", "CANCELLED", "REFUNDED"],
    })
      .notNull()
      .default("RESERVED"),
    paymentProvider: text("payment_provider"),
    externalPaymentId: text("external_payment_id"),
    reservationExpiresAt: text("reservation_expires_at"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("ticket_orders_talk_status_idx").on(table.talkId, table.status),
    uniqueIndex("ticket_orders_external_payment_unique").on(
      table.externalPaymentId,
    ),
  ],
);

export const tickets = sqliteTable(
  "tickets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text("order_id")
      .notNull()
      .references(() => ticketOrders.id, { onDelete: "cascade" }),
    talkId: text("talk_id")
      .notNull()
      .references(() => talks.id, { onDelete: "restrict" }),
    holderName: text("holder_name").notNull(),
    code: text("code").notNull(),
    status: text("status", { enum: ["VALID", "USED", "CANCELLED"] })
      .notNull()
      .default("VALID"),
    issuedAt: text("issued_at").notNull().default(isoTimestampDefault),
    usedAt: text("used_at"),
  },
  (table) => [uniqueIndex("tickets_code_unique").on(table.code)],
);

export const trainingSlots = sqliteTable(
  "training_slots",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    startsAt: text("starts_at").notNull(),
    endsAt: text("ends_at").notNull(),
    format: text("format", {
      enum: ["ONLINE", "IN_PERSON", "HYBRID"],
    }).notNull(),
    capacity: integer("capacity").notNull().default(1),
    status: text("status", { enum: ["OPEN", "BLOCKED", "CLOSED"] })
      .notNull()
      .default("OPEN"),
    createdBy: text("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: createdAt(),
  },
  (table) => [uniqueIndex("training_slots_period_unique").on(table.startsAt, table.endsAt)],
);

export const trainingBookings = sqliteTable(
  "training_bookings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    requesterId: text("requester_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    slotId: text("slot_id").references(() => trainingSlots.id, {
      onDelete: "set null",
    }),
    topic: text("topic").notNull(),
    preferredStartsAt: text("preferred_starts_at"),
    format: text("format", {
      enum: ["ONLINE", "IN_PERSON", "HYBRID"],
    }).notNull(),
    participants: integer("participants").notNull().default(1),
    contactEmail: text("contact_email").notNull(),
    status: text("status", {
      enum: ["REQUESTED", "CONFIRMED", "RESCHEDULED", "CANCELLED", "COMPLETED"],
    })
      .notNull()
      .default("REQUESTED"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("training_bookings_slot_status_idx").on(table.slotId, table.status),
    index("training_bookings_requester_idx").on(table.requesterId),
  ],
);

export const plans = sqliteTable("plans", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  benefits: jsonb("benefits").$type<string[]>().default([]),
  active: boolean("active").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const companySubscriptions = sqliteTable(
  "company_subscriptions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    companyId: text("company_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    planId: text("plan_id")
      .notNull()
      .references(() => plans.id, { onDelete: "restrict" }),
    status: text("status", { enum: ["ACTIVE", "PAUSED", "CANCELLED", "EXPIRED"] })
      .notNull()
      .default("ACTIVE"),
    startsAt: text("starts_at").notNull(),
    endsAt: text("ends_at"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("subscriptions_company_status_idx").on(table.companyId, table.status)],
);

export const consultancies = sqliteTable(
  "consultancies",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    companyId: text("company_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    subject: text("subject").notNull(),
    notes: text("notes"),
    scheduledAt: text("scheduled_at"),
    responsibleId: text("responsible_id").references(() => users.id, {
      onDelete: "set null",
    }),
    status: text("status", {
      enum: ["REQUESTED", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
    })
      .notNull()
      .default("REQUESTED"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("consultancies_company_status_idx").on(table.companyId, table.status)],
);

export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    channel: text("channel", { enum: ["IN_APP", "EMAIL", "PUSH"] }).notNull(),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    status: text("status", { enum: ["PENDING", "SENT", "FAILED", "READ"] })
      .notNull()
      .default("PENDING"),
    attempts: integer("attempts").notNull().default(0),
    scheduledAt: text("scheduled_at"),
    sentAt: text("sent_at"),
    readAt: text("read_at"),
    createdAt: createdAt(),
  },
  (table) => [index("notifications_user_status_idx").on(table.userId, table.status)],
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    actorId: text("actor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    ipHash: text("ip_hash"),
    createdAt: createdAt(),
  },
  (table) => [
    index("audit_logs_actor_idx").on(table.actorId),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
  ],
);
