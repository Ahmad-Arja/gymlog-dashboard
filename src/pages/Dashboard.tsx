import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

interface Exercise { id: number; name: string; muscleGroup: string }
interface WorkoutExercise {
  id: number
  exercise: Exercise
  sets: number; reps: number; weight: number
}
interface Workout {
  id: number; title: string; date: string; notes: string
  workoutExercises: WorkoutExercise[]
}

const MUSCLE: Record<string, { color: string; light: string }> = {
  Chest:     { color: '#3b82f6', light: 'rgba(59,130,246,0.12)' },
  Legs:      { color: '#10b981', light: 'rgba(16,185,129,0.12)' },
  Back:      { color: '#f59e0b', light: 'rgba(245,158,11,0.12)' },
  Shoulders: { color: '#a855f7', light: 'rgba(168,85,247,0.12)' },
  Arms:      { color: '#ef4444', light: 'rgba(239,68,68,0.12)'  },
  Core:      { color: '#06b6d4', light: 'rgba(6,182,212,0.12)'  },
}

const MUSCLE_IMGS: Record<string, string> = {
  Chest:     'https://hips.hearstapps.com/hmg-prod/images/man-doing-dumbbell-incline-bench-press-workout-royalty-free-image-522600373-1540485179.png?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*',
  Legs:      'https://cdn.shopify.com/s/files/1/0723/5334/9921/files/ChatGPT_Image_Jul_29_2025_08_52_10_PM_1024x1024.webp?v=1753836789',
  Back:      'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=300&q=80',
  Shoulders: 'https://liftmanual.com/wp-content/uploads/2026/05/best-shoulder-workouts-with-dumbbells.jpg',
  Arms:      'https://www.dmoose.com/cdn/shop/articles/dumbbell_arm_exercises_cc9c6157-0642-455e-a0d9-6c78d9cb2481.png?v=1776261951',
  Core:      'https://dumbbellsdirect.com/cdn/shop/articles/Barbell_Ab_Workout__Strengthen_Your_Core_With_Powerful_Loaded_Movements_800x800.jpg?v=1777450298',
}

const EXERCISE_IMGS: Record<string, string> = {
  'Bench Press':       'https://www.myprotein.com/images?url=https://blogscdn.thehut.net/app/uploads/sites/478/2021/06/shutterstock_336330497opt_featured_1624870700_1200x672_acf_cropped.jpg&auto=avif&width=1200&fit=crop',
  'Squat':             'https://www.zing.coach/_next/image?url=https%3A%2F%2Fwww.zing.coach%2Flibrary%2Fthe-front-squat-hand-position-basics-optimize-form-preview.png&w=3840&q=75',
  'Deadlift':          'https://blogscdn.thehut.net/wp-content/uploads/sites/495/2018/10/25171220/Blog-Deadlifting-Male_1800x672_1200x672_acf_cropped.jpg',
  'Overhead Press':    'https://images.squarespace-cdn.com/content/v1/5750d5129f72662d66448028/1516601347742-NU3F90DT62A0KBWTRQAH/Shoulder+Press.jpg?format=1500w',
  'Pull Up':           'https://as1.ftcdn.net/jpg/01/28/57/94/1000_F_128579416_tCZzcSWkq8QvGd3uEGAzzR340m5X3sqm.jpg',
  'Bicep Curl':        'https://hips.hearstapps.com/hmg-prod/images/bicep-curl-64c7cb39a22a9.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*',
  'Romanian Deadlift': 'https://vitruve.fit/wp-content/uploads/2024/05/image4-1-3.jpg',
}

type View = 'dashboard' | 'workouts' | 'exercises' | 'create'

export default function Dashboard() {
  const [view, setView] = useState<View>('dashboard')
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [wTitle, setWTitle] = useState('')
  const [wNotes, setWNotes] = useState('')
  const [wId, setWId] = useState<number | null>(null)
  const [wExercises, setWExercises] = useState<WorkoutExercise[]>([])
  const [selEx, setSelEx] = useState('')
  const [sets, setSets] = useState('3')
  const [reps, setReps] = useState('10')
  const [weight, setWeight] = useState('60')
  const [creating, setCreating] = useState(false)
  const [addingEx, setAddingEx] = useState(false)
  const [exName, setExName] = useState('')
  const [exMuscle, setExMuscle] = useState('Chest')
  const [savingEx, setSavingEx] = useState(false)

  useEffect(() => {
    Promise.all([API.get('/workouts'), API.get('/exercises')])
      .then(([w, e]) => {
        setWorkouts(w.data)
        setExercises(e.data)
        if (w.data.length > 0) setExpandedId(w.data[0].id)
      })
      .finally(() => setLoading(false))
  }, [])

  const totalSets = workouts.reduce((s, w) => s + w.workoutExercises.reduce((a, e) => a + e.sets, 0), 0)
  const maxWeight = workouts.reduce((max, w) => w.workoutExercises.reduce((m, e) => Math.max(m, e.weight), max), 0)
  const muscleCount: Record<string, number> = {}
  workouts.forEach(w => w.workoutExercises.forEach(e => {
    muscleCount[e.exercise.muscleGroup] = (muscleCount[e.exercise.muscleGroup] || 0) + 1
  }))

  const createWorkout = async () => {
    if (!wTitle.trim()) return
    setCreating(true)
    try {
      const res = await API.post('/workouts', { title: wTitle, notes: wNotes })
      setWId(res.data.id)
    } catch {}
    setCreating(false)
  }

  const addExercise = async () => {
    if (!selEx || !wId) return
    setAddingEx(true)
    try {
      const res = await API.post(`/workouts/${wId}/exercises`, {
        exerciseId: parseInt(selEx),
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight),
      })
      setWExercises(prev => [...prev, res.data])
    } catch {}
    setAddingEx(false)
  }

  const finishWorkout = async () => {
    const res = await API.get('/workouts')
    setWorkouts(res.data)
    setWTitle(''); setWNotes(''); setWId(null); setWExercises([])
    setView('workouts')
  }

  const deleteWorkout = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await API.delete(`/workouts/${id}`)
      setWorkouts(prev => prev.filter(w => w.id !== id))
    } catch {}
  }

  const saveExercise = async () => {
    if (!exName.trim()) return
    setSavingEx(true)
    try {
      const res = await API.post('/exercises', { name: exName, muscleGroup: exMuscle })
      setExercises(prev => [...prev, res.data])
      setExName('')
    } catch (err: any) {
      alert(err.response?.data?.error || 'Error saving exercise')
    }
    setSavingEx(false)
  }

  const NAV = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'workouts',  label: 'Workouts'  },
    { id: 'exercises', label: 'Exercises' },
    { id: 'create',    label: '+ New Workout' },
  ] as const

  const ExerciseTag = ({ muscleGroup }: { muscleGroup: string }) => {
    const cfg = MUSCLE[muscleGroup] || { color: '#64748b', light: 'rgba(100,116,139,0.1)' }
    return <span style={{ ...s.exTag, background: cfg.light, color: cfg.color }}>{muscleGroup}</span>
  }

  const ExRow = ({ e }: { e: WorkoutExercise }) => (
    <div style={s.exRow}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#0a0f1e', fontWeight: 500 }}>
        {e.exercise.name}
        <ExerciseTag muscleGroup={e.exercise.muscleGroup} />
      </span>
      <span style={s.exStat}>{e.sets}</span>
      <span style={s.exStat}>{e.reps}</span>
      <span style={{ ...s.exStat, color: '#3b82f6', fontWeight: 600 }}>{e.weight}kg</span>
    </div>
  )

  return (
    <div style={s.page}>
      <aside style={s.sidebar}>
        <div style={s.sideTop}><span style={s.sideLogo}>GYMLOG</span></div>
        <nav style={s.sideNav}>
          {NAV.map(n => (
            <div key={n.id}
              style={{ ...s.sideItem, ...(view === n.id ? s.sideActive : {}), ...(n.id === 'create' ? s.sideCreate : {}) }}
              onClick={() => setView(n.id as View)}>
              {n.label}
            </div>
          ))}
        </nav>
        <div style={s.sideBottom}>
          <div style={s.sideUser}>
            <div style={s.sideAvatar}>{user.name?.[0]?.toUpperCase() || 'A'}</div>
            <div>
              <div style={s.sideUserName}>{user.name}</div>
              <div style={s.sideUserEmail}>{user.email}</div>
            </div>
          </div>
          <button style={s.sideLogout} onClick={() => { localStorage.clear(); navigate('/') }}>Sign out</button>
        </div>
      </aside>

      <main style={s.main}>

        {/* ── DASHBOARD ── */}
        {view === 'dashboard' && (
          <>
            <div style={s.pageHeader}>
              <div>
                <h1 style={s.pageTitle}>Good session, {user.name?.split(' ')[0] || 'Athlete'} 👊</h1>
                <p style={s.pageSubtitle}>Here's your training overview</p>
              </div>
              <div style={s.headerDate}>
                {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>

            <div style={s.statsGrid}>
              {[
                { label: 'Workouts',      value: workouts.length,                unit: 'sessions',     color: '#3b82f6' },
                { label: 'Total Sets',    value: totalSets,                       unit: 'sets logged',  color: '#10b981' },
                { label: 'Peak Weight',   value: `${maxWeight}kg`,               unit: 'personal best',color: '#f59e0b' },
                { label: 'Muscle Groups', value: Object.keys(muscleCount).length, unit: 'trained',      color: '#a855f7' },
              ].map(stat => (
                <div key={stat.label} style={s.statCard}>
                  <div style={{ ...s.statDot, background: stat.color }} />
                  <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
                  <div style={s.statName}>{stat.label}</div>
                  <div style={s.statUnit}>{stat.unit}</div>
                </div>
              ))}
            </div>

            <div style={s.twoCol}>
              <div style={s.panel}>
                <h2 style={s.panelTitle}>Muscle Groups</h2>
                {Object.keys(muscleCount).length === 0
                  ? <p style={s.muted}>No data yet</p>
                  : Object.entries(muscleCount).map(([muscle, count]) => {
                      const cfg = MUSCLE[muscle] || { color: '#64748b', light: 'rgba(100,116,139,0.1)' }
                      return (
                        <div key={muscle} style={s.muscleRow}>
                          {MUSCLE_IMGS[muscle] && (
                            <div style={s.muscleThumb}>
                              <img src={MUSCLE_IMGS[muscle]} alt={muscle} style={s.muscleThumbImg} />
                            </div>
                          )}
                          <div style={s.muscleInfo}>
                            <span style={s.muscleRowName}>{muscle}</span>
                            <span style={s.muscleRowCount}>{count} exercise{count > 1 ? 's' : ''}</span>
                          </div>
                          <div style={{ ...s.muscleBadge, background: cfg.light, color: cfg.color }}>
                            {Math.round((count / Object.values(muscleCount).reduce((a, b) => a + b, 0)) * 100)}%
                          </div>
                        </div>
                      )
                    })
                }
              </div>

              <div style={s.panel}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h2 style={{ ...s.panelTitle, margin: 0 }}>Recent Workouts</h2>
                  <button style={s.smallBtn} onClick={() => setView('create')}>+ New</button>
                </div>
                {loading && <p style={s.muted}>Loading...</p>}
                {!loading && workouts.length === 0 && (
                  <div style={s.emptyState}>
                    <p style={s.emptyText}>No workouts yet.</p>
                    <button style={s.emptyBtn} onClick={() => setView('create')}>Create your first workout</button>
                  </div>
                )}
                {workouts.slice(0, 3).map(w => (
                  <div key={w.id} style={s.workoutItem}
                    onClick={() => setExpandedId(expandedId === w.id ? null : w.id)}>
                    <div style={s.workoutItemHeader}>
                      <div>
                        <div style={s.workoutItemTitle}>{w.title}</div>
                        <div style={s.workoutItemMeta}>
                          {new Date(w.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                          {' · '}{w.workoutExercises.length} exercise{w.workoutExercises.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <span style={s.chevron}>{expandedId === w.id ? '▲' : '▼'}</span>
                    </div>
                    {expandedId === w.id && w.workoutExercises.length > 0 && (
                      <div style={s.workoutExpanded}>
                        <div style={s.exHeader}><span>Exercise</span><span>Sets</span><span>Reps</span><span>Weight</span></div>
                        {w.workoutExercises.map((e, i) => <ExRow key={i} e={e} />)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── WORKOUTS ── */}
        {view === 'workouts' && (
          <>
            <div style={s.pageHeader}>
              <div>
                <h1 style={s.pageTitle}>Workouts</h1>
                <p style={s.pageSubtitle}>{workouts.length} sessions logged</p>
              </div>
              <button style={s.primaryBtn} onClick={() => setView('create')}>+ New Workout</button>
            </div>
            {workouts.length === 0 && (
              <div style={{ ...s.panel, textAlign: 'center', padding: '3rem' }}>
                <p style={s.muted}>No workouts yet.</p>
                <button style={s.primaryBtn} onClick={() => setView('create')}>Create your first workout</button>
              </div>
            )}
            {workouts.map(w => (
              <div key={w.id} style={{ ...s.panel, marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: '#0a0f1e' }}>{w.title}</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>
                      {new Date(w.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {w.notes && <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>{w.notes}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ ...s.muscleBadge, background: '#f1f5f9', color: '#64748b' }}>
                      {w.workoutExercises.length} exercise{w.workoutExercises.length !== 1 ? 's' : ''}
                    </span>
                    <button style={s.deleteBtn} onClick={() => deleteWorkout(w.id, w.title)}>
                      Delete
                    </button>
                  </div>
                </div>
                {w.workoutExercises.length > 0 && (
                  <>
                    <div style={s.exHeader}><span>Exercise</span><span>Sets</span><span>Reps</span><span>Weight</span></div>
                    {w.workoutExercises.map((e, i) => <ExRow key={i} e={e} />)}
                  </>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── EXERCISES ── */}
        {view === 'exercises' && (
          <>
            <div style={s.pageHeader}>
              <div>
                <h1 style={s.pageTitle}>Exercises</h1>
                <p style={s.pageSubtitle}>{exercises.length} exercises in library</p>
              </div>
            </div>
            <div style={{ ...s.panel, marginBottom: '1.5rem' }}>
              <h2 style={s.panelTitle}>Add New Exercise</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'flex-end' }}>
                <div>
                  <label style={s.label}>Exercise Name</label>
                  <input style={s.input} placeholder="e.g. Incline Bench Press"
                    value={exName} onChange={e => setExName(e.target.value)} />
                </div>
                <div>
                  <label style={s.label}>Muscle Group</label>
                  <select style={s.input} value={exMuscle} onChange={e => setExMuscle(e.target.value)}>
                    {['Chest','Back','Legs','Shoulders','Arms','Core'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <button style={{ ...s.primaryBtn, opacity: savingEx ? 0.7 : 1 }}
                  onClick={saveExercise} disabled={savingEx}>
                  {savingEx ? 'Saving...' : 'Add'}
                </button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {exercises.map(ex => {
                const cfg = MUSCLE[ex.muscleGroup] || { color: '#64748b', light: 'rgba(100,116,139,0.1)' }
                const img = EXERCISE_IMGS[ex.name] || MUSCLE_IMGS[ex.muscleGroup] || ''
                return (
                  <div key={ex.id} style={{ ...s.panel, padding: '0', overflow: 'hidden' }}>
                    <img src={img} alt={ex.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                    <div style={{ padding: '12px' }}>
                      <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 600, color: '#0a0f1e' }}>{ex.name}</p>
                      <span style={{ ...s.exTag, background: cfg.light, color: cfg.color }}>{ex.muscleGroup}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ── CREATE WORKOUT ── */}
        {view === 'create' && (
          <>
            <div style={s.pageHeader}>
              <div>
                <h1 style={s.pageTitle}>{wId ? 'Log Exercises' : 'New Workout'}</h1>
                <p style={s.pageSubtitle}>{wId ? `Adding to: ${wTitle}` : 'Create a new training session'}</p>
              </div>
            </div>
            {!wId ? (
              <div style={{ ...s.panel, maxWidth: '500px' }}>
                <h2 style={s.panelTitle}>Workout Details</h2>
                <label style={s.label}>Workout Title</label>
                <input style={s.input} placeholder="e.g. Monday Push Day"
                  value={wTitle} onChange={e => setWTitle(e.target.value)} />
                <label style={{ ...s.label, marginTop: '1rem' }}>Notes (optional)</label>
                <input style={s.input} placeholder="e.g. Felt strong today"
                  value={wNotes} onChange={e => setWNotes(e.target.value)} />
                <button style={{ ...s.primaryBtn, marginTop: '1.5rem', opacity: creating ? 0.7 : 1 }}
                  onClick={createWorkout} disabled={creating || !wTitle.trim()}>
                  {creating ? 'Creating...' : 'Create Workout →'}
                </button>
              </div>
            ) : (
              <div style={s.twoCol}>
                <div style={s.panel}>
                  <h2 style={s.panelTitle}>Add Exercise</h2>
                  <label style={s.label}>Select Exercise</label>
                  <select style={s.input} value={selEx} onChange={e => setSelEx(e.target.value)}>
                    <option value="">Choose an exercise...</option>
                    {exercises.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscleGroup})</option>
                    ))}
                  </select>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '1rem' }}>
                    <div>
                      <label style={s.label}>Sets</label>
                      <input style={s.input} type="number" min="1" value={sets} onChange={e => setSets(e.target.value)} />
                    </div>
                    <div>
                      <label style={s.label}>Reps</label>
                      <input style={s.input} type="number" min="1" value={reps} onChange={e => setReps(e.target.value)} />
                    </div>
                    <div>
                      <label style={s.label}>Weight (kg)</label>
                      <input style={s.input} type="number" min="0" value={weight} onChange={e => setWeight(e.target.value)} />
                    </div>
                  </div>
                  <button style={{ ...s.primaryBtn, marginTop: '1.25rem', opacity: addingEx ? 0.7 : 1 }}
                    onClick={addExercise} disabled={addingEx || !selEx}>
                    {addingEx ? 'Adding...' : '+ Add Exercise'}
                  </button>
                  <button style={{ ...s.ghostBtn, marginTop: '10px' }} onClick={finishWorkout}>
                    Finish Workout ✓
                  </button>
                </div>
                <div style={s.panel}>
                  <h2 style={s.panelTitle}>Exercises Added ({wExercises.length})</h2>
                  {wExercises.length === 0 && <p style={s.muted}>No exercises added yet.</p>}
                  {wExercises.map((e, i) => {
                    const cfg = MUSCLE[e.exercise.muscleGroup]
                    return (
                      <div key={i} style={{ ...s.workoutItem, cursor: 'default' }}>
                        <div style={s.workoutItemHeader}>
                          <div>
                            <div style={s.workoutItemTitle}>{e.exercise.name}</div>
                            <div style={s.workoutItemMeta}>{e.sets} sets · {e.reps} reps · {e.weight}kg</div>
                          </div>
                          <span style={{ ...s.exTag, background: cfg?.light, color: cfg?.color }}>
                            {e.exercise.muscleGroup}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page:         { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', system-ui, sans-serif" },
  sidebar:      { width: '220px', backgroundColor: '#0a0f1e', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
  sideTop:      { padding: '1.5rem 1.5rem 1rem' },
  sideLogo:     { fontSize: '13px', fontWeight: 800, letterSpacing: '3px', color: '#ffffff' },
  sideNav:      { flex: 1, padding: '0.5rem' },
  sideItem:     { padding: '10px 12px', borderRadius: '8px', color: '#64748b', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: '2px' },
  sideActive:   { background: 'rgba(255,255,255,0.08)', color: '#ffffff' },
  sideCreate:   { marginTop: '8px', background: '#3b82f6', color: 'white', borderRadius: '8px', fontWeight: 600 },
  sideBottom:   { padding: '1rem', borderTop: '0.5px solid rgba(255,255,255,0.06)' },
  sideUser:     { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  sideAvatar:   { width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0 },
  sideUserName: { fontSize: '13px', fontWeight: 600, color: '#f8fafc' },
  sideUserEmail:{ fontSize: '11px', color: '#475569', marginTop: '1px' },
  sideLogout:   { width: '100%', padding: '8px', background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '13px', cursor: 'pointer' },
  main:         { flex: 1, padding: '2rem', overflowY: 'auto' },
  pageHeader:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' },
  pageTitle:    { fontSize: '1.75rem', fontWeight: 800, color: '#0a0f1e', margin: '0 0 4px' },
  pageSubtitle: { fontSize: '14px', color: '#9ca3af', margin: 0 },
  headerDate:   { fontSize: '13px', color: '#9ca3af', paddingTop: '6px' },
  statsGrid:    { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' },
  statCard:     { background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.06)', borderRadius: '14px', padding: '1.25rem' },
  statDot:      { width: '8px', height: '8px', borderRadius: '50%', marginBottom: '1rem' },
  statValue:    { fontSize: '2rem', fontWeight: 800, marginBottom: '4px' },
  statName:     { fontSize: '14px', fontWeight: 600, color: '#0a0f1e', marginBottom: '2px' },
  statUnit:     { fontSize: '12px', color: '#9ca3af' },
  twoCol:       { display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem' },
  panel:        { background: '#ffffff', border: '0.5px solid rgba(0,0,0,0.06)', borderRadius: '16px', padding: '1.5rem' },
  panelTitle:   { fontSize: '15px', fontWeight: 700, color: '#0a0f1e', margin: '0 0 1.25rem' },
  muted:        { color: '#9ca3af', fontSize: '14px' },
  muscleRow:    { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' },
  muscleThumb:  { width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 },
  muscleThumbImg: { width: '100%', height: '100%', objectFit: 'cover' },
  muscleInfo:   { flex: 1 },
  muscleRowName:  { display: 'block', fontSize: '14px', fontWeight: 600, color: '#0a0f1e' },
  muscleRowCount: { display: 'block', fontSize: '12px', color: '#9ca3af' },
  muscleBadge:  { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 },
  emptyState:   { textAlign: 'center', padding: '2rem' },
  emptyText:    { color: '#374151', fontWeight: 600, margin: '0 0 12px' },
  emptyBtn:     { padding: '10px 20px', background: '#0a0f1e', border: 'none', borderRadius: '8px', color: 'white', fontSize: '14px', cursor: 'pointer' },
  workoutItem:  { border: '0.5px solid rgba(0,0,0,0.06)', borderRadius: '12px', marginBottom: '10px', overflow: 'hidden', cursor: 'pointer' },
  workoutItemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px' },
  workoutItemTitle: { fontSize: '14px', fontWeight: 600, color: '#0a0f1e', marginBottom: '2px' },
  workoutItemMeta:  { fontSize: '12px', color: '#9ca3af' },
  chevron:      { fontSize: '10px', color: '#9ca3af' },
  workoutExpanded: { borderTop: '0.5px solid rgba(0,0,0,0.06)', padding: '12px 14px' },
  exHeader:     { display: 'grid', gridTemplateColumns: '2fr 0.5fr 0.5fr 0.7fr', fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', paddingBottom: '8px', marginBottom: '4px', borderBottom: '0.5px solid rgba(0,0,0,0.05)' },
  exRow:        { display: 'grid', gridTemplateColumns: '2fr 0.5fr 0.5fr 0.7fr', padding: '7px 0', borderBottom: '0.5px solid rgba(0,0,0,0.04)', alignItems: 'center' },
  exStat:       { fontSize: '13px', color: '#64748b', textAlign: 'center' },
  exTag:        { padding: '2px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: 600 },
  label:        { display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' },
  input:        { display: 'block', width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#0a0f1e', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fafafa' },
  primaryBtn:   { padding: '10px 20px', background: '#0a0f1e', border: 'none', borderRadius: '10px', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
  ghostBtn:     { display: 'block', width: '100%', padding: '10px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: '10px', color: '#374151', fontSize: '14px', cursor: 'pointer' },
  smallBtn:     { padding: '6px 14px', background: '#0a0f1e', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
  deleteBtn:    { padding: '6px 12px', background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#ef4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer' },
}