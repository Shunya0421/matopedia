import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { ShieldCheck, CheckCircle2, XCircle, LogOut, Clock, Users, FileCheck, FileX } from 'lucide-react'

const ADMIN_KEY = 'matopedia_admin_token'

type Contribution = {
  id: number
  editorName: string
  title: string
  category: string
  reading: string | null
  lead: string
  body: string | null
  sources: string | null
  status: string
  createdAt: Date
}

type EditorRow = {
  id: number
  email: string
  name: string
  status: string
  createdAt: Date
}

function fmtDate(d: Date) {
  try {
    return new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

function ContributionCard({
  c,
  token,
  onDone,
}: {
  c: Contribution
  token: string
  onDone: () => void
}) {
  const moderate = trpc.wiki.moderate.useMutation()
  const act = async (action: 'publish' | 'reject') => {
    const label = action === 'publish' ? '公開' : '却下'
    if (!window.confirm(`「${c.title}」を${label}しますか？`)) return
    await moderate.mutateAsync({ adminToken: token, id: c.id, action })
    onDone()
  }
  return (
    <article className="wiki-portal mb-4">
      <h2 className="wiki-portal-title">{c.title}</h2>
      <p className="text-xs text-[#54595d] mb-2">
        投稿者：<strong>{c.editorName}</strong> ／ カテゴリ：{c.category}
        {c.reading && ` ／ 読み：${c.reading}`} ／ {fmtDate(c.createdAt)}
      </p>
      <p className="wiki-p">{c.lead}</p>
      {c.body && (
        <details className="mt-2">
          <summary className="text-sm text-[#3366cc] cursor-pointer">本文を表示</summary>
          <div className="wiki-p whitespace-pre-wrap mt-2 text-sm">{c.body}</div>
        </details>
      )}
      {c.sources && (
        <details className="mt-1">
          <summary className="text-sm text-[#3366cc] cursor-pointer">出典を表示</summary>
          <div className="whitespace-pre-wrap mt-1 text-sm">{c.sources}</div>
        </details>
      )}
      <div className="flex gap-2 mt-3">
        <button
          className="wiki-form-btn inline-flex items-center gap-1"
          onClick={() => act('publish')}
          disabled={moderate.isPending}
        >
          <CheckCircle2 size={14} /> 公開する
        </button>
        <button
          className="wiki-form-btn inline-flex items-center gap-1 !bg-[#a94442]"
          onClick={() => act('reject')}
          disabled={moderate.isPending}
        >
          <XCircle size={14} /> 却下する
        </button>
      </div>
    </article>
  )
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_KEY))
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState<'pending' | 'published' | 'rejected' | 'editors'>('pending')

  const pendingQ = trpc.wiki.pending.useQuery(
    { adminToken: token ?? '' },
    { enabled: !!token, retry: false }
  )
  const publishedQ = trpc.wiki.published.useQuery(undefined, { enabled: !!token })
  const rejectedQ = trpc.wiki.rejected.useQuery(
    { adminToken: token ?? '' },
    { enabled: !!token, retry: false }
  )
  const editorsQ = trpc.wiki.editors.useQuery(
    { adminToken: token ?? '' },
    { enabled: !!token, retry: false }
  )

  const refetchAll = () => {
    pendingQ.refetch()
    publishedQ.refetch()
    rejectedQ.refetch()
  }

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY)
    setToken(null)
    setPw('')
  }

  // 未ログイン：パスワード入力
  if (!token) {
    const submit = (e: FormEvent) => {
      e.preventDefault()
      localStorage.setItem(ADMIN_KEY, pw)
      setToken(pw)
    }
    return (
      <div className="wiki-page">
        <h1 className="wiki-h1">管理画面</h1>
        <p className="wiki-subtitle">投稿の承認・却下（管理者専用）</p>
        <form onSubmit={submit} className="wiki-form max-w-md">
          <label className="wiki-form-label">
            管理者パスワード
            <input
              className="wiki-form-input"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              placeholder="オーナーから共有されたパスワード"
            />
          </label>
          <button className="wiki-form-btn">
            <ShieldCheck size={14} className="inline mr-1" /> ログイン
          </button>
        </form>
      </div>
    )
  }

  // 認証エラー（パスワード違い）
  if (pendingQ.isError) {
    return (
      <div className="wiki-page">
        <h1 className="wiki-h1">管理画面</h1>
        <div className="wiki-notice">
          パスワードが正しくありません。オーナーに確認してください。
        </div>
        <button onClick={logout} className="wiki-form-btn mt-3">パスワードを再入力</button>
      </div>
    )
  }

  const pending = (pendingQ.data ?? []) as Contribution[]
  const published = (publishedQ.data ?? []) as Contribution[]
  const rejected = (rejectedQ.data ?? []) as Contribution[]
  const editorRows = (editorsQ.data ?? []) as EditorRow[]

  const tabs = [
    { key: 'pending' as const, label: `承認待ち（${pending.length}）`, icon: Clock },
    { key: 'published' as const, label: `公開済み（${published.length}）`, icon: FileCheck },
    { key: 'rejected' as const, label: `却下済み（${rejected.length}）`, icon: FileX },
    { key: 'editors' as const, label: `編集者（${editorRows.length}）`, icon: Users },
  ]

  return (
    <div className="wiki-page">
      <div className="wiki-article-head">
        <div>
          <h1 className="wiki-h1">管理画面</h1>
          <p className="wiki-subtitle">投稿の承認・却下</p>
        </div>
        <div className="wiki-editbar">
          <button onClick={logout} className="wiki-edit-btn inline-flex items-center gap-1">
            <LogOut size={13} /> ログアウト
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`wiki-edit-btn inline-flex items-center gap-1 ${tab === t.key ? 'font-bold underline' : ''}`}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'pending' && (
        <>
          {pendingQ.isLoading && <p className="wiki-p text-[#54595d]">読み込み中…</p>}
          {!pendingQ.isLoading && pending.length === 0 && (
            <div className="wiki-notice">承認待ちの投稿はありません。</div>
          )}
          {pending.map((c) => (
            <ContributionCard key={c.id} c={c} token={token} onDone={refetchAll} />
          ))}
        </>
      )}

      {tab === 'published' && (
        <>
          {published.length === 0 && <div className="wiki-notice">公開済みの投稿はありません。</div>}
          {published.length > 0 && (
            <table className="wiki-table">
              <thead>
                <tr><th>記事</th><th className="w-28">投稿者</th><th className="w-28">公開日</th><th className="w-24">操作</th></tr>
              </thead>
              <tbody>
                {published.map((c) => (
                  <tr key={c.id}>
                    <td><Link to={`/contributions/${c.id}`} className="wiki-link font-bold">{c.title}</Link></td>
                    <td className="text-sm">{c.editorName}</td>
                    <td className="text-sm">{fmtDate(c.createdAt)}</td>
                    <td>
                      <RejectButton c={c} token={token} onDone={refetchAll} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === 'rejected' && (
        <>
          {rejected.length === 0 && <div className="wiki-notice">却下済みの投稿はありません。</div>}
          {rejected.map((c) => (
            <ContributionCard key={c.id} c={c} token={token} onDone={refetchAll} />
          ))}
        </>
      )}

      {tab === 'editors' && (
        <>
          {editorRows.length === 0 && <div className="wiki-notice">登録編集者はいません。</div>}
          {editorRows.length > 0 && (
            <table className="wiki-table">
              <thead>
                <tr><th>氏名</th><th>メールアドレス</th><th className="w-28">状態</th><th className="w-28">登録日</th></tr>
              </thead>
              <tbody>
                {editorRows.map((e) => (
                  <tr key={e.id}>
                    <td className="font-bold">{e.name}</td>
                    <td className="text-sm">{e.email}</td>
                    <td className="text-sm">{e.status === 'approved' ? '承認済み' : e.status}</td>
                    <td className="text-sm">{fmtDate(e.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}

function RejectButton({ c, token, onDone }: { c: Contribution; token: string; onDone: () => void }) {
  const moderate = trpc.wiki.moderate.useMutation()
  return (
    <button
      className="text-sm text-[#a94442] underline"
      disabled={moderate.isPending}
      onClick={async () => {
        if (!window.confirm(`「${c.title}」を取り下げ（却下）しますか？`)) return
        await moderate.mutateAsync({ adminToken: token, id: c.id, action: 'reject' })
        onDone()
      }}
    >
      取り下げ
    </button>
  )
}
