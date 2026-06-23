import { useMemo, useState } from 'react'
import './App.css'

const defaultStudyTypes = [
  {
    value: 'japanese',
    label: '国語',
    color: '#f59e0b',
    description: '読解・漢字・作文を中心に学ぶ',
    metrics: [
      { label: '今日の学習', value: '1h 10m' },
      { label: '連続日数', value: '6日' },
      { label: '今週の目標', value: '5h' },
    ],
    tasks: [
      {
        id: 1,
        title: '漢字の読み書き確認',
        subject: '国語',
        minutes: 20,
        done: true,
      },
      {
        id: 2,
        title: '説明文の読解',
        subject: '国語',
        minutes: 35,
        done: false,
      },
      {
        id: 3,
        title: '作文の見直し',
        subject: '国語',
        minutes: 15,
        done: false,
      },
    ],
    upcomingStudy: ['19:00 - 漢字確認', '20:00 - 読解', '21:00 - 作文見直し'],
    focus: '言葉の意味を丁寧に読む',
    memo: '読んだあとに要点を3つに分けて書く。',
  },
  {
    value: 'math',
    label: '数学',
    color: '#3b82f6',
    description: '計算・図形・証明を中心に学ぶ',
    metrics: [
      { label: '今日の学習', value: '1h 40m' },
      { label: '連続日数', value: '9日' },
      { label: '今週の目標', value: '7h' },
    ],
    tasks: [
      {
        id: 1,
        title: '計算問題 10問',
        subject: '数学',
        minutes: 25,
        done: true,
      },
      {
        id: 2,
        title: '関数のグラフ復習',
        subject: '数学',
        minutes: 35,
        done: false,
      },
      {
        id: 3,
        title: '証明問題 1問',
        subject: '数学',
        minutes: 30,
        done: false,
      },
    ],
    upcomingStudy: ['19:00 - 計算問題', '20:00 - 関数復習', '21:00 - 証明問題'],
    focus: '式の流れを追って理解する',
    memo: '解けなかった問題は式変形だけ残す。',
  },
  {
    value: 'english',
    label: '英語',
    color: '#10b981',
    description: '単語・文法・長文を中心に学ぶ',
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
    upcomingStudy: ['19:00 - 単語 50 語', '20:00 - 長文 1 題', '21:00 - 文法確認'],
    focus: '短時間で回数を増やす',
    memo: '覚えにくかった単語を最後にまとめる。',
  },
  {
    value: 'science',
    label: '理科',
    color: '#8b5cf6',
    description: '実験・暗記・現象理解を中心に学ぶ',
    metrics: [
      { label: '今日の学習', value: '1h 00m' },
      { label: '連続日数', value: '4日' },
      { label: '今週の目標', value: '4h' },
    ],
    tasks: [
      {
        id: 1,
        title: '用語の暗記',
        subject: '理科',
        minutes: 20,
        done: true,
      },
      {
        id: 2,
        title: '実験結果の整理',
        subject: '理科',
        minutes: 25,
        done: false,
      },
      {
        id: 3,
        title: '図やグラフの確認',
        subject: '理科',
        minutes: 15,
        done: false,
      },
    ],
    upcomingStudy: ['19:00 - 用語暗記', '20:00 - 実験整理', '21:00 - 図表確認'],
    focus: '現象をイメージでつかむ',
    memo: '見た現象を自分の言葉で説明する。',
  },
  {
    value: 'social',
    label: '社会',
    color: '#ef4444',
    description: '地理・歴史・公民を中心に学ぶ',
    metrics: [
      { label: '今日の学習', value: '55m' },
      { label: '連続日数', value: '10日' },
      { label: '今週の目標', value: '5h' },
    ],
    tasks: [
      {
        id: 1,
        title: '地理用語の確認',
        subject: '社会',
        minutes: 20,
        done: true,
      },
      {
        id: 2,
        title: '歴史の流れを復習',
        subject: '社会',
        minutes: 20,
        done: false,
      },
      {
        id: 3,
        title: '時事問題をチェック',
        subject: '社会',
        minutes: 15,
        done: false,
      },
    ],
    upcomingStudy: ['19:00 - 地理用語', '20:00 - 歴史復習', '21:00 - 時事確認'],
    focus: '流れで覚えてつながりを作る',
    memo: '年号や場所はセットで覚える。',
  },
]

const createCustomStudy = (label, color) => ({
  value: label.toLowerCase().replace(/\s+/g, '-'),
  label,
  color,
  description: '自分で追加した勉強の種類',
  metrics: [
    { label: '今日の学習', value: '1h 00m' },
    { label: '連続日数', value: '1日' },
    { label: '今週の目標', value: '3h' },
  ],
  tasks: [
    {
      id: 1,
      title: `${label} の基礎確認`,
      subject: label,
      minutes: 20,
      done: true,
    },
    {
      id: 2,
      title: `${label} の演習`,
      subject: label,
      minutes: 25,
      done: false,
    },
    {
      id: 3,
      title: `${label} の振り返り`,
      subject: label,
      minutes: 15,
      done: false,
    },
  ],
  upcomingStudy: [
    `19:00 - ${label} の基礎確認`,
    `20:00 - ${label} の演習`,
    `21:00 - ${label} の振り返り`,
  ],
  focus: `${label} を自分のペースで進める`,
  memo: `${label} でつまずいたところを1行で残す。`,
})

function App() {
  const [studyTypes, setStudyTypes] = useState(defaultStudyTypes)
  const [selectedStudy, setSelectedStudy] = useState(defaultStudyTypes[0].value)
  const [newStudyLabel, setNewStudyLabel] = useState('')
  const [newStudyColor, setNewStudyColor] = useState('#64748b')

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

  const handleStudyChange = (value) => {
    const nextStudy = studyTypes.find((item) => item.value === value)
    if (!nextStudy) {
      return
    }

    setSelectedStudy(nextStudy.value)
    setTasks(nextStudy.tasks)
  }

  const handleAddStudy = (event) => {
    event.preventDefault()

    const label = newStudyLabel.trim()
    if (!label) {
      return
    }

    const nextStudy = createCustomStudy(label, newStudyColor)
    setStudyTypes((current) => [...current, nextStudy])
    setSelectedStudy(nextStudy.value)
    setTasks(nextStudy.tasks)
    setNewStudyLabel('')
  }

  const accentColor = currentStudy.color

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Study App</p>
          <h1>学習の流れを1画面で整える。</h1>
        </div>
        <div
          className="topbar-badge"
          style={{
            borderColor: `${accentColor}66`,
            background: `${accentColor}1a`,
            color: accentColor,
          }}
        >
          GitHub / Vercel ready
        </div>
      </header>

      <section className="hero-card">
        <div className="hero-copy-wrap">
          <p className="hero-copy">
            まずは資格や学校でよく使う 5 教科を標準設定にしています。
            そこから自分の勉強を自由に追加できます。
          </p>

          <form
            onSubmit={handleAddStudy}
            style={{ display: 'grid', gap: '10px', maxWidth: '420px' }}
          >
            <span className="section-label">勉強の種類</span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px auto',
                gap: '8px',
              }}
            >
              <input
                value={newStudyLabel}
                onChange={(event) => setNewStudyLabel(event.target.value)}
                placeholder="例: 資格試験、プログラミング"
                style={{
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'inherit',
                  padding: '12px 14px',
                  minWidth: 0,
                }}
              />
              <input
                type="color"
                value={newStudyColor}
                onChange={(event) => setNewStudyColor(event.target.value)}
                aria-label="勉強の色"
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '48px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  padding: '4px',
                }}
              />
              <button
                type="submit"
                className="primary-action"
                style={{ whiteSpace: 'nowrap' }}
              >
                追加
              </button>
            </div>
            <small style={{ color: 'rgba(244,247,251,0.7)' }}>
              追加した種類は、下の一覧にすぐ反映されます。
            </small>
          </form>

          <div className="hero-actions">
            <button type="button" className="primary-action">
              25分集中を開始
            </button>
            <span className="ghost-note">次の小さな一歩をすぐ始める</span>
          </div>
        </div>

        <div className="hero-metrics">
          {currentStudy.metrics.map((item) => (
            <article
              key={item.label}
              className="metric-card"
              style={{
                borderColor: `${accentColor}55`,
                boxShadow: `0 0 0 1px ${accentColor}22`,
              }}
            >
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section
        className="panel"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p className="section-label">選択中の種類</p>
          <strong style={{ fontSize: '1.15rem' }}>{currentStudy.label}</strong>
          <div style={{ color: 'rgba(244,247,251,0.72)', marginTop: '4px' }}>
            {currentStudy.description}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {studyTypes.map((item) => {
            const isActive = item.value === selectedStudy
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleStudyChange(item.value)}
                style={{
                  border: `1px solid ${item.color}${isActive ? 'cc' : '55'}`,
                  background: isActive
                    ? `${item.color}22`
                    : 'rgba(255,255,255,0.05)',
                  color: isActive ? item.color : 'inherit',
                  borderRadius: '999px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Today</p>
              <h2>やることリスト</h2>
            </div>
            <div
              className="progress-pill"
              style={{
                background: `${accentColor}22`,
                color: accentColor,
                border: `1px solid ${accentColor}55`,
              }}
            >
              {progress}% 完了
            </div>
          </div>

          <div className="progress-bar" aria-hidden="true">
            <span style={{ width: `${progress}%`, background: accentColor }} />
          </div>

          <ul className="task-list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={task.done ? 'task done' : 'task'}
                style={{
                  borderColor: task.done ? `${accentColor}55` : 'rgba(255,255,255,0.08)',
                }}
              >
                <button
                  type="button"
                  className="task-toggle"
                  onClick={() => toggleTask(task.id)}
                  style={{
                    background: task.done ? accentColor : '#d8e7ff',
                    color: task.done ? '#07111f' : '#07111f',
                  }}
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

          <div
            className="focus-box"
            style={{ borderColor: `${accentColor}55`, background: `${accentColor}18` }}
          >
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
        <span>5教科 + 自由追加</span>
      </footer>
    </main>
  )
}

export default App
