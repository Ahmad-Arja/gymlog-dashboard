import { useNavigate } from 'react-router-dom'

const HERO_IMG = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1800&q=90'
const FEATURE_IMGS = [
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&q=80',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
]

const MUSCLES = [
  { name: 'Chest',     img: 'https://static.bodyspec.com/tr/4d/d0/4dd012ca7aba1bab?w=1536&h=690&f=jpg' },
  { name: 'Back',      img: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=300&q=80' },
  { name: 'Legs',      img: 'https://cdn.shopify.com/s/files/1/0723/5334/9921/files/ChatGPT_Image_Jul_29_2025_08_52_10_PM_1024x1024.webp?v=1753836789' },
  { name: 'Shoulders', img: 'https://liftmanual.com/wp-content/uploads/2026/05/best-shoulder-workouts-with-dumbbells.jpg' },
  { name: 'Arms',      img: 'https://www.dmoose.com/cdn/shop/articles/dumbbell_arm_exercises_cc9c6157-0642-455e-a0d9-6c78d9cb2481.png?v=1776261951' },
  { name: 'Core',      img: 'https://dumbbellsdirect.com/cdn/shop/articles/Barbell_Ab_Workout__Strengthen_Your_Core_With_Powerful_Loaded_Movements_800x800.jpg?v=1777450298' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <span style={s.navLogo}>GYMLOG</span>
        <div style={s.navLinks}>
          <button style={s.navGhost} onClick={() => navigate('/login')}>Login</button>
          <button style={s.navPrimary} onClick={() => navigate('/login')}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ ...s.hero, backgroundImage: `url(${HERO_IMG})` }}>
        <div style={s.heroOverlay} />
        <div style={s.heroInner}>
          <p style={s.heroEyebrow}>Workout Tracker</p>
          <h1 style={s.heroH1}>Train hard.<br />Track smarter.</h1>
          <p style={s.heroP}>Log every rep. Track every PR.<br />See your progress over time.</p>
          <div style={s.heroBtns}>
            <button style={s.btnWhite} onClick={() => navigate('/login')}>Start Tracking</button>
            <button style={s.btnGhost} onClick={() => navigate('/login')}>Sign In →</button>
          </div>
        </div>
        <div style={s.heroScroll}>↓</div>
      </section>

      {/* Stats bar */}
      <section style={s.statsSection}>
        {[
          ['REST API',    'Production-grade Node.js backend'],
          ['PostgreSQL',  'Relational database with Prisma ORM'],
          ['JWT Auth',    'Secure stateless authentication'],
          ['15/15',       'Integration tests passing'],
        ].map(([val, label]) => (
          <div key={val} style={s.statItem}>
            <div style={s.statVal}>{val}</div>
            <div style={s.statLabel}>{label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={s.featSection}>
        <p style={s.sectionEye}>Features</p>
        <h2 style={s.sectionH2}>Everything you need to track your training</h2>
        <div style={s.featGrid}>
          {[
            { title: 'Log Workouts',  desc: 'Create workout sessions and add exercises with sets, reps and weight.', img: FEATURE_IMGS[0] },
            { title: 'Track Progress', desc: 'View your full workout history with exercises nested inside each session.', img: FEATURE_IMGS[1] },
            { title: 'Secure & Private', desc: 'JWT authentication — your data is private and belongs only to you.', img: FEATURE_IMGS[2] },
            { title: 'Any Device',    desc: 'React dashboard works on any device. Access your data anywhere.', img: FEATURE_IMGS[3] },
          ].map(f => (
            <div key={f.title} style={s.featCard}>
              <div style={s.featImgWrap}>
                <img src={f.img} alt={f.title} style={s.featImg} />
              </div>
              <div style={s.featBody}>
                <h3 style={s.featTitle}>{f.title}</h3>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Muscle Groups */}
      <section style={s.muscleSection}>
        <p style={s.sectionEyeLight}>Muscle Groups</p>
        <h2 style={s.sectionH2Light}>Track every part of your body</h2>
        <div style={s.muscleGrid}>
          {MUSCLES.map(m => (
            <div key={m.name} style={s.muscleCard}>
              <img src={m.img} alt={m.name} style={s.muscleImg} />
              <div style={s.muscleOverlay} />
              <span style={s.muscleName}>{m.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <h2 style={s.ctaH2}>Ready to start lifting smarter?</h2>
        <p style={s.ctaP}>Join GymLog and take control of your training today.</p>
        <button style={s.btnWhiteLg} onClick={() => navigate('/login')}>Get Started — Free</button>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <span style={s.footerLogo}>GYMLOG</span>
        <span style={s.footerText}>Built by Ahmad Arja · Macquarie University · COMP4060 · 2026</span>
      </footer>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: '#ffffff', color: '#0a0f1e', margin: 0 },

  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 3rem', height: '64px',
    backgroundColor: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '0.5px solid rgba(0,0,0,0.08)',
  },
  navLogo:    { fontSize: '15px', fontWeight: 800, letterSpacing: '3px', color: '#0a0f1e' },
  navLinks:   { display: 'flex', gap: '10px' },
  navGhost: {
    padding: '8px 18px', background: 'transparent',
    border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: '8px',
    color: '#374151', fontSize: '14px', cursor: 'pointer',
  },
  navPrimary: {
    padding: '8px 18px', background: '#0a0f1e', border: 'none',
    borderRadius: '8px', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },

  hero: {
    position: 'relative', minHeight: '100vh',
    backgroundSize: 'cover', backgroundPosition: 'center',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    paddingTop: '64px',
  },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to bottom, rgba(6,9,16,0.75) 0%, rgba(6,9,16,0.55) 60%, rgba(6,9,16,0.85) 100%)',
  },
  heroInner:   { position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 2rem', maxWidth: '800px' },
  heroEyebrow: { fontSize: '12px', fontWeight: 600, letterSpacing: '4px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '1.5rem' },
  heroH1:      { fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-2px' },
  heroP:       { fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '2.5rem' },
  heroBtns:    { display: 'flex', gap: '12px', justifyContent: 'center' },
  btnWhite: {
    padding: '14px 32px', background: '#ffffff', border: 'none',
    borderRadius: '10px', color: '#0a0f1e', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
  },
  btnGhost: {
    padding: '14px 32px', background: 'transparent',
    border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px',
    color: '#ffffff', fontSize: '15px', cursor: 'pointer',
  },
  heroScroll: {
    position: 'absolute', bottom: '2rem', left: '50%',
    transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.4)',
    fontSize: '20px', zIndex: 1,
  },

  statsSection: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    borderBottom: '0.5px solid rgba(0,0,0,0.08)',
    borderTop: '0.5px solid rgba(0,0,0,0.08)',
  },
  statItem: {
    padding: '2.5rem 2rem', textAlign: 'center',
    borderRight: '0.5px solid rgba(0,0,0,0.08)',
  },
  statVal:   { fontSize: '1.5rem', fontWeight: 800, color: '#0a0f1e', marginBottom: '6px' },
  statLabel: { fontSize: '13px', color: '#9ca3af' },

  featSection: { padding: '6rem 3rem', maxWidth: '1200px', margin: '0 auto' },
  sectionEye:  { fontSize: '12px', fontWeight: 600, letterSpacing: '3px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '1rem' },
  sectionH2:   { fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#0a0f1e', marginBottom: '3rem', maxWidth: '500px', lineHeight: 1.2 },
  featGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' },
  featCard:    { border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: '16px', overflow: 'hidden', background: '#fafafa' },
  featImgWrap: { height: '180px', overflow: 'hidden' },
  featImg:     { width: '100%', height: '100%', objectFit: 'cover' },
  featBody:    { padding: '1.25rem' },
  featTitle:   { fontSize: '15px', fontWeight: 700, color: '#0a0f1e', marginBottom: '6px' },
  featDesc:    { fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 },

  muscleSection:   { backgroundColor: '#0a0f1e', padding: '6rem 3rem' },
  sectionEyeLight: { fontSize: '12px', fontWeight: 600, letterSpacing: '3px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '1rem' },
  sectionH2Light:  { fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#ffffff', marginBottom: '3rem', lineHeight: 1.2 },
  muscleGrid:  { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', maxWidth: '1100px', margin: '0 auto' },
  muscleCard:  { position: 'relative', borderRadius: '14px', overflow: 'hidden', height: '200px', cursor: 'pointer' },
  muscleImg:   { width: '100%', height: '100%', objectFit: 'cover' },
  muscleOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%)' },
  muscleName:  { position: 'absolute', bottom: '1rem', left: '1rem', color: 'white', fontWeight: 700, fontSize: '14px', letterSpacing: '1px' },

  ctaSection: {
    padding: '8rem 2rem', textAlign: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  },
  ctaH2: { fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#0a0f1e', marginBottom: '1rem' },
  ctaP:  { fontSize: '1rem', color: '#6b7280', marginBottom: '2rem' },
  btnWhiteLg: {
    padding: '16px 40px', background: '#0a0f1e', border: 'none',
    borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
  },

  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1.5rem 3rem', borderTop: '0.5px solid rgba(0,0,0,0.08)',
  },
  footerLogo: { fontSize: '13px', fontWeight: 800, letterSpacing: '2px', color: '#0a0f1e' },
  footerText: { fontSize: '12px', color: '#9ca3af' },
}