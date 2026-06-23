import { useMemo, useState } from 'react'
import './App.css'

const defaultTasks = [
  {
    id: 1,
    title: 'React コンポーネント復習',
    subject: 'フロントエンド',
    minutes: 45,
    done: true,
  },
  {
    id: 2,
    title: 'アルゴリズム問題 3問',
    subject: 'CS 基礎',
    minutes: 60,
    done: false,
  },
  {
    id: 3,
    title: '英単語 50語チェック',
    subject: '英語',
    minutes: 25,
    done: false,
  },
]

const focusSessions = [
  { label: '今日の学習', value: '2h 10m' },
  { label: '連続日数', value: '12日' },
  { label: '今週の目標', value: '10h' },
]

function App() {
  const [tasks, setTasks] = useState(defaultTasks)
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

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Study App</p>
          <h1>学習の流れを1画面で整える。</h1>
          <p className="hero-copy">
            今日やること、進捗、集中時間をまとめて見られるシンプルな
            学習ダッシュボードです。
          </p>
        </div>

        <div className="hero-metrics">
          {focusSessions.map((item) => (
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
                <button type="button" className="task-toggle" onClick={() => toggleTask(task.id)}>
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
          <h2>次に集中すること</h2>
          <p className="side-copy">
            タスクを1つずつ終わらせる前提で、時間の区切りを小さくして
            取り組みやすくしています。
          </p>

          <div className="focus-box">
            <span>おすすめ</span>
            <strong>25分集中 + 5分休憩</strong>
          </div>

          <div className="tip-box">
            <p>学習メモ</p>
            <strong>終わったら内容を1行で振り返る。</strong>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
