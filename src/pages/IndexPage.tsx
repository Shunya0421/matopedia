import { Link } from 'react-router'
import { articles, CATEGORIES, getByCategory, stripMarkup } from '@/data/articles'

export default function IndexPage() {
  return (
    <div className="wiki-page">
      <h1 className="wiki-h1">技術一覧</h1>
      <p className="wiki-subtitle">収録記事の全リスト（{articles.length} 件）</p>

      {CATEGORIES.map((cat) => (
        <section key={cat}>
          <h2 className="wiki-h2">{cat}</h2>
          <table className="wiki-table">
            <thead>
              <tr>
                <th>記事名</th>
                <th>概要</th>
              </tr>
            </thead>
            <tbody>
              {getByCategory(cat).map((a) => (
                <tr key={a.slug}>
                  <td className="whitespace-nowrap align-top font-bold">
                    <Link to={`/wiki/${a.slug}`} className="wiki-link">{a.title}</Link>
                  </td>
                  <td className="text-sm text-[#202122]">{stripMarkup(a.lead[0]).slice(0, 70)}…</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  )
}
