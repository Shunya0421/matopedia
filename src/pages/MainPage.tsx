import { Link } from 'react-router'
import { articles, CATEGORIES, getByCategory, stripMarkup } from '@/data/articles'
import { ArrowRight, BookMarked, Sparkles } from 'lucide-react'

const FEATURED = ['matoinoba', 'training-chain', 'kaikyaku', 'pk-operation', 'abstract-elevator', 'psi', 'spoon-bending', 'daikei-model']

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
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-5">
        {/* 注目の記事 */}
        <section className="wiki-portal">
          <h2 className="wiki-portal-title flex items-center gap-2">
            <Sparkles size={16} className="text-[#705000]" /> 秀逸な記事
          </h2>
          <ul className="wiki-portal-list">
            {FEATURED.map((slug) => {
              const a = articles.find((x) => x.slug === slug)!
              return (
                <li key={slug}>
                  <Link to={`/wiki/${a.slug}`} className="wiki-link font-bold">{a.title}</Link>
                  <span className="text-[#54595d] text-sm"> ― {stripMarkup(a.lead[0]).slice(0, 46)}…</span>
                </li>
              )
            })}
          </ul>
        </section>

        {/* カテゴリ */}
        <section className="wiki-portal">
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
      </div>

      {/* 数字で見る */}
      <section className="wiki-portal mt-4">
        <h2 className="wiki-portal-title">数字で見る「まといのば」</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {[
            { n: '2011年', d: 'アメブロ開設・スプーン曲げシリーズ開始' },
            { n: '2017年', d: 'MBA（まといのばバレエアカデミー）開校' },
            { n: '3,000件超', d: 'ブログ記事数（テーマ別合計）' },
            { n: '2026年', d: 'シン・気功Club 発足' },
          ].map((s) => (
            <div key={s.n} className="wiki-stat">
              <div className="wiki-stat-n">{s.n}</div>
              <div className="wiki-stat-d">{s.d}</div>
            </div>
          ))}
        </div>
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
