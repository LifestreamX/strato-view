export default function HealthCheck() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a1e',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          ✅ NeoView Health Check
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#c084fc' }}>
          App is running successfully!
        </p>
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#a78bfa' }}>
          Timestamp: {new Date().toISOString()}
        </p>
        <div style={{ marginTop: '2rem' }}>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(to right, #9333ea, #ec4899)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              marginRight: '1rem',
            }}
          >
            Go to Home
          </a>
          <a
            href="/asteroids"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(to right, #9333ea, #ec4899)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
            }}
          >
            Explore Asteroids
          </a>
        </div>
      </div>
    </div>
  )
}
