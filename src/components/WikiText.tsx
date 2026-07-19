import { Link } from 'react-router'
import { getArticle } from '@/data/articles'

// [[slug]] または [[slug|表示テキスト]] を内部リンクに変換するレンダラ
export function WikiText({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g)
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/)
        if (!m) return <span key={i}>{part}</span>
        const slug = m[1]
        const label = m[2] ?? getArticle(slug)?.title ?? slug
        const exists = !!getArticle(slug)
        if (!exists) {
          return (
            <span key={i} className="wiki-redlink" title="存在しないページ">
              {label}
            </span>
          )
        }
        return (
          <Link key={i} to={`/wiki/${slug}`} className="wiki-link" title={getArticle(slug)?.title}>
            {label}
          </Link>
        )
      })}
    </>
  )
}

export function WikiPara({ text }: { text: string }) {
  return (
    <p className="wiki-p">
      <WikiText text={text} />
    </p>
  )
}
