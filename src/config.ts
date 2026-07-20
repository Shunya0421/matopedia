// サイト設定
// 有志編集（GitHub連携）用のリポジトリ情報。
// GitHubにリポジトリを作ったら、以下2つを自分のものに書き換えてください。
export const SITE_CONFIG = {
  // GitHubリポジトリ（例: "yourname/matopedia"）
  githubRepo: 'your-github-username/matopedia',
  // 記事データのファイルパス
  articlesFilePath: 'src/data/articles.ts',
  // ブランチ
  branch: 'main',
}

// GitHub編集URLを生成
export function githubEditUrl(): string {
  const { githubRepo, articlesFilePath, branch } = SITE_CONFIG
  return `https://github.com/${githubRepo}/edit/${branch}/${articlesFilePath}`
}

// GitHub新規Issue（修正提案）URLを生成
export function githubIssueUrl(articleTitle: string, slug: string): string {
  const { githubRepo } = SITE_CONFIG
  const title = encodeURIComponent(`【修正提案】${articleTitle}`)
  const body = encodeURIComponent(
    `記事「${articleTitle}」（slug: ${slug}）への修正提案です。\n\n## 修正内容\n\n\n## 出典・根拠\n\n`
  )
  return `https://github.com/${githubRepo}/issues/new?title=${title}&body=${body}`
}
