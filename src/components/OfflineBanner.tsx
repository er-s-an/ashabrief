import { useEffect, useState } from 'react'

export function OfflineBanner() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  return (
    <div className={`net-banner ${online ? 'net-on' : 'net-off'}`} role="status">
      {online ? (
        <>
          <span className="dot" /> Network OK · briefs still generate <strong>fully offline</strong>
        </>
      ) : (
        <>
          <span className="dot" /> Weak / offline mode · lexicon engine + local CareHub queue active
        </>
      )}
    </div>
  )
}
