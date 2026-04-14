import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchJoinersList, removeJoinerFromList, addJoinersToList } from '../utils/joinersFirestore';

export default function JoinersPage() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchJoinersList();
    setList(data);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const searchTerm = search.trim().toLowerCase();
  const filtered = searchTerm
    ? list
        .map((j) => ({
          joiner: j,
          match: ((j.name || '') + ' ' + (j.lastname || '')).toLowerCase().includes(searchTerm),
        }))
        .filter((x) => x.match)
    : list.map((j) => ({ joiner: j }));

  const removeJoiner = async (id) => {
    await removeJoinerFromList(id);
    setList((prev) => prev.filter((j) => j.id !== id));
  };

  const clearSearch = () => {
    setSearch('');
  };

  const sampleGuests = [
    { name: 'Alex', lastname: 'Smith' },
    { name: 'Jordan', lastname: 'Lee' },
    { name: 'Sam', lastname: 'Taylor' },
    { name: 'Casey', lastname: 'Brown' },
    { name: 'Riley', lastname: 'Davis' },
  ];

  const handleGenerateGuests = async () => {
    await addJoinersToList(sampleGuests);
    await load();
  };

  const countText =
    list.length === 0
      ? '0 joiners'
      : searchTerm && list.length > 0
        ? filtered.length === 0
          ? 'No matches'
          : filtered.length === 1
            ? `1 of ${list.length} joiner`
            : `${filtered.length} of ${list.length} joiners`
        : list.length === 1
          ? '1 joiner'
          : `${list.length} joiners`;

  const showEmpty =
    list.length === 0 || (searchTerm && filtered.length === 0);
  const emptyText =
    searchTerm && filtered.length === 0 && list.length > 0
      ? 'No joiners match your search.'
      : 'No joiners yet.';

  if (loading) {
    return (
      <div className="page joiners-page">
        <div className="space-bg" />
        <main className="card" style={{ padding: '28px 24px' }}>
          <p className="count">Loading joiners…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="page joiners-page">
      <div className="space-bg" />
      <main className="card" style={{ padding: '28px 24px' }}>
        <Link to="/" className="back">
          ← Back to invitation
        </Link>
        <h1>Joiners list</h1>
        <p className="count">{countText}</p>
        <button
          type="button"
          className="btn-generate-guests"
          onClick={handleGenerateGuests}
          title="Add sample guests for testing"
        >
          Generate guests
        </button>
        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">
            &#128269;
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name..."
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className={`search-clear ${search.trim() ? 'is-visible' : ''}`}
            aria-label="Clear search"
            title="Clear search"
            onClick={clearSearch}
          >
            &#215;
          </button>
        </div>
        <div className="list-wrap">
          <ul className="list">
            {filtered.map(({ joiner }) => (
              <li key={joiner.id}>
                <span className="joiner-name">
                  {joiner.name || ''} {joiner.lastname || ''}
                </span>
                <button
                  type="button"
                  className="joiner-remove"
                  aria-label="Remove joiner"
                  onClick={() => removeJoiner(joiner.id)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
        <p className="empty" style={{ display: showEmpty ? 'block' : 'none' }}>
          {emptyText}
        </p>
      </main>
    </div>
  );
}
