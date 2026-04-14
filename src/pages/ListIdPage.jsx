import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LIST_AUTH_KEY, LIST_ACCESS_SECRET } from '../utils/storage';
import { fetchJoinersList, removeJoinerFromList } from '../utils/joinersFirestore';

export default function ListIdPage() {
  const [authorized, setAuthorized] = useState(false);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let ok = false;
    try {
      if (sessionStorage.getItem(LIST_AUTH_KEY) === LIST_ACCESS_SECRET) ok = true;
      if (searchParams.get('key') === LIST_ACCESS_SECRET) ok = true;
      const hash = window.location.hash.slice(1);
      if (new URLSearchParams(hash).get('key') === LIST_ACCESS_SECRET) ok = true;
    } catch (e) {}
    if (!ok) {
      navigate('/', { replace: true });
      return;
    }
    try {
      sessionStorage.setItem(LIST_AUTH_KEY, LIST_ACCESS_SECRET);
    } catch (e) {}
    setAuthorized(true);
  }, [navigate, searchParams]);

  const load = useCallback(async () => {
    const data = await fetchJoinersList();
    setList(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authorized) load();
  }, [authorized, load]);

  const removeJoiner = async (id) => {
    await removeJoinerFromList(id);
    setList((prev) => prev.filter((j) => j.id !== id));
  };

  if (!authorized) return null;

  if (loading) {
    return (
      <div id="listid" className="page list-page">
        <div className="space-bg" />
        <main className="card" style={{ padding: '28px 24px' }}>
          <p className="count">Loading list…</p>
        </main>
      </div>
    );
  }

  return (
    <div id="listid" className="page list-page">
      <div className="space-bg" />
      <main className="card" style={{ padding: '28px 24px' }}>
        <Link to="/" className="back">
          ← Back to invitation
        </Link>
        <h1>List</h1>
        <div className="list-wrap">
          <ul className="list">
            {list.map((j) => (
              <li key={j.id}>
                <span className="joiner-name">
                  {j.name || ''} {j.lastname || ''}
                </span>
                <button
                  type="button"
                  className="joiner-remove"
                  aria-label="Remove joiner"
                  onClick={() => removeJoiner(j.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="empty" style={{ display: list.length ? 'none' : 'block' }}>
          No joiners in this list.
        </p>
      </main>
    </div>
  );
}
