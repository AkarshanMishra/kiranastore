import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('REACT CRASH:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#fff', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'sans-serif', padding: '2rem', color: '#333'
        }}>
          <h1 style={{ color: '#e11d48', fontSize: '1.5rem', marginBottom: '1rem' }}>
            ⚠️ KiranaStore App Error
          </h1>
          <pre style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.75rem',
            padding: '1rem', fontSize: '0.75rem', maxWidth: '600px', whiteSpace: 'pre-wrap',
            color: '#991b1b'
          }}>
            {String(this.state.error)}
          </pre>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
            Check browser console (F12) for full stack trace.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '1rem', background: '#16a34a', color: 'white',
              border: 'none', padding: '0.75rem 2rem', borderRadius: '0.75rem',
              fontWeight: 'bold', cursor: 'pointer', fontSize: '0.875rem'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)
