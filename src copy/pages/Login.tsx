import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

const BG = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1400&q=90'

export default function Login() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (tab === 'register') {
        await API.post('/auth/register', { name, email, password })
      }
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      {/* Left panel — image */}
      <div style={{ ...s.left, backgroundImage: `url(${BG})` }}>
        <div style={s.leftOverlay} />
        <div style={s.leftContent}>
          <button style={s.backBtn} onClick={() => navigate('/')}>← Back</button>
          <div style={s.leftBottom}>
            <p style={s.leftEye}>Workout Tracker</p>
            <h2 style={s.leftH2}>Track every rep.<br />Every set.<br />Every PR.</h2>
            <div style={s.testimonial}>
              <p style={s.testimonialText}>"GymLog changed how I approach every session."</p>
              <p style={s.testimonialAuthor}>— Ahmad Arja, Builder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={s.right}>
        <div style={s.form}>
          <div style={s.logoRow}>
            <span style={s.logo}>GYMLOG</span>
          </div>

          <h2 style={s.formTitle}>
            {tab === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={s.formSub}>
            {tab === 'login'
              ? 'Sign in to access your dashboard'
              : 'Start your fitness journey today'}
          </p>

          {/* Tab switcher */}
          <div style={s.tabs}>
            <button
              style={{ ...s.tab, ...(tab === 'login' ? s.tabOn : {}) }}
              onClick={() => { setTab('login'); setError('') }}
            >Login</button>
            <button
              style={{ ...s.tab, ...(tab === 'register' ? s.tabOn : {}) }}
              onClick={() => { setTab('register'); setError('') }}
            >Register</button>
          </div>

          {error && <div style={s.errBox}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            {tab === 'register' && (
              <>
                <label style={s.label}>Full name</label>
                <input style={s.input} type="text" placeholder="Ahmad Arja"
                  value={name} onChange={e => setName(e.target.value)} required />
              </>
            )}
            <label style={s.label}>Email address</label>
            <input style={s.input} type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />

            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />

            <button style={{ ...s.submitBtn, opacity: loading ? 0.7 : 1 }}
              type="submit" disabled={loading}>
              {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={s.switchP}>
            {tab === 'login' ? "Don't have an account? " : 'Already registered? '}
            <span style={s.switchLink}
              onClick={() => { setTab(tab === 'login' ? 'register' : 'login'); setError('') }}>
              {tab === 'login' ? 'Register' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" },
  left: {
    flex: 1, position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', flexDirection: 'column',
  },
  leftOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(6,9,16,0.4) 0%, rgba(6,9,16,0.8) 100%)',
  },
  leftContent: {
    position: 'relative', zIndex: 1, padding: '2rem',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%',
  },
  backBtn: {
    alignSelf: 'flex-start', background: 'rgba(255,255,255,0.1)',
    border: '0.5px solid rgba(255,255,255,0.2)', color: 'white',
    padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
  },
  leftBottom: { paddingBottom: '2rem' },
  leftEye: { fontSize: '11px', letterSpacing: '3px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '1rem' },
  leftH2: { fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '2rem' },
  testimonial: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(10px)',
    border: '0.5px solid rgba(255,255,255,0.15)',
    borderRadius: '12px', padding: '1.25rem',
  },
  testimonialText: { fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', margin: '0 0 8px' },
  testimonialAuthor: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 },

  right: {
    width: '460px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '2rem',
    backgroundColor: '#ffffff',
  },
  form: { width: '100%', maxWidth: '380px' },
  logoRow: { marginBottom: '2.5rem' },
  logo: { fontSize: '14px', fontWeight: 800, letterSpacing: '3px', color: '#0a0f1e' },
  formTitle: { fontSize: '1.75rem', fontWeight: 800, color: '#0a0f1e', margin: '0 0 6px' },
  formSub: { fontSize: '14px', color: '#9ca3af', margin: '0 0 1.75rem' },

  tabs: {
    display: 'flex', background: '#f3f4f6',
    borderRadius: '10px', padding: '4px', marginBottom: '1.5rem',
  },
  tab: {
    flex: 1, padding: '9px', border: 'none', borderRadius: '8px',
    background: 'transparent', color: '#9ca3af',
    fontSize: '14px', fontWeight: 500, cursor: 'pointer',
  },
  tabOn: { background: '#ffffff', color: '#0a0f1e', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },

  errBox: {
    background: '#fef2f2', border: '0.5px solid #fca5a5',
    color: '#dc2626', padding: '10px 14px',
    borderRadius: '8px', fontSize: '13px', marginBottom: '1rem',
  },

  label: { display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px', marginTop: '1rem' },
  input: {
    display: 'block', width: '100%', padding: '11px 14px',
    border: '1px solid #e5e7eb', borderRadius: '10px',
    fontSize: '14px', color: '#0a0f1e', outline: 'none',
    boxSizing: 'border-box', backgroundColor: '#fafafa',
  },
  submitBtn: {
    display: 'block', width: '100%', marginTop: '1.5rem',
    padding: '13px', background: '#0a0f1e', border: 'none',
    borderRadius: '10px', color: 'white', fontSize: '15px',
    fontWeight: 700, cursor: 'pointer',
  },
  switchP: { textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '1.5rem' },
  switchLink: { color: '#0a0f1e', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' },
}