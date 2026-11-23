import { useState } from 'react'
import { OFFICES_API } from '../../api.js'

function Office() {
  const [name, setName] = useState('')
  const [officeNumber, setOfficeNumber] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !officeNumber) {
      alert('Please fill in the office name and number.')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`${OFFICES_API}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          officeNumber: Number(officeNumber),
        }),
      })
      if (res.ok) {
        alert('Office saved successfully!')
        setName('')
        setOfficeNumber('')
      } else {
        
        alert(await res.text())
      }
    } catch {
      alert('Could not reach the server. Is the backend running on port 1014?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <h1>Save office</h1>
      <form className="office-form" onSubmit={handleSubmit}>
        <label htmlFor="office-name">Office Name:</label>
        <input
          id="office-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="office-number">Office Number:</label>
        <input
          id="office-number"
          type="number"
          min="1"
          value={officeNumber}
          onChange={(e) => setOfficeNumber(e.target.value)}
        />

        <div>
          <button type="submit" disabled={saving}>
            {saving ? 'SAVING…' : 'SAVE OFFICE'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Office
