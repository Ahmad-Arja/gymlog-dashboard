import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

interface Exercise {
  exercise: { name: string; muscleGroup: string }
  sets: number
  reps: number
  weight: number
}

interface Workout {
  id: number
  title: string
  date: string
  notes: string
  workoutExercises: Exercise[]
}

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await API.get('/workouts')
        setWorkouts(res.data)
      } catch {
        setError('Failed to load workouts')
      } finally {
        setLoading(false)
      }
    }
    fetchWorkouts()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏋️ GymLog</h1>
        <div style={styles.headerRight}>
          <span style={styles.welcome}>Welcome, {user.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        <h2 style={styles.sectionTitle}>Your Workouts</h2>
        {loading && <p style={styles.muted}>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {!loading && workouts.length === 0 && (
          <p style={styles.muted}>No workouts yet. Start logging!</p>
        )}
        {workouts.map(workout => (
          <div key={workout.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.workoutTitle}>{workout.title}</h3>
              <span style={styles.date}>
                {new Date(workout.date).toLocaleDateString()}
              </span>
            </div>
            {workout.notes && (
              <p style={styles.notes}>{workout.notes}</p>
            )}
            {workout.workoutExercises.length > 0 && (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Exercise</th>
                    <th style={styles.th}>Muscle</th>
                    <th style={styles.th}>Sets</th>
                    <th style={styles.th}>Reps</th>
                    <th style={styles.th}>Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {workout.workoutExercises.map((we, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{we.exercise.name}</td>
                      <td style={styles.td}>{we.exercise.muscleGroup}</td>
                      <td style={styles.td}>{we.sets}</td>
                      <td style={styles.td}>{we.reps}</td>
                      <td style={styles.td}>{we.weight}kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: { minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 2rem', backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
  },
  title: { color: '#f8fafc', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  welcome: { color: '#94a3b8' },
  logoutBtn: {
    padding: '0.5rem 1rem', backgroundColor: '#ef4444',
    color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer',
  },
  content: { padding: '2rem', maxWidth: '900px', margin: '0 auto' },
  sectionTitle: { color: '#f8fafc', marginBottom: '1.5rem' },
  muted: { color: '#94a3b8' },
  error: { color: '#ef4444' },
  card: {
    backgroundColor: '#1e293b', borderRadius: '12px',
    padding: '1.5rem', marginBottom: '1.5rem',
    border: '1px solid #334155',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  workoutTitle: { color: '#f8fafc', margin: 0 },
  date: { color: '#94a3b8', fontSize: '0.875rem' },
  notes: { color: '#94a3b8', marginBottom: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '1rem' },
  th: { textAlign: 'left', padding: '0.5rem', color: '#94a3b8', borderBottom: '1px solid #334155', fontSize: '0.875rem' },
  td: { padding: '0.5rem', color: '#f8fafc', borderBottom: '1px solid #1e293b', fontSize: '0.875rem' },
}