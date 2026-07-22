import { useEffect, useState } from 'react';
import { api } from './api';
import CountryTraffic from './components/CountryTraffic';
import VehicleDistribution from './components/VehicleDistribution';
import AddRecord from './components/AddRecord';

export default function Dashboard({ username, onLogout }) {
  const [byCountry, setByCountry] = useState([]);
  const [byVehicle, setByVehicle] = useState([]);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setError('');
    try {
      const country = await api('/api/traffic/by-country');
      const vehicle = await api('/api/traffic/by-vehicle');
      const traffic = await api('/api/traffic');

      setByCountry(country.map((r) => ({ ...r, total: Number(r.total) })));
      setByVehicle(vehicle.map((r) => ({ ...r, total: Number(r.total) })));
      setRows(traffic);
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        onLogout();
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <p className="page-msg">Loading...</p>;
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1>Traffic Data</h1>
        <div className="topbar-right">
          <span className="muted">{username}</span>
          <button type="button" className="btn-secondary" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {error && <p className="error banner">{error}</p>}

      <section className="charts">
        <CountryTraffic data={byCountry} />
        <VehicleDistribution data={byVehicle} />
      </section>

      <AddRecord rows={rows} reload={loadData} logout={onLogout} setError={setError} />
    </div>
  );
}
