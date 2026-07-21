import {
  pgTable,
  pgEnum,
  bigserial,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// 編集者の状態
export const editorStatusEnum = pgEnum("editor_status", [
  "pending",
  "approved",
  "rejected",
]);

// 投稿の状態
export const contributionStatusEnum = pgEnum("contribution_status", [
  "pending",
  "published",
  "rejected",
]);

// 編集者（メアド＋氏名で登録、招待コード or 管理者承認で有効化）
export const editors = pgTable("editors", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  // pending=承認待ち / approved=編集可 / rejected=拒否
  status: editorStatusEnum("status").notNull().default("pending"),
  // ログイン用トークン（メールリンク認証の簡易版）
  token: varchar("token", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 有志が追加した技術記事
export const contributions = pgTable("contributions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  editorId: varchar("editor_id", { length: 64 }).notNull(), // editors.token
  editorName: varchar("editor_name", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  reading: varchar("reading", { length: 255 }),
  lead: text("lead").notNull(), // 導入部
  body: text("body"), // 本文（セクション）
  sources: text("sources"), // 出典（改行区切り）
  // pending=承認待ち / published=公開 / rejected=却下
  status: contributionStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
