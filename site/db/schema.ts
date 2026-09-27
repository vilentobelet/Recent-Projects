import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const products = sqliteTable("products", { id: integer("id").primaryKey({ autoIncrement: true }), industry: text("industry").notNull(), name: text("name").notNull(), idea: text("idea").notNull(), link: text("link").notNull(), password: text("password").notNull().default(""), color: text("color").notNull().default("orange"), logoUrl: text("logo_url").notNull().default(""), featured: integer("featured", { mode: "boolean" }).notNull().default(false), sortOrder: integer("sort_order").notNull().default(0), createdAt: integer("created_at").notNull(), updatedAt: integer("updated_at").notNull() });

export const boardProfile = sqliteTable("board_profile", {
  id: integer("id").primaryKey(),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  avatarUrl: text("avatar_url").notNull().default(""),
  updatedAt: integer("updated_at").notNull(),
});
