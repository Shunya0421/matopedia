import { Link } from 'react-router'
import { articles, CATEGORIES, getByCategory } from '@/data/articles'
import { ArrowRight, BookMarked } from 'lucide-react'

export default function MainPage() {
  return (
    <div className="wiki-page">
      <h1 className="wiki-h1">メインページ</h1>
      <p className="wiki-subtitle">まといのば気功技術大百科へようこそ</p>

      <div className="wiki-notice">
        <strong>まといのば気功技術大百科（Matopedia）</strong>は、東京・四ツ谷のバレリーナ専門気功整体
        <Link to="/wiki/matoinoba" className="wiki-link">「まといのば」</Link>
        のブログに散らばる気功技術・バレエ技法・心の理論を、百科事典形式でまとめた非公式ファンサイトです。
        現在 <strong>{articles.length}</strong> 件の記事を収録しています。
        <span className="block mt-1.5 text-[#3366cc]">
          このサイトは有志編集を歓迎しています。各記事の「編集」「技術を追加」ボタンからご参加ください（
          <Link to="/about" className="wiki-link">詳しくはこちら</Link>）。
          承認された投稿は<Link to="/contributions" className="wiki-link">みんなの投稿</Link>に掲載されます。
        </span>
      </div>

      {/* カテゴリ */}
      <section className="wiki-portal mt-5">
        <h2 className="wiki-portal-title flex items-center gap-2">
          <BookMarked size={16} className="text-[#705000]" /> カテゴリから探す
        </h2>
        <ul className="wiki-portal-list">
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link to={`/category/${encodeURIComponent(cat)}`} className="wiki-link font-bold">
                {cat}
              </Link>
              <span className="text-[#54595d] text-xs ml-1">（{getByCategory(cat).length}件）</span>
              <div className="text-xs mt-0.5 leading-relaxed">
                {getByCategory(cat).map((a, i) => (
                  <span key={a.slug}>
                    {i > 0 && <span className="text-[#a2a9b1] mx-1">・</span>}
                    <Link to={`/wiki/${a.slug}`} className="wiki-link">{a.title}</Link>
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 全記事への導線 */}
      <div className="mt-5 text-right">
        <Link to="/index" className="wiki-link inline-flex items-center gap-1 font-bold">
          全 {articles.length} 記事の一覧へ <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
