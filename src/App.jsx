import { useMemo, useState } from 'react'
import './App.css'

const defaultStudyTypes = [
  { value: 'japanese', label: '国語', color: '#f59e0b' },
  { value: 'math', label: '数学', color: '#3b82f6' },
  { value: 'english', label: '英語', color: '#10b981' },
  { value: 'science', label: '理科', color: '#8b5cf6' },
  { value: 'social', label: '社会', color: '#ef4444' },
]

const palette = [
  '#f59e0b',
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#ef4444',
  '#14b8a6',
  '#f97316',
  '#ec4899',
]

const initialLogs = [
  { date: '2026-06-18', subject: 'math', minutes: 45 },
  { date: '2026-06-19', subject: 'english', minutes: 30 },
  { date: '2026-06-19', subject: 'science', minutes: 25 },
  { date: '2026-06-21', subject: 'japanese', minutes: 50 },
  { date: '2026-06-22', subject: 'social', minutes: 35 },
  { date: '2026-06-23', subject: 'math', minutes: 60 },
]

const buildStudyTypeMap = (studyTypes) =>
  studyTypes.reduce((map, item) => {
    map[item.value] = item
    return map
  }, {})

const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}分`
  return `${hours}時間${rest ? ` ${rest}分` : ''}`
}

const getLast7Days = () => {
  const today = new Date('2026-06-23T00:00:00')
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    return date.toISOString().slice(0, 10)
  })
}

const getReadableTextColor = (hexColor) => {
  const hex = hexColor.replace('#', '')
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 155 ? '#07111f' : '#ffffff'
}

function App() {
  const [studyTypes, setStudyTypes] = useState(defaultStudyTypes)
  const [logs, setLogs] = useState(initialLogs)
  const [selectedDate, setSelectedDate] = useState('2026-06-23')
  const [selectedSubject, setSelectedSubject] = useState(defaultStudyTypes[0].value)
  const [minutes, setMinutes] = useState('30')
  const [newStudyLabel, setNewStudyLabel] = useState('')
  const [pickedColor, setPickedColor] = useState(palette[0])
  const [goalMinutes, setGoalMinutes] = useState('300')

  const studyTypeMap = useMemo(() => buildStudyTypeMap(studyTypes), [studyTypes])

  const totalMinutes = useMemo(
    () => logs.reduce((sum, log) => sum + log.minutes, 0),
    [logs],
  )

  const studyDays = useMemo(() => new Set(logs.map((log) => log.date)).size, [logs])

  const streakDays = useMemo(() => {
    const dates = [...new Set(logs.map((log) => log.date))].sort()
    if (dates.length === 0) return 0

    let streak = 1
    for (let index = dates.length - 1; index > 0; index -= 1) {
      const current = new Date(`${dates[index]}T00:00:00`)
      const previous = new Date(`${dates[index - 1]}T00:00:00`)
      const diffDays = Math.round((current - previous) / (1000 * 60 * 60 * 24))
      if (diffDays !== 1) break
      streak += 1
    }
    return streak
  }, [logs])

  const weeklySummary = useMemo(() => {
    const days = getLast7Days()
    return days.map((date) => {
      const dayMinutes = logs
        .filter((log) => log.date === date)
        .reduce((sum, log) => sum + log.minutes, 0)
      return { date, minutes: dayMinutes }
    })
  }, [logs])

  const subjectSummary = useMemo(() => {
    return logs.reduce((acc, log) => {
      acc[log.subject] = (acc[log.subject] ?? 0) + log.minutes
      return acc
    }, {})
  }, [logs])

  const selectedSubjectColor =
    studyTypeMap[selectedSubject]?.color ?? '#64748b'

  const goalValue = Number(goalMinutes) || 300
  const progress = Math.min(100, Math.round((totalMinutes / goalValue) * 100))

  const handleAddLog = (event) => {
    event.preventDefault()
    const nextMinutes = Number(minutes)
    if (!selectedDate || !selectedSubject || Number.isNaN(nextMinutes) || nextMinutes <= 0) {
      return
    }

    setLogs((current) => [
      ...current,
      { date: selectedDate, subject: selectedSubject, minutes: nextMinutes },
    ])
  }

  const handleAddStudyType = (event) => {
    event.preventDefault()
    const label = newStudyLabel.trim()
    if (!label) return

    const value = label.toLowerCase().replace(/\s+/g, '-')
    if (studyTypeMap[value]) return

    setStudyTypes((current) => [...current, { value, label, color: pickedColor }])
    setSelectedSubject(value)
    setNewStudyLabel('')
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Study App</p>
          <h1>カレンダー入力から学習時間を自動集計</h1>
        </div>
        <div className="topbar-badge">GitHub / Vercel ready</div>
      </header>

      <section
        className="hero-card"
        style={{ gridTemplateColumns: '1.55fr 0.95fr', alignItems: 'start' }}
      >
        <div className="hero-copy-wrap">
          <p className="hero-copy">
            日ごとの入力をためるだけで、学習時間・学習日数・連続記録を
            わかりやすく見える化します。
          </p>

          <form
            onSubmit={handleAddLog}
            style={{ display: 'grid', gap: '10px', maxWidth: '680px' }}
          >
            <span className="section-label">カレンダー入力</span>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.1fr 1fr 110px auto',
                gap: '8px',
              }}
            >
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
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
                type="number"
                min="1"
                step="1"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
                placeholder="分"
                style={{
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'inherit',
                  padding: '12px 14px',
                  minWidth: 0,
                }}
              />
              <button type="submit" className="primary-action">
                追加
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {studyTypes.map((item) => {
                const isActive = item.value === selectedSubject
                const textColor = getReadableTextColor(item.color)
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedSubject(item.value)}
                    aria-pressed={isActive}
                    style={{
                      border: isActive
                        ? `2px solid ${item.color}`
                        : '1px solid rgba(255,255,255,0.15)',
                      background: item.color,
                      color: textColor,
                      borderRadius: '999px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      boxShadow: isActive
                        ? `0 0 0 3px ${item.color}33`
                        : 'none',
                      transform: isActive ? 'translateY(-1px)' : 'none',
                    }}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            <small style={{ color: 'rgba(244,247,251,0.7)' }}>
              選んだ種類ごとに、その日の学習時間として記録されます。
            </small>
          </form>

          <form
            onSubmit={handleAddStudyType}
            style={{ display: 'grid', gap: '10px', maxWidth: '680px', marginTop: '8px' }}
          >
            <span className="section-label">勉強の種類を追加</span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '8px',
              }}
            >
              <input
                value={newStudyLabel}
                onChange={(event) => setNewStudyLabel(event.target.value)}
                placeholder="例: 資格試験"
                style={{
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'inherit',
                  padding: '12px 14px',
                  minWidth: 0,
                }}
              />
              <button type="submit" className="primary-action">
                追加
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {palette.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`色 ${color}`}
                  onClick={() => setPickedColor(color)}
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '999px',
                    border:
                      pickedColor === color
                        ? '3px solid white'
                        : '2px solid rgba(255,255,255,0.22)',
                    background: color,
                    cursor: 'pointer',
                    boxShadow:
                      pickedColor === color
                        ? '0 0 0 2px rgba(255,255,255,0.12)'
                        : 'none',
                  }}
                />
              ))}
              <span style={{ alignSelf: 'center', color: 'rgba(244,247,251,0.7)' }}>
                選択中の色
              </span>
            </div>
          </form>
        </div>

        <aside
          className="panel panel-side"
          style={{
            display: 'grid',
            gap: '16px',
            alignContent: 'start',
          }}
        >
          <p className="section-label">Focus</p>
          <h2>数字で見える化</h2>
          <p className="side-copy">
            学習記録は数字だけでまとめています。種類の色は、文字が見やすいように自動で調整します。
          </p>

          <form
            style={{
              display: 'grid',
              gap: '8px',
              padding: '14px',
              borderRadius: '20px',
              border: `1px solid ${selectedSubjectColor}55`,
              background: `${selectedSubjectColor}12`,
            }}
            onSubmit={(event) => event.preventDefault()}
          >
            <span className="section-label">目標進捗</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
              <input
                type="number"
                min="1"
                step="10"
                value={goalMinutes}
                onChange={(event) => setGoalMinutes(event.target.value)}
                style={{
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'inherit',
                  padding: '12px 14px',
                }}
              />
              <div
                className="progress-pill"
                style={{
                  background: `${selectedSubjectColor}22`,
                  color: selectedSubjectColor,
                  border: `1px solid ${selectedSubjectColor}55`,
                  alignSelf: 'center',
                }}
              >
                {progress}%
              </div>
            </div>
            <small style={{ color: 'rgba(244,247,251,0.7)' }}>
              ここで目標分数を変えると、進捗率も自動で変わります。
            </small>
          </form>

          <div className="focus-box" style={{ borderColor: `${selectedSubjectColor}55`, background: `${selectedSubjectColor}18` }}>
            <span>総合学習時間</span>
            <strong>{formatMinutes(totalMinutes)}</strong>
          </div>

          <div className="tip-box">
            <p>学習日数</p>
            <strong>{studyDays}日分の記録があります。</strong>
          </div>

          <div className="tip-box">
            <p>連続記録</p>
            <strong>{streakDays}日連続で記録されています。</strong>
          </div>

          <div className="schedule-box">
            <p>色分けされた種類</p>
            <ul>
              {studyTypes.map((item) => (
                <li key={item.value} style={{ color: item.color }}>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Weekly</p>
              <h2>7日分の学習時間</h2>
            </div>
            <div
              className="progress-pill"
              style={{
                background: `${selectedSubjectColor}22`,
                color: selectedSubjectColor,
                border: `1px solid ${selectedSubjectColor}55`,
              }}
            >
              目標進捗 {progress}%
            </div>
          </div>

          <div className="progress-bar" aria-hidden="true">
            <span style={{ width: `${progress}%`, background: selectedSubjectColor }} />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            {weeklySummary.map((item) => (
              <div
                key={item.date}
                style={{
                  borderRadius: '16px',
                  padding: '12px 10px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'center',
                }}
              >
                <div style={{ color: 'rgba(244,247,251,0.65)', fontSize: '0.8rem' }}>
                  {item.date.slice(5)}
                </div>
                <div style={{ marginTop: '12px', fontWeight: 700 }}>
                  {item.minutes}分
                </div>
              </div>
            ))}
          </div>

          <ul className="task-list">
            {logs
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 6)
              .map((log, index) => {
                const subject = studyTypeMap[log.subject]
                const chipTextColor = subject
                  ? getReadableTextColor(subject.color)
                  : '#07111f'

                return (
                  <li
                    key={`${log.date}-${log.subject}-${index}`}
                    className="task"
                    style={{
                      borderColor: subject ? `${subject.color}55` : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <button
                      type="button"
                      className="task-toggle"
                      style={{
                        background: subject ? subject.color : '#d8e7ff',
                        color: chipTextColor,
                      }}
                    >
                      {subject?.label ?? log.subject}
                    </button>
                    <div>
                      <h3>{log.date}</h3>
                      <p>{formatMinutes(log.minutes)} 学習</p>
                    </div>
                  </li>
                )
              })}
          </ul>
        </article>

        <aside className="panel panel-side">
          <p className="section-label">Subject</p>
          <h2>種類別の合計</h2>
          <p className="side-copy">
            どの教科にどれだけ時間を使ったかを、数字で見られるようにしています。
          </p>

          <div className="schedule-box">
            <p>学習時間の内訳</p>
            <ul>
              {Object.entries(subjectSummary).map(([subject, minutesValue]) => {
                const item = studyTypeMap[subject]
                return (
                  <li key={subject} style={{ color: item?.color ?? '#ffffff' }}>
                    {item?.label ?? subject} - {formatMinutes(minutesValue)}
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>
      </section>

      <footer className="footer-note">
        <span>日付ごとの入力から集計</span>
        <span>5教科 + 自由追加 + 色分け</span>
      </footer>
    </main>
  )
}

export default App
