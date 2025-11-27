import { useState, useEffect } from "react";
import data from "../../public/data.json";
import LemmaLink from "../components/LemmaLink";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof data.lemmata>([]);
  const [selectedLangs, setSelectedLangs] = useState(
    data.languages.map(l => l.language_id)
  );

  const [sortBy, setSortBy] = useState<"original" | "transliteration" | "primary_meaning">(
    "original"
  );

  // Filter results dynamically
  useEffect(() => {
    if (!query) {
      setResults([]); // empty by default
      return;
    }

    const filtered = data.lemmata.filter(
      l =>
        selectedLangs.includes(l.language_id) &&
        [l.original, l.transliteration, l.primary_meaning].some(f =>
          f.toLowerCase().includes(query.toLowerCase())
        )
    );

    setResults(filtered.sort((a, b) => a[sortBy].localeCompare(b[sortBy])));
  }, [query, selectedLangs, sortBy]);

  const toggleLang = (id: number) => {
    setSelectedLangs(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedLangs(data.languages.map(l => l.language_id));
  const deselectAll = () => setSelectedLangs([]);

  return (
    <div className="search">
      <input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={e => setQuery(e.target.value)}
        className="search-input"
      />

      <div className="search-controls">
        <button onClick={selectAll}>Select All</button>
        <button onClick={deselectAll}>Deselect All</button>
      </div>

      <div className="search-languages">
        {data.languages.map(l => (
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

function SearchResults({ results, query }: { results: typeof data.lemmata; query: string }) {
  if (!results.length && query) return <p className="no-results">No results found.</p>;
  if (!query) return <p className="hint">Type something to search the glossary…</p>;

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
