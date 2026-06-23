import { useMemo, useState } from 'react'
import './App.css'

const studyTypes = [
  {
    value: 'frontend',
    label: 'フロントエンド',
    description: 'React や UI を中心に学ぶ',
    metrics: [
      { label: '今日の学習', value: '2h 10m' },
      { label: '連続日数', value: '12日' },
      { label: '今週の目標', value: '10h' },
    ],
    tasks: [
      {
        id: 1,
        title: 'React コンポーネント復習',
        subject: 'フロントエンド',
        minutes: 45,
        done: true,
      },
      {
        id: 2,
        title: 'レイアウト調整と CSS 整理',
        subject: 'フロントエンド',
        minutes: 40,
        done: false,
      },
      {
        id: 3,
        title: '英単語 50語チェック',
        subject: '英語',
        minutes: 25,
        done: false,
      },
    ],
    upcomingStudy: [
      '19:00 - React の復習',
      '20:00 - レイアウト調整',
      '21:00 - 英単語チェック',
    ],
    focus: 'UI を触りながら覚える',
    memo: '終わったら画面の変化を1行で振り返る。',
  },
  {
    value: 'algorithm',
    label: 'アルゴリズム',
    description: '問題演習と考え方を中心に学ぶ',
    metrics: [
      { label: '今日の学習', value: '1h 40m' },
      { label: '連続日数', value: '8日' },
      { label: '今週の目標', value: '8h' },
    ],
    tasks: [
      {
        id: 1,
        title: '二分探索の復習',
        subject: 'アルゴリズム',
        minutes: 30,
        done: true,
      },
      {
        id: 2,
        title: '配列問題を 2 問解く',
        subject: 'アルゴリズム',
        minutes: 50,
        done: false,
      },
      {
        id: 3,
        title: '解法のメモ整理',
        subject: 'CS 基礎',
        minutes: 20,
        done: false,
      },
    ],
    upcomingStudy: [
      '19:00 - 二分探索の復習',
      '20:00 - 配列問題 2 問',
      '21:00 - 解法メモ整理',
    ],
    focus: '考え方を言語化する',
    memo: '解き終わったら解法を短くまとめる。',
  },
  {
    value: 'english',
    label: '英語',
    description: '単語と長文を中心に学ぶ',
    metrics: [
      { label: '今日の学習', value: '1h 20m' },
      { label: '連続日数', value: '15日' },
      { label: '今週の目標', value: '7h' },
    ],
    tasks: [
      {
        id: 1,
        title: '単語 50 語チェック',
        subject: '英語',
        minutes: 25,
        done: true,
      },
      {
        id: 2,
        title: '長文 1 題を音読',
        subject: '英語',
        minutes: 35,
        done: false,
      },
      {
        id: 3,
        title: '文法の苦手分野を確認',
        subject: '英語',
        minutes: 20,
        done: false,
      },
    ],
    upcomingStudy: [
      '19:00 - 単語 50 語',
      '20:00 - 長文 1 題',
      '21:00 - 文法の確認',
    ],
    focus: '短時間で回数を増やす',
    memo: '終わったら覚えにくかった単語を残す。',
  },
]

function App() {
  const [selectedStudy, setSelectedStudy] = useState(studyTypes[0].value)
  const currentStudy =
    studyTypes.find((item) => item.value === selectedStudy) ?? studyTypes[0]
  const [tasks, setTasks] = useState(currentStudy.tasks)

  const completedCount = useMemo(
    () => tasks.filter((task) => task.done).length,
    [tasks],
  )
  const progress = Math.round((completedCount / tasks.length) * 100)

  const toggleTask = (id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }

  const handleStudyChange = (event) => {
    const nextStudy =
      studyTypes.find((item) => item.value === event.target.value) ??
      studyTypes[0]
    setSelectedStudy(nextStudy.value)
    setTasks(nextStudy.tasks)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Study App</p>
          <h1>学習の流れを1画面で整える。</h1>
        </div>
        <div className="topbar-badge">GitHub / Vercel ready</div>
      </header>

      <section className="hero-card">
        <div className="hero-copy-wrap">
          <p className="hero-copy">
            今日やること、進捗、集中時間をまとめて見られるシンプルな
            学習ダッシュボードです。勉強の種類は自分で選べます。
          </p>
          <label className="study-select-wrap">
            <span className="section-label">勉強の種類</span>
            <select
              value={selectedStudy}
              onChange={handleStudyChange}
              className="study-select"
            >
              {studyTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <small>{currentStudy.description}</small>
          </label>
          <div className="hero-actions">
            <button type="button" className="primary-action">
              25分集中を開始
            </button>
            <span className="ghost-note">次の小さな一歩をすぐ始める</span>
          </div>
        </div>

        <div className="hero-metrics">
          {currentStudy.metrics.map((item) => (
            <article key={item.label} className="metric-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Today</p>
              <h2>やることリスト</h2>
            </div>
            <div className="progress-pill">{progress}% 完了</div>
          </div>

          <div className="progress-bar" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>

          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.done ? 'task done' : 'task'}>
                <button
                  type="button"
                  className="task-toggle"
                  onClick={() => toggleTask(task.id)}
                >
                  {task.done ? '完了' : '未完了'}
                </button>
                <div>
                  <h3>{task.title}</h3>
                  <p>
                    {task.subject} ・ {task.minutes}分
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <aside className="panel panel-side">
          <p className="section-label">Focus</p>
          <h2>{currentStudy.focus}</h2>
          <p className="side-copy">
            選んだ勉強の種類に合わせて、タスクと予定を自分で切り替えられます。
          </p>

          <div className="focus-box">
            <span>おすすめ</span>
            <strong>25分集中 + 5分休憩</strong>
          </div>

          <div className="tip-box">
            <p>学習メモ</p>
            <strong>{currentStudy.memo}</strong>
          </div>

          <div className="schedule-box">
            <p>今日の予定</p>
            <ul>
              {currentStudy.upcomingStudy.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <footer className="footer-note">
        <span>小さく積み上げる学習管理</span>
        <span>Last updated for GitHub and Vercel deployment</span>
      </footer>
    </main>
  )
}

export default App
