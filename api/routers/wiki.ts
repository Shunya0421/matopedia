import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { editors, contributions } from "@db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

// 招待コード（環境変数 INVITE_CODE で上書き可能。既定は開発用）
// ※dotenv の読み込み完了後に評価されるよう、モジュールスコープではなく都度読む
const getInviteCode = () => process.env.INVITE_CODE ?? "matopedia";
// 管理者トークン（承認操作用。環境変数 ADMIN_TOKEN で上書き。既定は開発用）
const getAdminToken = () => process.env.ADMIN_TOKEN ?? "admin-secret";

const registerInput = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  inviteCode: z.string(),
});

const contributeInput = z.object({
  token: z.string(),
  title: z.string().min(1).max(255),
  category: z.string().min(1).max(50),
  reading: z.string().max(255).optional(),
  lead: z.string().min(1),
  body: z.string().optional(),
  sources: z.string().optional(),
});

async function findEditorByToken(token: string) {
  const db = getDb();
  const rows = await db.select().from(editors).where(eq(editors.token, token)).limit(1);
  return rows[0];
}

export const wikiRouter = createRouter({
  // 編集者登録（招待コード必須）
  register: publicQuery
    .input(registerInput)
    .mutation(async ({ input }) => {
      if (input.inviteCode !== getInviteCode()) {
        throw new Error("招待コードが正しくありません");
      }
      const db = getDb();
      // 既存チェック
      const existing = await db
        .select()
        .from(editors)
        .where(eq(editors.email, input.email))
        .limit(1);
      if (existing[0]) {
        // 既登録なら承認済みならトークンを返す
        if (existing[0].status === "approved") {
          return { ok: true, token: existing[0].token, status: "approved" as const };
        }
        return { ok: true, token: null, status: existing[0].status };
      }
      const token = randomBytes(24).toString("hex");
      await db.insert(editors).values({
        email: input.email,
        name: input.name,
        token,
        status: "approved", // 招待コードを知っている＝即承認
      });
      return { ok: true, token, status: "approved" as const };
    }),

  // ログイン（メアドでトークン再取得）
  login: publicQuery
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const rows = await db
        .select()
        .from(editors)
        .where(eq(editors.email, input.email))
        .limit(1);
      const ed = rows[0];
      if (!ed) throw new Error("このメールアドレスは登録されていません");
      if (ed.status !== "approved") throw new Error("まだ承認されていません");
      return { ok: true, token: ed.token, name: ed.name };
    }),

  // 自分の情報取得
  me: publicQuery
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const ed = await findEditorByToken(input.token);
      if (!ed) throw new Error("未登録です");
      return { name: ed.name, email: ed.email, status: ed.status };
    }),

  // 技術を投稿（承認待ちで保存）
  contribute: publicQuery
    .input(contributeInput)
    .mutation(async ({ input }) => {
      const ed = await findEditorByToken(input.token);
      if (!ed || ed.status !== "approved") {
        throw new Error("編集権限がありません");
      }
      const db = getDb();
      await db.insert(contributions).values({
        editorId: input.token,
        editorName: ed.name,
        title: input.title,
        category: input.category,
        reading: input.reading ?? null,
        lead: input.lead,
        body: input.body ?? null,
        sources: input.sources ?? null,
        status: "pending",
      });
      return { ok: true };
    }),

  // 自分の投稿一覧
  myContributions: publicQuery
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(contributions)
        .where(eq(contributions.editorId, input.token));
    }),

  // 公開済みの有志記事一覧
  published: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(contributions)
      .where(eq(contributions.status, "published"));
  }),

  // 承認待ち一覧（管理者）
  pending: publicQuery
    .input(z.object({ adminToken: z.string() }))
    .query(async ({ input }) => {
      if (input.adminToken !== getAdminToken()) throw new Error("権限がありません");
      const db = getDb();
      return db
        .select()
        .from(contributions)
        .where(eq(contributions.status, "pending"));
    }),

  // 却下済み一覧（管理者）
  rejected: publicQuery
    .input(z.object({ adminToken: z.string() }))
    .query(async ({ input }) => {
      if (input.adminToken !== getAdminToken()) throw new Error("権限がありません");
      const db = getDb();
      return db
        .select()
        .from(contributions)
        .where(eq(contributions.status, "rejected"));
    }),

  // 編集者一覧（管理者。トークンは返さない）
  editors: publicQuery
    .input(z.object({ adminToken: z.string() }))
    .query(async ({ input }) => {
      if (input.adminToken !== getAdminToken()) throw new Error("権限がありません");
      const db = getDb();
      const rows = await db.select().from(editors);
      return rows.map((e) => ({
        id: e.id,
        email: e.email,
        name: e.name,
        status: e.status,
        createdAt: e.createdAt,
      }));
    }),

  // 承認/却下（管理者）
  moderate: publicQuery
    .input(
      z.object({
        adminToken: z.string(),
        id: z.number(),
        action: z.enum(["publish", "reject"]),
      })
    )
    .mutation(async ({ input }) => {
      if (input.adminToken !== getAdminToken()) throw new Error("権限がありません");
      const db = getDb();
      await db
        .update(contributions)
        .set({ status: input.action === "publish" ? "published" : "rejected" })
        .where(eq(contributions.id, input.id));
      return { ok: true };
    }),
});
