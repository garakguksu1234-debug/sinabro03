'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Camera,
  Check,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  Gamepad2,
  Lightbulb,
  Mic,
  Music2,
  Play,
  RotateCcw,
  ScanLine,
  Send,
  Sparkles,
  Trophy,
  Upload,
  Volume2,
  X,
  Zap,
  Calculator,
  Target,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getMistakeNotes, saveMistakeNote } from '@/app/actions/notes'

type Step = 'onboarding' | 'scan' | 'workspace' | 'mistakes'

const interests = [
  { id: 'sports', label: '스포츠', detail: '축구공의 수평운동이 궁금해요', icon: Trophy, color: 'sky' },
  { id: 'games', label: '게임', detail: '게임 속 힘과 가속도를 파헤쳐요', icon: Gamepad2, color: 'violet' },
  { id: 'music', label: '음악', detail: '진동과 힘의 원리를 알아봐요', icon: Music2, color: 'pink' },
]

const chatPrompts = ['차는 힘이 커지면 가속도는 어떻게 돼?', '축구공 질량과 가속도의 관계를 설명해줘', '수평으로 공을 차는 예시가 궁금해']

export default function SmartSchemeApp() {
  const [step, setStep] = useState<Step>('onboarding')
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('중학교 2학년')
  const [subject, setSubject] = useState<'science' | 'math'>('science')
  const [selectedInterest, setSelectedInterest] = useState('sports')
  const [toast, setToast] = useState('')

  const advance = () => {
    if (step === 'onboarding') {
      if (!name.trim()) {
        setToast('이름을 알려주면 더 다정하게 설명해줄게요.')
        return
      }
      setStep('scan')
    } else if (step === 'scan') setStep('workspace')
  }

  const goBack = () => {
    if (step === 'scan') setStep('onboarding')
    if (step === 'workspace') setStep('scan')
    if (step === 'mistakes') setStep('workspace')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <TopBar step={step} onMistakes={() => setStep('mistakes')} />
      {step === 'onboarding' && (
        <Onboarding name={name} setName={setName} grade={grade} setGrade={setGrade} subject={subject} setSubject={setSubject} selected={selectedInterest} setSelected={setSelectedInterest} onNext={advance} />
      )}
      {step === 'scan' && <ScanStep subject={subject} selectedInterest={selectedInterest} onBack={goBack} onNext={advance} />}
      {step === 'workspace' && <Workspace subject={subject} selectedInterest={selectedInterest} onBack={goBack} onMistakes={() => setStep('mistakes')} />}
      {step === 'mistakes' && <Mistakes subject={subject} onBack={goBack} onReplay={() => setStep('workspace')} />}
      {toast && <div role="status" className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-xl"><CircleHelp className="size-4 text-sky" />{toast}<button onClick={() => setToast('')} aria-label="닫기"><X className="size-4" /></button></div>}
    </main>
  )
}

function TopBar({ step, onMistakes }: { step: Step; onMistakes: () => void }) {
  return <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
    <button className="flex items-center gap-3" onClick={onMistakes} aria-label="Smart Scheme 홈">
      <span className="grid size-10 place-items-center rounded-2xl bg-ink text-sky shadow-sm"><BrainCircuit className="size-5" /></span>
      <span className="font-mono text-sm font-bold tracking-tight text-ink">SMART SCHEME</span>
    </button>
    <div className="hidden items-center gap-2 text-xs font-bold text-muted-foreground sm:flex"><span className={step === 'onboarding' ? 'text-ink' : ''}>01 시작</span><span className="text-border">/</span><span className={step === 'scan' ? 'text-ink' : ''}>02 스캔</span><span className="text-border">/</span><span className={step === 'workspace' ? 'text-ink' : ''}>03 탐구</span></div>
    <button onClick={onMistakes} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold text-ink transition hover:-translate-y-0.5 hover:shadow-sm"><BookOpen className="size-4 text-violet" />오답노트</button>
  </header>
}

function Onboarding({ name, setName, grade, setGrade, subject, setSubject, selected, setSelected, onNext }: { name: string; setName: (v: string) => void; grade: string; setGrade: (v: string) => void; subject: 'science' | 'math'; setSubject: (v: 'science' | 'math') => void; selected: string; setSelected: (v: string) => void; onNext: () => void }) {
  return <section className="mx-auto flex max-w-7xl flex-col gap-10 px-5 pb-16 pt-10 lg:flex-row lg:items-center lg:gap-24 lg:px-8 lg:pt-16">
    <div className="max-w-xl flex-1"><p className="mb-5 inline-flex items-center gap-2 rounded-full bg-sky-soft px-3 py-1.5 text-xs font-bold text-sky-strong"><Sparkles className="size-3.5" />나만의 {subject === 'math' ? '수학' : '과학'} 탐구 파트너</p><h1 className="text-balance text-5xl font-black leading-[1.08] tracking-[-0.06em] text-ink sm:text-7xl">{subject === 'math' ? '수학이' : '과학이'}<br /><span className="text-sky-strong">재미있어지는</span><br />순간.</h1><p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">틀려도 괜찮아요. 여러분의 관심사에서 시작해<br className="hidden sm:block" /> 개념을 함께 발견해봐요.</p><div className="mt-10 flex items-center gap-3 text-xs font-bold text-muted-foreground"><span className="grid size-8 place-items-center rounded-full bg-ink text-white">1</span><span className="h-px w-8 bg-border" /><span className="text-ink">나를 알려주기</span><span className="h-px w-8 bg-border" /><span>탐구 시작</span></div></div>
    <div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-6 shadow-[0_24px_70px_-40px_rgba(27,43,75,0.35)] sm:p-8"><div className="mb-8 flex items-center justify-between"><div><p className="text-xs font-bold text-sky-strong">STEP 01</p><h2 className="mt-2 text-2xl font-black tracking-tight text-ink">반가워요, 탐구자!</h2></div><div className="grid size-12 place-items-center rounded-2xl bg-lavender text-violet"><Lightbulb className="size-6" /></div></div><label className="flex flex-col gap-2 text-sm font-bold text-ink">이름이 뭐예요?<input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 민준" className="h-12 rounded-xl border border-border bg-background px-4 font-normal outline-none transition placeholder:text-muted-foreground focus:border-sky focus:ring-4 focus:ring-sky/10" /></label><label className="mt-5 flex flex-col gap-2 text-sm font-bold text-ink">지금 몇 학년이에요?<select value={grade} onChange={(e) => setGrade(e.target.value)} className="h-12 rounded-xl border border-border bg-background px-4 font-normal outline-none focus:border-sky"><option>중학교 1학년</option><option>중학교 2학년</option><option>중학교 3학년</option><option>고등학교 1학년</option></select></label><div className="mt-7"><p className="mb-3 text-sm font-bold text-ink">무엇을 공부할까요?</p><div className="grid grid-cols-2 gap-2"><button onClick={() => setSubject('science')} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${subject === 'science' ? 'border-sky bg-sky-soft text-sky-strong' : 'border-border bg-background text-muted-foreground'}`}><FlaskConical className="size-4" />과학 · F = ma</button><button onClick={() => setSubject('math')} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition ${subject === 'math' ? 'border-violet bg-violet-soft text-violet' : 'border-border bg-background text-muted-foreground'}`}><Calculator className="size-4" />수학 · 2차함수</button></div></div><div className="mt-7"><p className="mb-3 text-sm font-bold text-ink">무엇을 좋아해요?</p><div className="grid grid-cols-3 gap-2">{interests.map((item) => { const Icon = item.icon; const active = selected === item.id; return <button key={item.id} onClick={() => setSelected(item.id)} className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border text-xs font-bold transition ${active ? 'border-sky bg-sky-soft text-sky-strong shadow-sm' : 'border-border bg-background text-muted-foreground hover:border-sky/50'}`}><Icon className="size-5" />{item.label}</button> })}</div></div><Button onClick={onNext} className="mt-8 h-12 w-full rounded-xl bg-ink text-white hover:bg-ink/90">탐구 시작하기<ArrowRight data-icon="inline-end" /></Button></div>
  </section>
}

function ScanStep({ subject, selectedInterest, onBack, onNext }: { subject: 'science' | 'math'; selectedInterest: string; onBack: () => void; onNext: () => void }) {
  const [scanning, setScanning] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const startScan = () => { setScanning(true); setTimeout(() => setScanning(false), 1200) }
  return <section className="mx-auto max-w-4xl px-5 pb-16 pt-10 lg:px-8 lg:pt-20">{photoUrl && <div className="mx-auto mb-5 max-w-2xl overflow-hidden rounded-2xl border border-border bg-card"><img src={photoUrl} alt={photo?.name ?? '수평운동 문제.jpg'} className="max-h-72 w-full object-contain" /><div className="p-3 text-left"><p className="truncate text-sm font-bold text-ink">{photo?.name}</p><p className="text-xs text-muted-foreground">{photo ? `${(photo.size / 1024 / 1024).toFixed(2)} MB` : '사진 미리보기'}</p></div></div>}<button onClick={onBack} className="mb-10 flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-ink"><ArrowLeft className="size-4" />이전으로</button><div className="text-center"><p className="text-xs font-bold tracking-[0.2em] text-sky-strong">STEP 02 · 문제 가져오기</p><h1 className="mt-4 text-4xl font-black tracking-[-0.05em] text-ink sm:text-6xl">해결이 어려운 문제를<br /><span className="text-violet">업로드해 주세요!</span></h1><p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-muted-foreground">사진을 올리면 {subject === 'math' ? '이차함수와 포물선' : '힘과 질량, 가속도'} 개념을 찾아서<br />나만의 {subject === 'math' ? '수학' : '과학'} 탐구 미션으로 바꿔드려요.</p></div><div className="mx-auto mt-12 max-w-2xl rounded-[2rem] border-2 border-dashed border-sky/40 bg-sky-soft/40 p-6 sm:p-10"><div className="flex min-h-64 flex-col items-center justify-center rounded-[1.5rem] bg-card px-5 text-center shadow-sm"><div className="grid size-16 place-items-center rounded-3xl bg-lavender text-violet"><ScanLine className="size-8" /></div><h2 className="mt-5 text-xl font-black text-ink">문제 사진을 업로드해 주세요</h2><p className="mt-2 text-sm text-muted-foreground">JPG, PNG 파일 · 최대 10MB</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Button onClick={() => fileRef.current?.click()} variant="outline" className="rounded-xl bg-card"><Upload data-icon="inline-start" />사진 선택</Button><Button onClick={() => setUploaded(true)} variant="outline" className="rounded-xl bg-card"><Camera data-icon="inline-start" />카메라로 찍기</Button><input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setPhoto(file); setPhotoUrl(URL.createObjectURL(file)); setUploaded(true) } }} /></div>{uploaded && <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-xs font-bold text-success"><Check className="size-3.5" />문제 사진이 준비됐어요</p>}</div></div>{uploaded && <div className="mx-auto mt-5 flex max-w-2xl items-center justify-between rounded-2xl border border-border bg-card p-4"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-xl bg-sky-soft text-sky-strong"><FlaskConical className="size-5" /></div><div><p className="text-sm font-bold text-ink">포물선 운동 문제.jpg</p><p className="text-xs text-muted-foreground">분석 준비 완료</p></div></div><Button onClick={startScan} disabled={scanning} className="rounded-xl bg-ink text-white">{scanning ? '분석 중...' : '문제 분석하기'}<Zap data-icon="inline-end" /></Button></div>}{!uploaded && <button onClick={() => setUploaded(true)} className="mx-auto mt-6 block text-sm font-bold text-sky-strong underline underline-offset-4">샘플 문제로 먼저 둘러보기</button>}{uploaded && !scanning && <Button onClick={onNext} className="mx-auto mt-8 flex rounded-xl bg-violet text-white hover:bg-violet/90">탐구 워크스페이스 열기<ChevronRight data-icon="inline-end" /></Button>}</section>
}

function FootballField({ acceleration, mass, force, playing, onComplete }: { acceleration: number; mass: number; force: number; playing: boolean; onComplete: () => void }) {
  const [position, setPosition] = useState(10)
  const velocity = useRef(0)
  const previous = useRef<number | null>(null)
  useEffect(() => {
    if (!playing) { previous.current = null; velocity.current = 0; setPosition(10); return }
    let frame = 0
    const tick = (time: number) => {
      if (previous.current === null) previous.current = time
      const delta = Math.min(time - previous.current, 40)
      previous.current = time
      const seconds = delta / 1000
      const physicsAcceleration = Math.max(0.25, Math.min(acceleration, 400) / 35)
      velocity.current += physicsAcceleration * seconds
      setPosition((value) => {
        const next = value + velocity.current * seconds * 5.6
        if (next >= 88) { onComplete(); return 88 }
        return next
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [acceleration, playing, onComplete])
  return <div className="mt-5 overflow-hidden rounded-2xl border-4 border-sky-strong/20 bg-[#55a85a] p-3 shadow-inner"><svg viewBox="0 0 600 300" className="w-full" role="img" aria-label={`가속도 ${acceleration.toFixed(1)} 미터 매 초 제곱으로 수평 이동하는 축구공`}><rect x="8" y="8" width="584" height="284" rx="12" fill="#55a85a" stroke="#e7f8e8" strokeWidth="4" /><path d="M20 150H580 M300 12V288" stroke="#e7f8e8" strokeWidth="3" opacity=".8" /><circle cx="300" cy="150" r="45" fill="none" stroke="#e7f8e8" strokeWidth="3" opacity=".8" /><rect x="520" y="92" width="62" height="116" fill="none" stroke="#fff" strokeWidth="5" /><path d="M520 103L580 113M520 197L580 187" stroke="#d8f1da" strokeWidth="2" /><path d={`M${position * 5.4 + 30} 150H${Math.min(position * 5.4 + 110, 500)}`} stroke="#fff" strokeWidth="5" strokeDasharray="8 9" opacity=".8" /><ellipse cx={position * 5.4 + 30} cy="181" rx={24 + mass * 12} ry="7" fill="#1f6335" opacity=".35" /><g transform={`translate(${position * 5.4 + 30} 150) scale(${1 + mass * 0.22})`}><circle r="20" fill="#fff" stroke="#1b2b4b" strokeWidth="4" /><path d="M0 -8L8 -3 5 7H-5L-8 -3Z" fill="#1b2b4b" /><path d="M0 -8L0 -18M8 -3L17 -9M5 7L11 16M-5 7L-11 16M-8 -3L-17 -9" fill="none" stroke="#1b2b4b" strokeWidth="3" strokeLinecap="round" /></g><text x="24" y="38" fill="#fff" fontSize="16" fontWeight="700">수평방향 운동</text><text x="24" y="62" fill="#fff" fontSize="13">F = ma · a = F / m</text></svg><div className="flex items-center justify-between px-2 pt-2 text-xs font-bold text-white"><span>{playing ? '���이 골대 방향으로 가속 중' : '공차기 버튼을 눌러 시작'}</span><span>골대까지 {Math.max(0, Math.round(100 - position))}%</span></div></div>
}

function GameField({ mass, acceleration, playing, resetToken, onComplete }: { mass: number; acceleration: number; playing: boolean; resetToken: number; onComplete: () => void }) {
  const [position, setPosition] = useState(12)
  const [health, setHealth] = useState(100)
  const previous = useRef<number | null>(null)
  useEffect(() => { setHealth(100); setPosition(12) }, [resetToken])
  useEffect(() => {
    if (!playing) { previous.current = null; setPosition(12); return }
    let frame = 0
    const tick = (time: number) => {
      if (previous.current === null) previous.current = time
      const seconds = Math.min(time - previous.current, 40) / 1000
      previous.current = time
      setPosition((value) => {
        const next = value + Math.max(0.4, acceleration * 0.018) * seconds * 10
        if (next >= 82) { setHealth((current) => Math.max(0, current - Math.round(mass * acceleration * 0.18))); onComplete(); return 82 }
        return next
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [acceleration, mass, playing, onComplete])
  const damage = Math.round(mass * acceleration * 0.18)
  return <div className="mt-5 overflow-hidden rounded-2xl border-4 border-violet/20 bg-[#20254d] p-3 shadow-inner"><svg viewBox="0 0 600 300" className="w-full" role="img" aria-label={`질량 ${mass.toFixed(2)} 킬로그램, 가속도 ${acceleration.toFixed(1)}로 슬라임을 공격하는 게임`}><rect x="8" y="8" width="584" height="284" rx="12" fill="#20254d" stroke="#8d7cf0" strokeWidth="4" /><path d="M20 250H580" stroke="#6f78bf" strokeWidth="3" strokeDasharray="10 12" /><text x="24" y="38" fill="#fff" fontSize="16" fontWeight="700">F = ma BATTLE</text><text x="24" y="62" fill="#bfc8ff" fontSize="13">총알 대미지 = 질량 × 가속도</text><path d={`M${position * 5.6 + 35} 150H${Math.min(position * 5.6 + 110, 490)}`} stroke="#f7c948" strokeWidth="4" strokeDasharray="8 9" opacity=".8" />{playing && <g stroke="#f7c948" strokeLinecap="round" opacity=".9"><path d={`M${position * 5.6 + 12} 140H${position * 5.6 - 38}`} strokeWidth="4" /><path d={`M${position * 5.6 + 5} 150H${position * 5.6 - 58}`} strokeWidth="3" /><path d={`M${position * 5.6 + 12} 160H${position * 5.6 - 38}`} strokeWidth="4" /></g>}<g transform="translate(42 150)"><path d="M-20-12H30L43-5V5L30 12H-20Z" fill="#aeb8d8" stroke="#fff" strokeWidth="3" /><path d="M-20-8H8V8H-20Z" fill="#58638e" /><path d="M-4 12H16L23 40H-1Z" fill="#737da8" stroke="#fff" strokeWidth="3" /><path d="M30-5H48" stroke="#f7c948" strokeWidth="5" strokeLinecap="round" /></g><circle cx={position * 5.6 + 35} cy="150" r="16" fill="#f7c948" opacity=".18" /><circle cx={position * 5.6 + 35} cy="150" r="10" fill="#f7c948" stroke="#fff" strokeWidth="2" /><path d={`M${position * 5.6 + 35} 140l20 10-20 10z`} fill="#fff" /><g transform="translate(510 164)"><path d="M-32 24C-42-2-28-28 0-30 28-28 42-2 32 24Z" fill="#7bdc9b" stroke="#c5f5cf" strokeWidth="4" /><circle cx="-11" cy="-2" r="4" fill="#20254d" /><circle cx="11" cy="-2" r="4" fill="#20254d" /><path d="M-11 12Q0 20 11 12" fill="none" stroke="#20254d" strokeWidth="3" /><text x="-34" y="58" fill="#fff" fontSize="13">SLIME</text></g></svg><div className="flex items-center justify-between px-2 pt-2 text-xs font-bold text-white"><span>{playing ? '총알이 날아가는 중' : '발사 버튼을 눌러 한 발 발사'}</span><span>슬라임 HP {health}% · 이번 대미지 {damage}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20" aria-label={`슬라임 체력 ${health}%`}><div className="h-full rounded-full bg-emerald-300 transition-[width] duration-300" style={{ width: `${health}%` }} /></div></div>
}

function MusicField({ mass, acceleration, playing, onPlay }: { mass: number; acceleration: number; playing: boolean; onPlay: () => void }) {
  const volume = Math.min(1, 0.12 + mass * acceleration / 150)
  const bars = Array.from({ length: 18 }, (_, index) => 18 + Math.round(volume * 58 * (0.55 + Math.sin(index * 1.8) * 0.35)) )
  const playSound = () => {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      const context = new AudioContextClass()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'triangle'
      oscillator.frequency.value = 180 + acceleration * 3
      gain.gain.setValueAtTime(Math.min(0.45, volume), context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.45)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.45)
      oscillator.addEventListener('ended', () => void context.close())
    }
    onPlay()
  }
  return <div className="mt-5 overflow-hidden rounded-2xl border-4 border-sky-strong/20 bg-[#172d3b] p-4 shadow-inner"><div className="relative flex h-56 items-center justify-center overflow-hidden rounded-xl bg-[#1f4552] px-5"><svg viewBox="0 0 600 240" className="h-full w-full" role="img" aria-label={`드럼을 드림스틱으로 내려치는 모습, 소리 크기 ${Math.round(volume * 100)}퍼센트`}><ellipse cx="300" cy={playing ? 166 : 160} rx="132" ry="45" fill="#d64e62" stroke="#f8c6ce" strokeWidth="5" /><ellipse cx="300" cy={playing ? 158 : 152} rx="113" ry="32" fill="#f4e3cc" stroke="#8b4050" strokeWidth="4" /><path d="M190 158V205Q300 238 410 205V158" fill="#b84155" stroke="#f8c6ce" strokeWidth="5" /><path d="M218 207L190 234M382 207L410 234" stroke="#f8c6ce" strokeWidth="7" strokeLinecap="round" /><g transform={`translate(240 ${playing ? 80 : 38}) rotate(${playing ? 18 : -24})`}><rect x="-8" y="-5" width="16" height="118" rx="8" fill="#c99465" stroke="#fff" strokeWidth="3" /><circle cx="0" cy="-6" r="12" fill="#e9bd83" /></g><g transform={`translate(360 ${playing ? 80 : 38}) rotate(${playing ? -18 : 24})`}><rect x="-8" y="-5" width="16" height="118" rx="8" fill="#c99465" stroke="#fff" strokeWidth="3" /><circle cx="0" cy="-6" r="12" fill="#e9bd83" /></g>{playing && <><circle cx="300" cy="155" r="58" fill="none" stroke="#7dd8ee" strokeWidth="5" opacity=".65" /><path d="M196 122Q300 84 404 122M206 108Q300 62 394 108" fill="none" stroke="#7dd8ee" strokeWidth="4" strokeDasharray="9 9" /></>}</svg><div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#172d3b]/85 px-3 py-1 text-xs font-bold text-white">{playing ? '쿵! 드럼을 내려쳤어요' : '드림스틱을 눌러 연주'}</div></div><div className="mt-4 flex h-16 items-center justify-center gap-2" aria-label={`드림스틱 소리 크기 ${Math.round(volume * 100)}퍼센트`}>{bars.map((height, index) => <span key={index} className="w-2 rounded-full bg-sky-strong transition-all duration-300" style={{ height: `${playing ? height : Math.max(8, height * 0.35)}px` }} />)}</div><div className="flex items-center justify-between text-xs font-bold text-white"><span>드림스틱 소리 크기</span><span>{Math.round(volume * 100)}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20"><div className="h-full rounded-full bg-sky-strong transition-[width]" style={{ width: `${volume * 100}%` }} /></div><button onClick={playSound} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-strong px-4 py-3 text-sm font-black text-white"><Volume2 className="size-4" />드림스틱 치기</button></div>
}

function MathField({ a, b, c, onChange }: { a: number; b: number; c: number; onChange: (key: 'a' | 'b' | 'c', value: number) => void }) {
  const [progress, setProgress] = useState(0)
  const [shooting, setShooting] = useState(false)
  const [result, setResult] = useState('')
  const frame = useRef<number | null>(null)
  const width = 760, height = 420, ground = 350, scaleX = 118, scaleY = 62, originX = 92, hoopX = 3.45, hoopY = 3.05
  const equation = (x: number) => a * x * x + b * x + c
  const toScreen = (x: number, y: number) => ({ x: originX + x * scaleX, y: ground - y * scaleY })
  const points = Array.from({ length: 81 }, (_, index) => { const x = index / 80 * 3.6; const point = toScreen(x, equation(x)); return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}` }).join(' ')
  const ballX = progress * hoopX
  const ball = toScreen(ballX, equation(ballX))
  const playerScale = 1 + Math.max(0, c - 1.8) * 0.45
  const shoot = () => { if (shooting) return; setResult(''); setShooting(true); setProgress(0); const started = performance.now(); const tick = (now: number) => { const next = Math.min(1, (now - started) / 1250); const currentX = next * hoopX; const overlapsHoop = next >= 0.9 && Math.abs(equation(currentX) - hoopY) < 0.25; setProgress(next); if (overlapsHoop) setResult('골!'); if (next < 1) frame.current = requestAnimationFrame(tick); else { setShooting(false); setResult(Math.abs(equation(hoopX) - hoopY) < 0.25 ? '골!' : '노골 · 계수를 다시 조절해보세요') } }; frame.current = requestAnimationFrame(tick) }
  useEffect(() => () => { if (frame.current) cancelAnimationFrame(frame.current) }, [])
  return <div className="mt-5 rounded-2xl border border-[#c8c8c8] bg-white p-3 shadow-sm"><div className="px-1 pb-3"><h3 className="text-xl font-black text-black">농구공과 선수로 배우는 이차함수</h3><p className="mt-1 text-sm text-black">이차함수: <strong>y = ax² + bx + c</strong> (슬라이더를 조절해 공을 골대에 넣어보세요!)</p></div><svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={`y = ${a.toFixed(2)}x² + ${b.toFixed(1)}x + ${c.toFixed(1)} 농구 포물선 시뮬레이션`}><rect x="8" y="8" width="744" height="404" rx="0" fill="#fff" stroke="#bcbcbc" strokeWidth="2" /><rect x="50" y="350" width="660" height="35" fill="#f5e6a9" /><path d="M50 350H710" stroke="#d1bd72" strokeWidth="2" /><path d={`M${originX} ${ground}H710M${originX} 54V${ground}`} stroke="#7965e8" strokeWidth="3" opacity=".45" /><path d={points} fill="none" stroke="#7965e8" strokeWidth="5" strokeLinecap="round" opacity=".8" /><g transform={`translate(${originX - 8} ${ground}) scale(${playerScale})`}><circle cx="0" cy="-165" r="22" fill="#6b4a3b" stroke="#1b2b4b" strokeWidth="4" /><path d="M-20-174Q0-198 20-174" fill="#202b4d" /><path d="M-31-140Q0-158 31-140L25-65H-25Z" fill="#f08a45" stroke="#1b2b4b" strokeWidth="4" /><path d="M-25-130L-58-177M25-130L47-174" fill="none" stroke="#1b2b4b" strokeWidth="12" strokeLinecap="round" /><path d="M-18-65L-28 0M18-65L32 0" fill="none" stroke="#1b2b4b" strokeWidth="14" strokeLinecap="round" /><path d="M-40 0H-12M20 0H50" stroke="#1b2b4b" strokeWidth="10" strokeLinecap="round" /></g><g transform={`translate(${toScreen(hoopX, hoopY).x} ${toScreen(hoopX, hoopY).y})`}><rect x="10" y="-82" width="13" height="82" fill="#6d7692" /><rect x="-18" y="-106" width="90" height="55" rx="4" fill="#e8f3ff" stroke="#1b2b4b" strokeWidth="4" /><path d="M-4-51H44" stroke="#f08a45" strokeWidth="8" /><path d="M2-43L8-8M42-43L36-8M8-8L14 13M36-8L30 13" fill="none" stroke="#e85d75" strokeWidth="3" /></g><circle cx={ball.x} cy={ball.y} r="15" fill="#f08a45" stroke="#fff" strokeWidth="4" /><path d={`M${ball.x - 10} ${ball.y - 9}Q${ball.x} ${ball.y} ${ball.x + 10} ${ball.y + 9}M${ball.x + 9} ${ball.y - 10}Q${ball.x} ${ball.y} ${ball.x - 9} ${ball.y + 10}`} fill="none" stroke="#7d3f25" strokeWidth="2" /><text x="28" y="42" fill="#1b2b4b" fontSize="18" fontWeight="700">농구 포물선 실험</text><text x="28" y="68" fill="#52627d" fontSize="14">y = ax² + bx + c · 골대 높이 3.05m</text>{result && <g><rect x="270" y="84" width="220" height="48" rx="24" fill={result.startsWith('골인') ? '#d9f7e6' : '#fff0c7'} /><text x="380" y="114" textAnchor="middle" fill="#1b2b4b" fontSize="17" fontWeight="700">{result}</text></g>}</svg><div className="mt-3 flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-xs font-bold text-muted-foreground"><span>공의 좌표 · x {ballX.toFixed(2)} / y {equation(ballX).toFixed(2)}m</span><span>{shooting ? '슛 진행 중' : '준비 완료'}</span></div><div className="mt-4 grid gap-3 px-2 pt-3 text-xs font-bold text-muted-foreground sm:grid-cols-3"><label>이차항 a · 곡률<strong className="mt-1 block text-base text-ink">{a.toFixed(2)}</strong><input className="w-full" type="range" min="-1" max="-0.01" step="0.01" value={a} onChange={(e) => { onChange('a', Number(e.target.value)); setResult('') }} /></label><label>일차항 b · 발사각도<strong className="mt-1 block text-base text-ink">{b.toFixed(1)}</strong><input className="w-full" type="range" min="-0.5" max="5" step="0.05" value={b} onChange={(e) => { onChange('b', Number(e.target.value)); setResult('') }} /></label><label>상수항 c · 선수 키/방출 높이<strong className="mt-1 block text-base text-ink">{c.toFixed(1)}m</strong><input className="w-full" type="range" min="1" max="2.5" step="0.1" value={c} onChange={(e) => { onChange('c', Number(e.target.value)); setResult('') }} /></label></div><button onClick={shoot} disabled={shooting} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-black text-white disabled:opacity-50"><Target className="size-4" />슛 쏘기 (Shoot Ball)</button></div>
}

function QuadraticSliders({ a, b, c, onChange, cLabel }: { a: number; b: number; c: number; onChange: (key: 'a' | 'b' | 'c', value: number) => void; cLabel: string }) {
  return <div className="mt-4 grid gap-3 px-2 pt-3 text-xs font-bold text-muted-foreground sm:grid-cols-3"><label>이차항 a · 곡률<strong className="mt-1 block text-base text-ink">{a.toFixed(2)}</strong><input className="w-full" type="range" min="-1" max="-0.01" step="0.01" value={a} onChange={(e) => onChange('a', Number(e.target.value))} /></label><label>일차항 b · 기울기<strong className="mt-1 block text-base text-ink">{b.toFixed(2)}</strong><input className="w-full" type="range" min="-0.5" max="5" step="0.05" value={b} onChange={(e) => onChange('b', Number(e.target.value))} /></label><label>상수항 c · {cLabel}<strong className="mt-1 block text-base text-ink">{c.toFixed(2)}</strong><input className="w-full" type="range" min="1" max="2.5" step="0.1" value={c} onChange={(e) => onChange('c', Number(e.target.value))} /></label></div>
}

function MathCannonField({ a, b, c, onChange }: { a: number; b: number; c: number; onChange: (key: 'a' | 'b' | 'c', value: number) => void }) {
  const [progress, setProgress] = useState(0)
  const [firing, setFiring] = useState(false)
  const [result, setResult] = useState('')
  const frame = useRef<number | null>(null)
  const width = 760, height = 420, ground = 350, scaleX = 118, scaleY = 62, originX = 92, targetX = 4.6
  const equation = (x: number) => a * x * x + b * x + c
  const toScreen = (x: number, y: number) => ({ x: originX + x * scaleX, y: ground - y * scaleY })
  const landingX = (() => { const disc = b * b - 4 * a * c; if (disc < 0) return 5.2; const root1 = (-b + Math.sqrt(disc)) / (2 * a); const root2 = (-b - Math.sqrt(disc)) / (2 * a); return Math.max(root1, root2) })()
  const flightX = Math.max(0.001, landingX)
  const points = Array.from({ length: 81 }, (_, index) => { const x = index / 80 * flightX; const point = toScreen(x, Math.max(0, equation(x))); return `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}` }).join(' ')
  const ballX = progress * flightX
  const ball = toScreen(ballX, Math.max(0, equation(ballX)))
  const fire = () => { if (firing) return; setResult(''); setFiring(true); setProgress(0); const started = performance.now(); const tick = (now: number) => { const next = Math.min(1, (now - started) / 1250); setProgress(next); if (next < 1) frame.current = requestAnimationFrame(tick); else { setFiring(false); setResult(Math.abs(landingX - targetX) < 0.4 ? '명중! 성벽을 무너뜨렸어요' : '빗나감 · 계수를 조절해 조준해보세요') } }; frame.current = requestAnimationFrame(tick) }
  useEffect(() => () => { if (frame.current) cancelAnimationFrame(frame.current) }, [])
  const target = toScreen(targetX, 0)
  return <div className="mt-5 rounded-2xl border border-[#c8c8c8] bg-white p-3 shadow-sm"><div className="px-1 pb-3"><h3 className="text-xl font-black text-black">포탄으로 배우는 이차함수</h3><p className="mt-1 text-sm text-black">이차함수: <strong>y = ax² + bx + c</strong> (계수를 조절해 포탄으로 성벽을 맞혀보세요!)</p></div><svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={`y = ${a.toFixed(2)}x² + ${b.toFixed(2)}x + ${c.toFixed(2)} 포탄 포물선`}><rect x="8" y="8" width="744" height="404" rx="0" fill="#eef3fb" stroke="#bcbcbc" strokeWidth="2" /><rect x="50" y="350" width="660" height="35" fill="#c8b98a" /><path d="M50 350H710" stroke="#8f7f52" strokeWidth="2" /><path d={`M${originX} ${ground}H710M${originX} 54V${ground}`} stroke="#7965e8" strokeWidth="3" opacity=".35" /><path d={points} fill="none" stroke="#7965e8" strokeWidth="5" strokeLinecap="round" opacity=".8" /><g transform={`translate(${originX - 10} ${ground})`}><rect x="-24" y="-30" width="48" height="30" rx="6" fill="#3c4568" /><circle cx="-4" cy="-14" r="15" fill="#59648f" stroke="#1b2b4b" strokeWidth="3" /><rect x="0" y="-40" width="52" height="20" rx="10" fill="#2b3352" transform={`rotate(${-Math.atan(b) * 40} 0 -30)`} /></g><g transform={`translate(${target.x} ${target.y})`}><rect x="-26" y="-70" width="52" height="70" fill="#8892b8" stroke="#1b2b4b" strokeWidth="3" /><path d="M-26-70h13v-12h13v12h13v-12h13v12" fill="none" stroke="#1b2b4b" strokeWidth="3" /><rect x="-8" y="-34" width="16" height="34" fill="#5a2f2f" /></g><circle cx={ball.x} cy={ball.y} r="12" fill="#2b3352" stroke="#fff" strokeWidth="3" />{firing && <circle cx={ball.x} cy={ball.y} r="18" fill="none" stroke="#f08a45" strokeWidth="2" opacity=".5" />}<text x="28" y="42" fill="#1b2b4b" fontSize="18" fontWeight="700">포탄 발사 실험</text><text x="28" y="68" fill="#52627d" fontSize="14">y = ax² + bx + c · 도착 지점 x {landingX.toFixed(2)}</text>{result && <g><rect x="240" y="84" width="280" height="48" rx="24" fill={result.startsWith('명중') ? '#d9f7e6' : '#fff0c7'} /><text x="380" y="114" textAnchor="middle" fill="#1b2b4b" fontSize="16" fontWeight="700">{result}</text></g>}</svg><QuadraticSliders a={a} b={b} c={c} onChange={onChange} cLabel="포신 높이" /><button onClick={fire} disabled={firing} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-black text-white disabled:opacity-50"><Target className="size-4" />포탄 발사 (Fire!)</button></div>
}

function MathMusicField({ a, b, c, onChange }: { a: number; b: number; c: number; onChange: (key: 'a' | 'b' | 'c', value: number) => void }) {
  const [playingIndex, setPlayingIndex] = useState(-1)
  const contextRef = useRef<AudioContext | null>(null)
  const noteCount = 8
  const equation = (x: number) => a * x * x + b * x + c
  const notes = Array.from({ length: noteCount }, (_, index) => { const x = index / (noteCount - 1) * 4.6; const y = equation(x); const semitone = Math.round((y - 1) * 8); const freq = 220 * Math.pow(2, Math.max(-12, Math.min(24, semitone)) / 12); return { x, y, freq, semitone } })
  const maxY = Math.max(...notes.map((n) => n.y), 1.5)
  const minY = Math.min(...notes.map((n) => n.y), 0)
  const play = () => {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const context = contextRef.current ?? new AudioContextClass()
    contextRef.current = context
    notes.forEach((note, index) => {
      const start = context.currentTime + index * 0.32
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(note.freq, start)
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.04)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(start)
      oscillator.stop(start + 0.32)
      window.setTimeout(() => setPlayingIndex(index), index * 320)
    })
    window.setTimeout(() => setPlayingIndex(-1), noteCount * 320)
  }
  return <div className="mt-5 rounded-2xl border border-[#c8c8c8] bg-white p-3 shadow-sm"><div className="px-1 pb-3"><h3 className="text-xl font-black text-black">이차함수로 만드는 멜로디</h3><p className="mt-1 text-sm text-black">이차함수: <strong>y = ax² + bx + c</strong> (계수를 조절하면 음의 높낮이가 바뀌어요!)</p></div><div className="rounded-2xl bg-[#f1edff] p-4"><div className="flex items-end justify-between gap-1" style={{ height: '180px' }}>{notes.map((note, index) => { const ratio = (note.y - minY) / Math.max(0.5, maxY - minY); const barHeight = 20 + ratio * 150; return <div key={index} className="flex flex-1 flex-col items-center justify-end gap-1"><span className="text-[10px] font-bold text-violet">{note.semitone}</span><div className={`w-full rounded-t-lg transition-all ${playingIndex === index ? 'bg-violet' : 'bg-[#b8aef4]'}`} style={{ height: `${barHeight}px` }} /></div> })}</div><div className="mt-2 flex justify-between px-1 text-[10px] font-bold text-muted-foreground">{notes.map((_, index) => <span key={index}>x{index}</span>)}</div></div><QuadraticSliders a={a} b={b} c={c} onChange={onChange} cLabel="기준 음높이" /><button onClick={play} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-black text-white"><Music2 className="size-4" />멜로디 재생 (Play)</button></div>
}

function Workspace({ subject, selectedInterest, onBack, onMistakes }: { subject: 'science' | 'math'; selectedInterest: string; onBack: () => void; onMistakes: () => void }) {
  const [quadraticA, setQuadraticA] = useState(-0.11)
  const [quadraticB, setQuadraticB] = useState(0.15)
  const [quadraticC, setQuadraticC] = useState(1.8)
  const [angle, setAngle] = useState(45)
  const [speed, setSpeed] = useState(18)
  const [mass, setMass] = useState(0.45)
  const [force, setForce] = useState(90)
  const [gameAcceleration, setGameAcceleration] = useState(45)
  const [gameResetToken, setGameResetToken] = useState(0)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([{ from: 'tutor', text: '농구공의 포물선을 바꾸려면 ax² + bx + c의 어떤 계수를 조절해야 할까요?' }])
  const interest = interests.find((item) => item.id === selectedInterest) ?? interests[0]
  const send = (text = message) => {
    if (!text.trim()) return
    setMessages((items) => [...items, { from: 'you', text }, { from: 'tutor', text: '맞아요. 수학에서는 y = ax² + bx + c로 포물선을 표현해요. a는 폭, b는 발사각도, c는 선수의 키와 출발 높이를 바꿔요.' }])
    setMessage('')
  }
  const peak = 120 - (angle - 45) * 0.5
  const acceleration = force / mass
  const sportsExperiment = selectedInterest === 'sports'
  const gameExperiment = selectedInterest === 'games'
  const musicExperiment = selectedInterest === 'music'
  const mathExperiment = subject === 'math'
  const activeChatPrompts = mathExperiment ? ['a를 바꾸면 포물선 폭이 어떻게 변해?', 'b는 발사각도와 어떤 관계야?', 'c에 선수 키를 넣는 이유는?'] : chatPrompts
  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 lg:px-8">
      <div className="mb-7 flex items-center justify-between"><button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-muted-foreground"><ArrowLeft className="size-4" />문제 다시 고르기</button><button onClick={onMistakes} className="text-sm font-bold text-violet">오답노트에 저장</button></div>
      <p className="text-xs font-bold tracking-[0.2em] text-sky-strong">탐구 워크스페이스 · {mathExperiment ? '수학 · 2차함수' : gameExperiment ? '게임 물리' : '과학 · F = ma'}</p><h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-ink sm:text-4xl">{mathExperiment ? (gameExperiment ? '포탄의 계수를 조절해 성벽을 맞혀볼까?' : musicExperiment ? '이차함수를 바꾸면 멜로디는 어떻게 달라질까?' : '농구공의 포물선을 2차함수로 그려볼까?') : gameExperiment ? '총알을 발사하면, 슬라임에게 얼마나 큰 대미지를 줄까?' : musicExperiment ? '드림스틱을 세게 칠수록 소리가 커질까?' : '축구공을 차면, 수평으로 어떻게 움직일까?'}</h1>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_0.75fr]">
        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-bold text-muted-foreground">시뮬레이션 LAB</p><h2 className="mt-1 text-lg font-black text-ink">움직임을 직접 바꿔보세요</h2></div><span className="rounded-full bg-sky-soft px-3 py-1 text-xs font-bold text-sky-strong">실시간</span></div>
          {mathExperiment ? <div className="mt-5 rounded-2xl bg-violet-soft p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-violet">수학 실험 · 2차함수</p><h3 className="mt-1 text-xl font-black text-ink">{gameExperiment ? '포탄의 계수를 조절해보세요' : musicExperiment ? '멜로디의 계수를 조절해보세요' : '농구공의 포물선을 조절해보세요'}</h3></div><Calculator className="size-7 text-violet" /></div>{gameExperiment ? <MathCannonField a={quadraticA} b={quadraticB} c={quadraticC} onChange={(key, value) => { if (key === 'a') setQuadraticA(value); if (key === 'b') setQuadraticB(value); if (key === 'c') setQuadraticC(value) }} /> : musicExperiment ? <MathMusicField a={quadraticA} b={quadraticB} c={quadraticC} onChange={(key, value) => { if (key === 'a') setQuadraticA(value); if (key === 'b') setQuadraticB(value); if (key === 'c') setQuadraticC(value) }} /> : <MathField a={quadraticA} b={quadraticB} c={quadraticC} onChange={(key, value) => { if (key === 'a') setQuadraticA(value); if (key === 'b') setQuadraticB(value); if (key === 'c') setQuadraticC(value) }} />}<p className="mt-4 text-sm leading-6 text-ink"><strong className="font-black text-violet">y = ax² + bx + c</strong>에서 {gameExperiment ? 'a는 포탄 궤적의 휨, b는 발사 기울기, c는 포신의 높이를 나타내요.' : musicExperiment ? 'a·b·c를 바꾸면 각 지점의 y값이 음의 높낮이(음정)로 바뀌어요.' : 'a는 포물선의 폭, b는 발사각도, c는 농구선수의 키와 출발 높이를 나타내요.'}</p></div> : musicExperiment ? <div className="mt-5 rounded-2xl bg-sky-soft p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-sky-strong">음악 실험 · F = ma</p><h3 className="mt-1 text-xl font-black text-ink">드림스틱의 무게와 빠르기를 바꿔보세요</h3></div><Music2 className="size-7 text-sky-strong" /></div><MusicField mass={mass} acceleration={gameAcceleration} playing={musicPlaying} onPlay={() => { setMusicPlaying(true); window.setTimeout(() => setMusicPlaying(false), 500) }} /><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-2 text-xs font-bold text-muted-foreground">드림스틱 무게 <strong className="text-base text-ink">{mass.toFixed(2)} kg</strong><input aria-label="드림스틱 무게" type="range" min="0.2" max="1.2" step="0.05" value={mass} onChange={(e) => setMass(Number(e.target.value))} /></label><label className="flex flex-col gap-2 text-xs font-bold text-muted-foreground">드림스틱 가속도 <strong className="text-base text-ink">{gameAcceleration.toFixed(1)} m/s²</strong><input aria-label="드림스틱 가속도" type="range" min="5" max="120" step="1" value={gameAcceleration} onChange={(e) => setGameAcceleration(Number(e.target.value))} /></label></div><p className="mt-4 text-sm leading-6 text-ink">드림스틱의 질량과 가속도가 커질수록 타격하는 힘이 커지고, 소리도 더 크게 들려요.</p></div> : gameExperiment ? <div className="mt-5 rounded-2xl bg-violet-soft p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-violet">게임 실험 · F = ma</p><h3 className="mt-1 text-xl font-black text-ink">총알로 슬라임을 잡아보세요</h3></div><Gamepad2 className="size-7 text-violet" /></div><GameField mass={mass} acceleration={gameAcceleration} playing={playing} resetToken={gameResetToken} onComplete={() => setPlaying(false)} /><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-2 text-xs font-bold text-muted-foreground">총알 질량 <strong className="text-base text-ink">{mass.toFixed(2)} kg</strong><input aria-label="총알 질량" type="range" min="0.2" max="1.2" step="0.05" value={mass} onChange={(e) => { setMass(Number(e.target.value)); setPlaying(false) }} /></label><label className="flex flex-col gap-2 text-xs font-bold text-muted-foreground">총알 가속도 <strong className="text-base text-ink">{gameAcceleration.toFixed(1)} m/s²</strong><input aria-label="총알 가속도" type="range" min="5" max="120" step="1" value={gameAcceleration} onChange={(e) => { setGameAcceleration(Number(e.target.value)); setPlaying(false) }} /></label></div><div className="mt-5 flex items-end justify-between rounded-2xl bg-card p-4"><div><p className="text-xs font-bold text-muted-foreground">예상 대미지</p><p className="mt-1 text-4xl font-black tracking-tight text-violet">{Math.round(mass * gameAcceleration * 0.18)} <span className="text-base">DMG</span></p></div><Zap className="size-7 text-violet" /></div><p className="mt-4 text-sm leading-6 text-ink">총알의 질량과 가속도가 커질수록 슬라임에게 주는 대미지도 커져요.</p></div> : sportsExperiment ? <div className="mt-5 rounded-2xl bg-sky-soft p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold text-sky-strong">수평운동 실험 · F = ma</p><h3 className="mt-1 text-xl font-black text-ink">차는 힘과 축구공의 질량을 바꿔보세요</h3></div></div><FootballField acceleration={acceleration} mass={mass} force={force} playing={playing} onComplete={() => setPlaying(false)} /><div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-2 text-xs font-bold text-muted-foreground">축구공 질량 <strong className="text-base text-ink">{mass.toFixed(2)} kg</strong><input aria-label="축구공 질량" type="range" min="0.2" max="1.2" step="0.05" value={mass} onChange={(e) => { setMass(Number(e.target.value)); setPlaying(false) }} /></label><label className="flex flex-col gap-2 text-xs font-bold text-muted-foreground">차는 힘 <strong className="text-base text-ink">{force} N</strong><input aria-label="차는 힘" type="range" min="20" max="180" step="5" value={force} onChange={(e) => { setForce(Number(e.target.value)); setPlaying(false) }} /></label></div><div className="mt-5 flex items-end justify-between rounded-2xl bg-card p-4"><div><p className="text-xs font-bold text-muted-foreground">공의 가속도</p><p className="mt-1 text-4xl font-black tracking-tight text-violet">{acceleration.toFixed(1)} <span className="text-base">m/s²</span></p></div><Zap className="size-7 text-sky-strong" /></div><p className="mt-4 text-sm leading-6 text-ink">같은 힘으로 찰 때 질량이 커지면 가속도는 작아져요. 반대로 질량이 같다면 ��� 세게 찰수록 수평 가속도가 커져요. 이것이 F = ma의 핵심이에요.</p></div> : <div className="mt-5 overflow-hidden rounded-2xl bg-[#eaf6ff] p-2"><svg viewBox="0 0 600 330" className="w-full" role="img" aria-label="F = ma 수직운동 시뮬레이션"><path d={`M55 280 Q 260 ${peak} 525 280`} fill="none" stroke="#7965e8" strokeWidth="5" strokeLinecap="round" strokeDasharray="8 9" /><circle cx="260" cy={peak} r="11" fill="#1b2b4b" /><path d="M35 282 H570 M52 300 V28" stroke="#9acbe7" strokeWidth="2" /></svg><p className="-mt-10 ml-4 relative w-fit rounded-xl bg-card/90 px-3 py-2 text-xs font-bold text-ink">최고점에서 수직 속도 = 0</p></div>}
          {!sportsExperiment && !gameExperiment && !musicExperiment && !mathExperiment && <div className="mt-8 grid gap-4 sm:grid-cols-2"><label className="flex flex-col gap-2 text-xs font-bold text-muted-foreground">차는 힘 <span className="text-base text-ink">{angle}°</span><input type="range" min="15" max="75" value={angle} onChange={(e) => setAngle(Number(e.target.value))} /></label><label className="flex flex-col gap-2 text-xs font-bold text-muted-foreground">처음 속도 <span className="text-base text-ink">{speed} m/s</span><input type="range" min="8" max="30" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} /></label></div>}
          <div className="mt-6 flex flex-wrap gap-2">{!mathExperiment && <Button onClick={() => setPlaying(true)} disabled={playing} className="rounded-xl bg-ink text-white">{gameExperiment ? '발사' : sportsExperiment ? '공차기' : playing ? '멈추기' : '재생하기'}</Button>}<Button onClick={() => { setQuadraticA(-0.11); setQuadraticB(0.15); setQuadraticC(1.8); setAngle(45); setSpeed(18); setMass(0.45); setForce(90); setGameResetToken((value) => value + 1); setMusicPlaying(false); setPlaying(false) }} variant="ghost" className="rounded-xl"><RotateCcw data-icon="inline-start" />초기화</Button></div>
        </div>
        <div className="flex min-h-[580px] flex-col rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-violet-soft text-violet"><BrainCircuit className="size-5" /></div><div><p className="text-sm font-black text-ink">스킴 튜터</p><p className="text-xs text-muted-foreground">생각을 끌어내는 질문을 해요</p></div></div><div className="mt-5 rounded-2xl bg-violet-soft p-4 text-sm leading-6 text-ink"><span className="mb-2 block text-xs font-bold text-violet">{mathExperiment ? '농구로 연결' : `${interest.label}로 연결`}</span>{mathExperiment ? '농구공의 궤적은 y = ax² + bx + c로 나타낼 수 있어요. a는 포물선의 폭, b는 발사각도, c는 선수의 키와 출발 높이예요.' : interest.id === 'sports' ? '축구공을 수평으로 차서 골대까지 보낼 때도 힘과 질량에 따른 가속도가 작용해요.' : interest.id === 'music' ? '드림스틱의 질량과 가속도가 커지면 F = ma에 따라 타격하는 힘과 소리의 크기도 커져요.' : `${interest.label}에서도 같은 움직임의 원리를 발견할 수 있어요.`}</div><div className="mt-5 flex-1 overflow-auto">{messages.map((item, index) => <div key={index} className={`mb-4 flex ${item.from === 'you' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${item.from === 'you' ? 'bg-ink text-white' : 'bg-sky-soft text-ink'}`}>{item.text}</div></div>)}</div><div className="mb-3 flex flex-wrap gap-2">{activeChatPrompts.map((prompt) => <button key={prompt} onClick={() => send(prompt)} className="rounded-full border border-border px-3 py-2 text-xs font-bold text-muted-foreground">{prompt}</button>)}</div><div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-2"><input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) send() }} placeholder="궁금한 점을 적어보세요" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" /><Button onClick={() => send()} size="icon" className="size-9 rounded-xl bg-sky-strong text-white"><Send data-icon="inline-start" /></Button></div></div>
      </div>
    </section>
  )
}

function Mistakes({ subject, onBack, onReplay }: { subject: 'science' | 'math'; onBack: () => void; onReplay: () => void }) {
  const math = subject === 'math'
  const [saved, setSaved] = useState(false)
  const [notes, setNotes] = useState<Array<{ id: number; title: string; concept: string; explanation: string; createdAt: Date | string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const loadNotes = async () => { setLoading(true); try { setNotes(await getMistakeNotes()) } catch { setNotes([]) } finally { setLoading(false) } }
  const saveNote = async () => { setLoading(true); setError(''); try { await saveMistakeNote({ subject, title: math ? '농구공의 포물선과 이차함수' : '축구공을 차는 힘과 가속도', question: math ? 'a가 커지면 포물선은 어떻게 변할까요?' : '질량과 가속도는 어떤 관계일까요?', concept: math ? 'y = ax² + bx + c에서 a는 포물선의 폭, b는 발사각도, c는 선수의 키와 출발 높이를 나타내요.' : 'F = ma에서 a = F / m이에요.', explanation: math ? 'a가 커지면 포물선의 휨이 달라지고, c는 출발 높이를 바꿔요.' : '같은 힘이라면 질량이 클수록 가속도가 작아져요.' }); setSaved(true); await loadNotes() } catch { setSaved(false); setError('저장하려면 로그인해주세요.') } finally { setLoading(false) } }

  return <section className="mx-auto max-w-5xl px-5 pb-16 pt-10 lg:px-8 lg:pt-16">
    <div className="mb-10 flex items-center justify-between gap-4"><button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-ink"><ArrowLeft className="size-4" />워크스페이스로 돌아가기</button><Link href="/sign-in" className="text-sm font-bold text-violet">계정 전환</Link></div>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold tracking-[0.2em] text-violet">MY LEARNING LOG</p><h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-ink sm:text-6xl">오답도,<br /><span className="text-violet">발견의 기록</span>이에요.</h1></div><p className="max-w-xs text-sm leading-6 text-muted-foreground">틀린 문제를 다시 보는 순간<br />개념이 진짜 내 것이 되니까요.</p></div>
    <div className="mt-12 rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-8"><div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="grid size-14 place-items-center rounded-2xl bg-sky-soft text-sky-strong"><FlaskConical className="size-7" /></div><div><span className="rounded-full bg-violet-soft px-2.5 py-1 text-[11px] font-bold text-violet">{math ? '수학 · 2차함수' : '과학 · 수평운동'}</span><h2 className="mt-2 text-xl font-black text-ink">{math ? '농구공의 포물선과 이차함수' : '축구공을 차는 힘과 가속도'}</h2><p className="mt-1 text-sm text-muted-foreground">저장한 날짜 · 오늘</p></div></div><div className="flex flex-wrap gap-2"><Button onClick={saveNote} disabled={loading || saved} className="rounded-xl bg-violet text-white">{saved ? '저장 완료' : loading ? '저장 중...' : '오답노트 저장'}</Button><Button onClick={loadNotes} disabled={loading} variant="outline" className="rounded-xl">저장 기록 불러오기</Button><Button onClick={onReplay} className="rounded-xl bg-ink text-white">다시 탐구하기<ArrowRight data-icon="inline-end" /></Button></div></div>
      <div className="grid gap-5 pt-7 md:grid-cols-2"><div><p className="mb-3 flex items-center gap-2 text-xs font-bold text-muted-foreground"><CircleHelp className="size-4 text-violet" />내가 헷갈렸던 부분</p><div className="rounded-2xl bg-background p-5 text-sm leading-7 text-ink">{math ? 'a가 커지면 포물선이 더 넓어지는지, c가 선수의 키와 어떻게 연결되는지 헷갈렸어요.' : '축구공의 질량이 늘어나면 수평 가속도도 따라 늘어난다고 생각했어요.'}</div></div><div><p className="mb-3 flex items-center gap-2 text-xs font-bold text-muted-foreground"><Lightbulb className="size-4 text-sky" />핵심 개념</p><div className="rounded-2xl bg-background p-5 text-sm leading-7 text-ink">{math ? <><strong className="font-black text-violet">y = ax² + bx + c</strong>에서 a는 포물선의 폭, b는 발사각도, c는 농구선수의 키와 출발 높이를 나타내요.</> : <><strong className="font-black text-violet">F = ma</strong>에서 <strong className="font-black text-violet">a = F / m</strong>이에요. 같은 축구공이라면 차는 힘이 커질수록 가속도가 커지고, 같은 힘이라면 질량이 클수록 가속도가 작아져요.</>}</div></div></div>
      <div className="mt-5 rounded-2xl bg-violet-soft p-5"><p className="mb-3 flex items-center gap-2 text-xs font-bold text-violet"><Sparkles className="size-4" />나만의 연결</p><p className="text-sm leading-7 text-ink">축구공을 세게 찰수록 골대 방향으로 더 빠르게 출발해요. 하지만 공이 무거워지면 같은 발차기 힘으로는 속도를 바꾸기 어려워져요. 경기에서 패스의 세기와 공의 무게를 떠올리며 <strong className="font-black">F = ma</strong>를 기억해보세요.</p></div>
      <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-background p-5"><div><p className="text-xs font-bold text-muted-foreground">이번 탐구의 한 줄 요약</p><p className="mt-1 text-sm font-black text-ink">힘은 가속도를 키우고, 질량은 가속도를 줄여요.</p></div><Check className="size-5 text-sky-strong" /></div>{error && <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm font-bold text-amber-800">{error} <Link href="/sign-in" className="underline">로그인하기</Link></p>}{notes.length > 0 && <div className="mt-8 border-t border-border pt-7"><h3 className="text-lg font-black text-ink">저장된 오답노트 ({notes.length}개)</h3><div className="mt-4 grid gap-3">{notes.map((note) => <details key={note.id} className="rounded-2xl border border-border bg-background p-4"><summary className="cursor-pointer list-none text-sm font-black text-ink">{note.title}</summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{note.concept}</p><p className="mt-2 text-sm leading-6 text-ink">{note.explanation}</p></details>)}</div></div>}
    </div>
  </section>
}
