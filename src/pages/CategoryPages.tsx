import { Link, useParams, useSearchParams } from 'react-router'
import { CATEGORIES, getByCategory, searchArticles, stripMarkup, type Category } from '@/data/articles'

export function CategoryListPage() {
  return (
    <div className="wiki-page">
      <h1 className="wiki-h1">カテゴリ一覧</h1>
      <p className="wiki-subtitle">記事の分類</p>
      <ul className="wiki-related mt-4">
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <Link to={`/category/${encodeURIComponent(cat)}`} className="wiki-link font-bold">{cat}</Link>
            <span className="text-[#54595d] text-sm">（{getByCategory(cat).length} 件）</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CategoryPage() {
  const { name } = useParams()
  const cat = decodeURIComponent(name ?? '') as Category
  const list = getByCategory(cat)

  return (
    <div className="wiki-page">
      <h1 className="wiki-h1">カテゴリ: {cat}</h1>
      <p className="wiki-subtitle">{list.length} 件の記事</p>
      {list.length === 0 ? (
        <p className="wiki-p">このカテゴリに属する記事はありません。</p>
      ) : (
        <ul className="wiki-related mt-4">
          {list.map((a) => (
            <li key={a.slug}>
              <Link to={`/wiki/${a.slug}`} className="wiki-link font-bold">{a.title}</Link>
              {a.reading && <span className="text-[#54595d] text-sm">（{a.reading}）</span>}
              <div className="text-sm text-[#54595d]">{stripMarkup(a.lead[0]).slice(0, 60)}…</div>
            </li>
          ))}
        </ul>
      )}
      <div className="wiki-catbar">
        <Link to="/categories" className="wiki-link">カテゴリ一覧へ</Link>
      </div>
    </div>
  )
}

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const results = searchArticles(query)

  return (
    <div className="wiki-page">
      <h1 className="wiki-h1">検索結果</h1>
      <p className="wiki-subtitle">
        「{query}」の検索結果：{results.length} 件
      </p>
      {results.length === 0 ? (
        <p className="wiki-p">
          該当する記事が見つかりませんでした。キーワードを変えてお試しください（例：開脚、スプーン、変性意識、舌骨）。
        </p>
      ) : (
        <ul className="wiki-related mt-4">
          {results.map((a) => (
            <li key={a.slug}>
              <Link to={`/wiki/${a.slug}`} className="wiki-link font-bold">{a.title}</Link>
              <span className="text-[#54595d] text-sm">（{a.category}）</span>
              <div className="text-sm text-[#54595d]">{stripMarkup(a.lead[0]).slice(0, 80)}…</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
