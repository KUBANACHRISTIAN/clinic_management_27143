import { useEffect, useState } from 'react'
import { OFFICES_API } from '../../api.js'

function AvailableOffices() {
  const [search, setSearch] = useState('')
  // Result of the last finished request, and which search text it was for
  const [result, setResult] = useState({ query: null, offices: [], error: '' })
  const [deletingId, setDeletingId] = useState(null)

  const query = search.trim()

  // Load offices whenever the search text changes.
  // Empty search -> GET /all, otherwise GET /search?name=...
  useEffect(() => {
    let ignore = false
    const url = query
      ? `${OFFICES_API}/search?name=${encodeURIComponent(query)}`
      : `${OFFICES_API}/all`

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!ignore) setResult({ query, offices: data, error: '' })
      })
      .catch(() => {
        if (!ignore) {
          setResult({
            query,
            offices: [],
            error: 'Could not load offices. Is the backend running on port 1014?',
          })
        }
      })

    // Ignore a slow, older response if the user has typed again
    return () => {
      ignore = true
    }
  }, [query])

  const loading = result.query === null // only true before the first load finishes
  const { offices, error } = result

  const handleDelete = async (office) => {
    const ok = window.confirm(
      `Delete office "${office.name}" (number ${office.officeNumber})?`,
    )
    if (!ok) return

    setDeletingId(office.id)
    try {
      const res = await fetch(`${OFFICES_API}/delete/${office.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setResult((r) => ({
          ...r,
          offices: r.offices.filter((o) => o.id !== office.id),
        }))
        alert('Office deleted successfully!')
      } else if (res.status === 404) {
        alert(await res.text())
      } else {
        alert('Could not delete this office. It may still be assigned to a doctor.')
      }
    } catch {
      alert('Could not reach the server. Is the backend running on port 1014?')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page">
      <h1>Available Offices</h1>

      <div className="search">
        <label htmlFor="office-search">Search:</label>
        <input
          id="office-search"
          type="text"
          placeholder="Office name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="office-table">
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>Office Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="4" className="table-message">Loading offices…</td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan="4" className="table-message error">{error}</td>
            </tr>
          )}

          {!loading && !error && offices.length === 0 && (
            <tr>
              <td colSpan="4" className="table-message">
                {query ? 'No offices match your search.' : 'No offices yet.'}
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            offices.map((office, index) => (
              <tr key={office.id}>
                {/* Row number; the real UUID shows on hover */}
                <td title={office.id}>{index + 1}</td>
                <td>{office.name}</td>
                <td>{office.officeNumber}</td>
                <td>
                  <button
                    type="button"
                    className="delete-btn"
                    disabled={deletingId === office.id}
                    onClick={() => handleDelete(office)}
                  >
                    {deletingId === office.id ? 'Deleting…' : 'Delete'}
                  </button>
                  <button
                    type="button"
                    className="update-btn"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default AvailableOffices
