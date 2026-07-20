import { Link, useParams } from 'react-router'
import { trpc } from '@/providers/trpc'
import { Users, ArrowLeft, User, CalendarDays } from 'lucide-react'

type Contribution = {
  id: number
  editorName: string
  title: string
  category: string
  reading: string | null
  lead: string
  body: string | null
  sources: string | null
  createdAt: Date
}

function fmtDate(d: Date) {
  try {
    return new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

/** 本文を「== 見出し ==」でセクション分割 */
function parseBody(body: string | null) {
  if (!body) return []
  const sections: { heading: string | null; paras: string[] }[] = []
  let current: { heading: string | null; paras: string[] } = { heading: null, paras: [] }
  for (const line of body.split('\n')) {
    const m = line.match(/^==\s*(.+?)\s*==$/)
    if (m) {
      if (current.paras.length || current.heading) sections.push(current)
      current = { heading: m[1], paras: [] }
    } else if (line.trim()) {
      current.paras.push(line.trim())
    }
  }
  if (current.paras.length || current.heading) sections.push(current)
  return sections
}

/** 出典行「タイトル（URL）」をパース */
function parseSources(sources: string | null) {
  if (!sources) return []
  return sources
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const m = s.match(/^(.*?)（(https?:\/\/[^）]+)）$/) ?? s.match(/^(.*?)\((https?:\/\/[^)]+)\)$/)
      return m ? { label: m[1], url: m[2] } : { label: s, url: null }
    })
}

export function ContributionsListPage() {
  const { data, isLoading, isError } = trpc.wiki.published.useQuery()
  const list = (data ?? []) as Contribution[]

  return (
    <div className="wiki-page">
      <h1 className="wiki-h1">みんなの投稿</h1>
      <p className="wiki-subtitle">有志の編集者によって追加された記事</p>
      <p className="wiki-p">
        登録編集者が投稿し、管理者が承認した記事の一覧です。あなたも
        <Link to="/edit" className="wiki-link">編集に参加</Link>できます。
      </p>

      {isLoading && <p className="wiki-p text-[#54595d]">読み込み中…</p>}
      {isError && <p className="wiki-p text-[#54595d]">読み込みに失敗しました。</p>}
      {!isLoading && list.length === 0 && (
        <div className="wiki-notice">
          まだ公開済みの投稿はありません。最初の投稿者になりませんか？
          <Link to="/edit" className="wiki-link ml-1">編集に参加する</Link>
        </div>
      )}

      {list.length > 0 && (
        <table className="wiki-table mt-3">
          <thead>
            <tr>
              <th>記事タイトル</th>
              <th className="w-28">カテゴリ</th>
              <th className="w-32">投稿者</th>
              <th className="w-28">公開日</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link to={`/contributions/${c.id}`} className="wiki-link font-bold">{c.title}</Link>
                  {c.reading && <span className="text-xs text-[#54595d] ml-1">（{c.reading}）</span>}
                </td>
                <td className="text-sm">{c.category}</td>
                <td className="text-sm">{c.editorName}</td>
                <td className="text-sm">{fmtDate(c.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export function ContributionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = trpc.wiki.published.useQuery()
  const list = (data ?? []) as Contribution[]
  const c = list.find((x) => x.id === Number(id))

  if (isLoading) return <div className="wiki-page"><p className="wiki-p text-[#54595d]">読み込み中…</p></div>
  if (!c) {
    return (
      <div className="wiki-page">
        <h1 className="wiki-h1">記事が見つかりません</h1>
        <p className="wiki-p">
          指定された投稿記事は存在しないか、まだ公開されていません。
          <Link to="/contributions" className="wiki-link ml-1">みんなの投稿一覧へ</Link>
        </p>
      </div>
    )
  }

  const sections = parseBody(c.body)
  const sources = parseSources(c.sources)

  return (
    <div className="wiki-page">
      <div className="wiki-article-head">
        <div>
          <h1 className="wiki-h1">{c.title}</h1>
          {c.reading && <p className="wiki-subtitle">{c.reading}</p>}
        </div>
        <div className="wiki-editbar">
          <Link to="/contributions" className="wiki-edit-btn"><ArrowLeft size={13} /> 投稿一覧</Link>
          <Link to="/edit" className="wiki-edit-btn"><Users size={13} /> 編集に参加</Link>
        </div>
      </div>

      <p className="text-xs text-[#54595d] mb-3 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1"><User size={12} /> 投稿者：{c.editorName}</span>
        <span className="inline-flex items-center gap-1"><CalendarDays size={12} /> {fmtDate(c.createdAt)}</span>
        <span>
          カテゴリ：
          <Link to={`/category/${encodeURIComponent(c.category)}`} className="wiki-link">{c.category}</Link>
        </span>
      </p>

      <div className="wiki-notice mb-4">
        この記事は有志の編集者による投稿です（管理者による承認済み）。内容の正確性は保証されません。
      </div>

      <p className="wiki-p">{c.lead}</p>

      {sections.map((sec, i) => (
        <section key={i} className="mt-4">
          {sec.heading && <h2 className="wiki-h2">{sec.heading}</h2>}
          {sec.paras.map((p, j) => <p key={j} className="wiki-p">{p}</p>)}
        </section>
      ))}

      {sources.length > 0 && (
        <section className="mt-6">
          <h2 className="wiki-h2">出典</h2>
          <ul className="wiki-source-list">
            {sources.map((s, i) => (
              <li key={i}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noreferrer" className="wiki-link">{s.label}</a>
                ) : (
                  s.label
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
