import { useState, useEffect } from "react";
import LemmaLink from "../components/LemmaLink";

export default function Search() {
  const [data, setData] = useState<{
    lemmata: any[];
    languages: { language_id: number; label: string }[];
  } | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<"original" | "transliteration" | "primary_meaning">(
    "original"
  );

  // Load data.json in the browser
  useEffect(() => {
    fetch("/data.json")
      .then(r => r.json())
      .then(d => {
        setData(d);
        setSelectedLangs(d.languages.map((l: any) => l.language_id));
      });
  }, []);

  // Filter and sort results dynamically
  useEffect(() => {
    if (!data) return;

    // If query is empty, show all lemmata in selected languages
    const filtered = data.lemmata.filter(
      l => selectedLangs.includes(l.language_id) &&
        // Only filter by query if query exists
        (!query || [l.original, l.transliteration, l.primary_meaning].some(f =>
                                                                           f?.toLowerCase().includes(query.toLowerCase())
                                                                          ))
    );

    setResults(filtered.sort((a, b) => a[sortBy].localeCompare(b[sortBy])));
  }, [query, selectedLangs, sortBy, data]);

  const toggleLang = (id: number) => {
    setSelectedLangs(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (data) setSelectedLangs(data.languages.map((l: any) => l.language_id));
  };
  const deselectAll = () => setSelectedLangs([]);

  if (!data) return <p>Loading…</p>;

  return (
    <div className="search">
      <input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={e => setQuery(e.target.value)}
        className="search-input"
      />

      <h3>Languages</h3>

      <div className="search-controls">
        <button onClick={selectAll}>Select All</button>
        <button onClick={deselectAll}>Deselect All</button>
      </div>

      <div className="search-languages">
        {data.languages.map((l: any) => (
          <label key={l.language_id} className="lang-label">
            <input
              type="checkbox"
              checked={selectedLangs.includes(l.language_id)}
              onChange={() => toggleLang(l.language_id)}
            />
            {l.label}
          </label>
        ))}
      </div>

      <h3>Sort By</h3>

      <select
        value={sortBy}
        onChange={e => setSortBy(e.target.value as any)}
        className="search-sort"
      >
        <option value="original">Original</option>
        <option value="transliteration">Transliteration</option>
        <option value="primary_meaning">Primary Meaning</option>
      </select>

      <SearchResults results={results} query={query} />
    </div>
  );
}

function SearchResults({ results, query }: { results: any[]; query: string }) {
  if (!results.length) return <p className="no-results">No results found.</p>;

  return (
    <ul className="search-results">
      {results.map(l => (
        <li key={l.lemma_id} className="result-item">
          <LemmaLink lemma={l} />
        </li>
      ))}
    </ul>
  );
}
