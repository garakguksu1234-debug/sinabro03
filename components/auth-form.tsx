'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); setError(''); const result = mode === 'sign-up' ? await authClient.signUp.email({ name, email, password }) : await authClient.signIn.email({ email, password }); setBusy(false); if (result.error) setError('이메일 또는 비밀번호를 확인해주세요.'); else { router.push('/'); router.refresh() } }
  return <main className="grid min-h-screen place-items-center bg-background px-5"><form onSubmit={submit} className="w-full max-w-md rounded-[2rem] border border-border bg-card p-7 shadow-sm"><p className="text-xs font-bold tracking-[0.2em] text-violet">SMART SCHEME</p><h1 className="mt-3 text-3xl font-black text-ink">{mode === 'sign-in' ? '오답노트에 로그인' : '학습 계정 만들기'}</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">저장한 오답과 탐구 기록을 계속 열람할 수 있어요.</p>{mode === 'sign-up' && <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" className="mt-6 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none" />}<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none" /><input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 (8자 이상)" className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none" />{error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}<button disabled={busy} className="mt-5 w-full rounded-xl bg-ink px-4 py-3 font-black text-white disabled:opacity-50">{busy ? '처리 중...' : mode === 'sign-in' ? '로그인' : '가입하기'}</button><button type="button" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')} className="mt-4 w-full text-sm font-bold text-violet">{mode === 'sign-in' ? '처음이라면 계정 만들기' : '이미 계정이 있다면 로그인'}</button></form></main>
}
