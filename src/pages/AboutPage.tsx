import { Link } from 'react-router'

export default function AboutPage() {
  return (
    <div className="wiki-page">
      <h1 className="wiki-h1">このサイトについて</h1>
      <p className="wiki-subtitle">サイトポリシーと免責事項</p>

      <h2 className="wiki-h2">目的</h2>
      <p className="wiki-p">
        まといのば気功技術大百科（Matopedia）は、東京・四ツ谷のバレリーナ専門気功整体
        <Link to="/wiki/matoinoba" className="wiki-link">「まといのば」</Link>
        がアメーバブログ等で公開してきた気功技術・バレエ技法・心の理論を、百科事典の形式で横断的に検索できるようにした
        非公式のファン編纂サイトです。ブログ記事が数千件に及び体系的な索引が存在しないため、
        「あの技術、なんて名前だったっけ？」を素早く引けることを目指しています。
      </p>

      <h2 className="wiki-h2">編集方針</h2>
      <p className="wiki-p">
        各記事はブログの公開記事に基づいて執筆され、末尾に出典リンクを明記しています。
        独自の効果断言や、出典のない創作は行いません。解釈を含む場合は「〜とされる」「〜と位置づけられる」という表現を用いています。
      </p>

      <h2 className="wiki-h2">免責事項</h2>
      <p className="wiki-p">
        当サイトは「まといのば」および「Rayまといのば」の公式機関とは一切関係ありません。記載内容の正確性・最新性は保証されません。
        気功・ヒーリング・整体の効果は科学的に実証されたものではなく、当サイトの情報は医療上の助言ではありません。
        施術・講座の最新情報（料金・日程等）は必ず公式ブログ・公式予約フォームで確認してください。
      </p>

      <h2 className="wiki-h2">有志編集について</h2>
      <p className="wiki-p">
        当サイトはWikipediaと同じく、<strong>有志による編集を歓迎</strong>します。誤りの修正・技術の追記・出典の追加などにご協力ください。
      </p>
      <p className="wiki-p">
        編集は<strong>GitHub</strong>を通じて行います（無料アカウントが必要です）。各記事ページの右上にある
        「<strong>編集</strong>」ボタンから記事のソースを直接編集して修正提案（プルリクエスト）を送るか、
        「<strong>修正を提案</strong>」ボタンからIssue（修正提案フォーム）で内容をお知らせください。
        内容は管理者がレビューした上で反映します。
      </p>
      <ul className="wiki-related">
        <li><strong>編集</strong> ― 記事ソース（articles.ts）をGitHub上で直接編集。プルリクエストで提案できます</li>
        <li><strong>修正を提案</strong> ― GitHubの知識がなくても、フォームに書くだけで提案できます</li>
      </ul>
      <p className="wiki-p">
        編集にあたっては、独自の効果断言や出典のない創作は避け、できる限り出典（ブログ記事等）を明記してください。
      </p>

      <h2 className="wiki-h2">公式リンク</h2>
      <ul className="wiki-related">
        <li><a className="wiki-link" href="https://ameblo.jp/matoinoba/" target="_blank" rel="noreferrer">気功師から見たバレエとヒーリングのコツ～「まといのば」ブログ</a></li>
        <li><a className="wiki-link" href="https://ameblo.jp/ray-matoinoba/" target="_blank" rel="noreferrer">四ツ谷のバレリーナ専門気功整体「Rayまといのば」</a></li>
        <li><a className="wiki-link" href="https://matoinoba.themedia.jp/" target="_blank" rel="noreferrer">四ツ谷のバレリーナ専門気功整体「まといのば」ポータルサイト</a></li>
        <li><a className="wiki-link" href="https://nlatdfqsgitl1vy2l2aa.stores.jp/reserve/matoinoba" target="_blank" rel="noreferrer">予約フォーム（STORES）</a></li>
      </ul>
    </div>
  )
}
