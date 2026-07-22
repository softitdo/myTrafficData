import { useState } from 'react';
import { api } from '../api';

const emptyForm = {
  country: '',
  vehicle_type: 'car',
  count: '',
  recorded_at: '',
};

export default function AddRecord({ rows, reload, logout, setError }) {
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  function startEdit(row) {
    setEditId(row.id);
    setForm({
      country: row.country,
      vehicle_type: row.vehicle_type,
      count: String(row.count),
      recorded_at: row.recorded_at ? String(row.recorded_at).slice(0, 16) : '',
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const body = {
      country: form.country.trim(),
      vehicle_type: form.vehicle_type,
      count: Number(form.count),
      recorded_at: form.recorded_at || undefined,
    };

    try {
      if (editId) {
        await api('/api/traffic/' + editId, {
          method: 'PUT',
          body: JSON.stringify(body),
        });
      } else {
        await api('/api/traffic', {
          method: 'POST',
          body: JSON.stringify(body),
        });
      }
      cancelEdit();
      await reload();
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        logout();
        return;
      }
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this record?')) return;

    try {
      await api('/api/traffic/' + id, { method: 'DELETE' });
      if (editId === id) cancelEdit();
      await reload();
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        logout();
        return;
      }
      setError(err.message);
    }
  }

  return (
    <section className="records">
      <h2>{editId ? 'Edit record' : 'Add record'}</h2>
      <form className="record-form" onSubmit={handleSubmit}>
        <label>
          Country
          <input
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            required
          />
        </label>
        <label>
          Vehicle type
          <select
            value={form.vehicle_type}
            onChange={(e) => setForm({ ...form, vehicle_type: e.target.value })}
          >
            <option value="car">car</option>
            <option value="truck">truck</option>
            <option value="motorcycle">motorcycle</option>
            <option value="bus">bus</option>
            <option value="bicycle">bicycle</option>
            <option value="other">other</option>
          </select>
        </label>
        <label>
          Count
          <input
            type="number"
            min="0"
            value={form.count}
            onChange={(e) => setForm({ ...form, count: e.target.value })}
            required
          />
        </label>
        <label>
          Date
          <input
            type="datetime-local"
            value={form.recorded_at}
            onChange={(e) => setForm({ ...form, recorded_at: e.target.value })}
          />
        </label>
        <div className="form-actions">
          <button type="submit">{editId ? 'Save' : 'Add'}</button>
          {editId && (
            <button type="button" className="btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Records</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Country</th>
              <th>Vehicle</th>
              <th>Count</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.country}</td>
                <td>{row.vehicle_type}</td>
                <td>{row.count}</td>
                <td>
                  {row.recorded_at
                    ? String(row.recorded_at).replace('T', ' ').slice(0, 19)
                    : ''}
                </td>
                <td className="row-actions">
                  <button type="button" className="link-btn" onClick={() => startEdit(row)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="link-btn danger"
                    onClick={() => handleDelete(row.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
