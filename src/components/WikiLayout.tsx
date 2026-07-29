import { useState, type ReactNode, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { Search, Shuffle, Menu, X, ExternalLink } from 'lucide-react'
import { articles } from '@/data/articles'

function SearchBox({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }
  return (
    <form onSubmit={onSubmit} className={`flex gap-1 ${compact ? 'w-full' : 'w-full'}`}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="大百科を検索"
        className="wiki-search-input"
        aria-label="検索"
      />
      <button type="submit" className="wiki-search-btn" aria-label="検索">
        <Search size={15} />
      </button>
    </form>
  )
}

export default function WikiLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const goToRandomArticle = () => {
    const slug = articles[Math.floor(Math.random() * articles.length)].slug
    navigate(`/wiki/${slug}`)
  }

  const nav = (
    <>
      <div className="wiki-side-box">
        <div className="wiki-side-title">ナビゲーション</div>
        <ul className="wiki-side-list">
          <li><NavLink to="/" end>メインページ</NavLink></li>
          <li><NavLink to="/index">技術一覧（全記事）</NavLink></li>
          <li><NavLink to="/categories">カテゴリ一覧</NavLink></li>
          <li><NavLink to="/about">このサイトについて</NavLink></li>
        </ul>
      </div>
      <div className="wiki-side-box">
        <div className="wiki-side-title">検索</div>
        <SearchBox compact />
      </div>
      <div className="wiki-side-box">
        <div className="wiki-side-title">参加する</div>
        <ul className="wiki-side-list">
          <li>
            <Link to="/edit" className="inline-flex items-center gap-1 font-bold">
              編集に参加する
            </Link>
          </li>
          <li>
            <NavLink to="/contributions">みんなの投稿</NavLink>
          </li>
          <li>
            <button
              type="button"
              onClick={goToRandomArticle}
              className="inline-flex items-center gap-1 text-[#3366cc] hover:underline"
            >
              <Shuffle size={13} /> おまかせ表示
            </button>
          </li>
        </ul>
      </div>
      <div className="wiki-side-box">
        <div className="wiki-side-title">出典・外部リンク</div>
        <ul className="wiki-side-list">
          <li>
            <a href="https://ameblo.jp/matoinoba/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
              本家ブログ（アメブロ）<ExternalLink size={11} />
            </a>
          </li>
          <li>
            <a href="https://ameblo.jp/ray-matoinoba/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
              Rayまといのば（アメブロ）<ExternalLink size={11} />
            </a>
          </li>

        </ul>
      </div>
    </>
  )

  return (
    <div className="wiki-root">
      {/* ヘッダ */}
      <header className="wiki-header">
        <div className="wiki-header-inner">
          <Link to="/" className="flex items-center gap-2.5 min-w-0">
            <span className="wiki-logo" aria-hidden>気</span>
            <span className="leading-tight">
              <span className="wiki-sitename">まといのば気功技術大百科</span>
              <span className="wiki-sitetag">Matopedia － 気功技術のファン百科事典</span>
            </span>
          </Link>
          <div className="hidden md:block w-72">
            <SearchBox />
          </div>
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="メニュー"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <div className="wiki-body">
        {/* サイドバー */}
        <aside className="wiki-sidebar hidden md:block">{nav}</aside>
        {menuOpen && (
          <div className="md:hidden w-full border-b border-[#a2a9b1] bg-white p-3">{nav}</div>
        )}

        {/* 本文 */}
        <main className="wiki-main">{children}</main>
      </div>

      <footer className="wiki-footer">
        <p className="mt-2 text-[#72777d]">まといのば気功技術大百科（Matopedia） － 全 {articles.length} 記事</p>
      </footer>
    </div>
  )
}
