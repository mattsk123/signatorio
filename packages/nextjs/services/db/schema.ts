import { pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import type { Address } from "viem";

export const messageTypeEnum = pgEnum("message_type", ["text", "typed_data"]);
export type MessageType = (typeof messageTypeEnum.enumValues)[number];

export const messagesTable = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  type: messageTypeEnum("type").notNull(),
  message: text("message"),
  creator: varchar("creator", { length: 42 }).notNull().$type<Address>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const signaturesTable = pgTable(
  "signatures",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    message: uuid("message")
      .notNull()
      .references(() => messagesTable.id),
    signature: text("signature").notNull(),
    signer: varchar("signer", { length: 42 }).notNull().$type<Address>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => [uniqueIndex("unique_signature_idx").on(table.message, table.signer)],
);
