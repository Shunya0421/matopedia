import { useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { getArticle } from '@/data/articles'
import { WikiText, WikiPara } from '@/components/WikiText'
import { ExternalLink, Pencil, MessageSquarePlus } from 'lucide-react'
import { githubEditUrl, githubIssueUrl } from '@/config'

export default function ArticlePage() {
  const { slug } = useParams()
  const article = getArticle(slug ?? '')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!article) {
    return (
      <div className="wiki-page">
        <h1 className="wiki-h1">ページが見つかりません</h1>
        <p className="wiki-p">
          指定された記事は存在しません。<Link to="/index" className="wiki-link">技術一覧</Link>から探してください。
        </p>
      </div>
    )
  }

  const toc = article.sections.map((s, i) => ({ n: i + 1, heading: s.heading }))

  return (
    <div className="wiki-page">
      <div className="wiki-article-head">
        <h1 className="wiki-h1">{article.title}</h1>
        <div className="wiki-editbar">
          <a
            href={githubEditUrl()}
            target="_blank"
            rel="noreferrer"
            className="wiki-edit-btn"
            title="GitHubでこの記事のソースを編集（要GitHubアカウント）"
          >
            <Pencil size={13} /> 編集
          </a>
          <a
            href={githubIssueUrl(article.title, article.slug)}
            target="_blank"
            rel="noreferrer"
            className="wiki-edit-btn"
            title="GitHubのIssueで修正を提案"
          >
            <MessageSquarePlus size={13} /> 修正を提案
          </a>
        </div>
      </div>
      <p className="wiki-subtitle">
        まといのば気功技術大百科より
        {article.reading && <span className="ml-2 text-[#54595d]">（{article.reading}）</span>}
      </p>

      {/* インフォボックス（右寄せ） */}
      <aside className="wiki-infobox">
        <div className="wiki-infobox-title">{article.title}</div>
        {article.reading && <div className="wiki-infobox-sub">{article.reading}</div>}
        <table className="wiki-infobox-table">
          <tbody>
            <tr>
              <th>カテゴリ</th>
              <td>
                <Link to={`/category/${encodeURIComponent(article.category)}`} className="wiki-link">
                  {article.category}
                </Link>
              </td>
            </tr>
            {article.infobox.map((row) => (
              <tr key={row.label}>
                <th>{row.label}</th>
                <td>
                  <WikiText text={row.value} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>

      {/* 導入部 */}
      {article.lead.map((p, i) => (
        <WikiPara key={i} text={p} />
      ))}

      {/* 目次 */}
      {toc.length > 1 && (
        <nav className="wiki-toc">
          <div className="wiki-toc-title">目次</div>
          <ol>
            {toc.map((t) => (
              <li key={t.n}>
                <a href={`#sec-${t.n}`}>
                  <span className="wiki-toc-num">{t.n}</span> {t.heading}
                </a>
              </li>
            ))}
            <li>
              <a href="#references">
                <span className="wiki-toc-num">{toc.length + 1}</span> 出典
              </a>
            </li>
            <li>
              <a href="#related">
                <span className="wiki-toc-num">{toc.length + 2}</span> 関連項目
              </a>
            </li>
          </ol>
        </nav>
      )}

      {/* 本文セクション */}
      {article.sections.map((s, i) => (
        <section key={i}>
          <h2 className="wiki-h2" id={`sec-${i + 1}`}>
            {s.heading}
            <a
              href={githubEditUrl()}
              target="_blank"
              rel="noreferrer"
              className="wiki-section-edit"
              title="このセクションを編集"
            >
              [編集]
            </a>
          </h2>
          {s.paras.map((p, j) => (
            <WikiPara key={j} text={p} />
          ))}
        </section>
      ))}

      {/* 出典 */}
      <section>
        <h2 className="wiki-h2" id="references">出典</h2>
        <ol className="wiki-refs">
          {article.sources.map((s, i) => (
            <li key={i}>
              <a href={s.url} target="_blank" rel="noreferrer" className="wiki-link inline-flex items-center gap-1">
                {s.label}
                <ExternalLink size={11} />
              </a>
            </li>
          ))}
        </ol>
      </section>

      {/* 関連項目 */}
      {article.related.length > 0 && (
        <section>
          <h2 className="wiki-h2" id="related">関連項目</h2>
          <ul className="wiki-related">
            {article.related.map((r) => {
              const ra = getArticle(r)
              if (!ra) return null
              return (
                <li key={r}>
                  <Link to={`/wiki/${r}`} className="wiki-link">{ra.title}</Link>
                  <span className="text-[#54595d] text-sm">（{ra.category}）</span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* カテゴリバー */}
      <div className="wiki-catbar">
        カテゴリ：
        <Link to={`/category/${encodeURIComponent(article.category)}`} className="wiki-link">
          {article.category}
        </Link>
        <span className="mx-2">|</span>
        <Link to="/index" className="wiki-link">技術一覧</Link>
      </div>

      <p className="wiki-updated">このページの最終更新：{article.updated}（ファン編纂）</p>
    </div>
  )
}
