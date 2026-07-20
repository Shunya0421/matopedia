import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { trpc } from '@/providers/trpc'
import { CATEGORIES } from '@/data/articles'
import { UserPlus, Send, LogIn, CheckCircle2 } from 'lucide-react'

const TOKEN_KEY = 'matopedia_editor_token'
const NAME_KEY = 'matopedia_editor_name'

function useEditor() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [name, setName] = useState<string | null>(() => localStorage.getItem(NAME_KEY))
  const login = (t: string, n: string) => {
    localStorage.setItem(TOKEN_KEY, t)
    localStorage.setItem(NAME_KEY, n)
    setToken(t); setName(n)
  }
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(NAME_KEY)
    setToken(null); setName(null)
  }
  return { token, name, login, logout }
}

function RegisterForm({ onDone }: { onDone: (t: string, n: string) => void }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [msg, setMsg] = useState('')
  const register = trpc.wiki.register.useMutation()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setMsg('')
    try {
      const res = await register.mutateAsync({ email, name, inviteCode })
      if (res.status === 'approved' && res.token) {
        onDone(res.token, name)
      } else if (res.status === 'pending') {
        setMsg('登録済みです。承認をお待ちください。')
      } else {
        setMsg('登録できませんでした。')
      }
    } catch (err: any) {
      setMsg(err.message ?? 'エラーが発生しました')
    }
  }

  return (
    <form onSubmit={submit} className="wiki-form">
      <h2 className="wiki-h2 flex items-center gap-2"><UserPlus size={18} /> 編集者として登録</h2>
      <label className="wiki-form-label">氏名（ペンネーム可）
        <input className="wiki-form-input" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label className="wiki-form-label">メールアドレス
        <input className="wiki-form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="wiki-form-label">招待コード
        <input className="wiki-form-input" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} required placeholder="管理者から入手してください" />
      </label>
      <button className="wiki-form-btn" disabled={register.isPending}>
        {register.isPending ? '登録中…' : '登録する'}
      </button>
      {msg && <p className="wiki-form-msg">{msg}</p>}
    </form>
  )
}

function LoginForm({ onDone }: { onDone: (t: string, n: string) => void }) {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const login = trpc.wiki.login.useMutation()
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setMsg('')
    try {
      const res = await login.mutateAsync({ email })
      onDone(res.token, res.name)
    } catch (err: any) {
      setMsg(err.message ?? 'エラーが発生しました')
    }
  }
  return (
    <form onSubmit={submit} className="wiki-form">
      <h2 className="wiki-h2 flex items-center gap-2"><LogIn size={18} /> 登録済みの方</h2>
      <label className="wiki-form-label">メールアドレス
        <input className="wiki-form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <button className="wiki-form-btn" disabled={login.isPending}>
        {login.isPending ? '確認中…' : 'ログイン'}
      </button>
      {msg && <p className="wiki-form-msg">{msg}</p>}
    </form>
  )
}

function ContributeForm({ token, name }: { token: string; name: string }) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[1])
  const [reading, setReading] = useState('')
  const [lead, setLead] = useState('')
  const [body, setBody] = useState('')
  const [sources, setSources] = useState('')
  const [done, setDone] = useState(false)
  const [msg, setMsg] = useState('')
  const contribute = trpc.wiki.contribute.useMutation()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setMsg('')
    try {
      await contribute.mutateAsync({ token, title, category, reading, lead, body, sources })
      setDone(true)
      setTitle(''); setReading(''); setLead(''); setBody(''); setSources('')
    } catch (err: any) {
      setMsg(err.message ?? 'エラーが発生しました')
    }
  }

  return (
    <form onSubmit={submit} className="wiki-form">
      <div className="wiki-notice mb-4">
        <CheckCircle2 size={15} className="inline mr-1 text-green-700" />
        <strong>{name}</strong> さんとしてログイン中。新しい気功技術の記事を投稿できます（管理者の承認後に公開されます）。
      </div>
      <h2 className="wiki-h2">新しい技術を追加</h2>
      <label className="wiki-form-label">技術名（記事タイトル）
        <input className="wiki-form-input" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="例：○○（気功技術）" />
      </label>
      <label className="wiki-form-label">読み・副題（任意）
        <input className="wiki-form-input" value={reading} onChange={(e) => setReading(e.target.value)} />
      </label>
      <label className="wiki-form-label">カテゴリ
        <select className="wiki-form-input" value={category} onChange={(e) => setCategory(e.target.value as any)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label className="wiki-form-label">導入部（概要）＊必須
        <textarea className="wiki-form-input" rows={4} value={lead} onChange={(e) => setLead(e.target.value)} required placeholder="この技術が何かを2〜4文で" />
      </label>
      <label className="wiki-form-label">本文（任意）
        <textarea className="wiki-form-input" rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="手順・原理・体験談など。セクションは「== 見出し ==」で区切れます" />
      </label>
      <label className="wiki-form-label">出典（任意・1行に1件）
        <textarea className="wiki-form-input" rows={3} value={sources} onChange={(e) => setSources(e.target.value)} placeholder={'記事タイトル（URL）\n例：手を重ねることから始めよう！（https://ameblo.jp/...）'} />
      </label>
      <button className="wiki-form-btn" disabled={contribute.isPending}>
        <Send size={14} className="inline mr-1" />
        {contribute.isPending ? '送信中…' : '投稿する（承認後に公開）'}
      </button>
      {msg && <p className="wiki-form-msg">{msg}</p>}
      {done && <p className="wiki-form-msg text-green-700">投稿を受け付けました。管理者の承認後に公開されます。</p>}
    </form>
  )
}

export default function EditorPage() {
  const { token, name, login, logout } = useEditor()
  return (
    <div className="wiki-page">
      <h1 className="wiki-h1">編集に参加する</h1>
      <p className="wiki-subtitle">有志による気功技術の追加・編集</p>
      <p className="wiki-p">
        メールアドレスと氏名を登録し、招待コードを入力すると、新しい気功技術の記事を投稿できます。
        投稿は管理者が承認した後に公開されます。<Link to="/about" className="wiki-link">編集方針はこちら</Link>。
      </p>
      {token && name ? (
        <>
          <ContributeForm token={token} name={name} />
          <button onClick={logout} className="text-sm text-[#54595d] underline mt-4">ログアウト</button>
        </>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <RegisterForm onDone={login} />
          <LoginForm onDone={login} />
        </div>
      )}
    </div>
  )
}
