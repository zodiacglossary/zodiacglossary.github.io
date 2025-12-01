import { useState, useEffect } from "react";
import LemmaLink from "../components/LemmaLink";

export default function Search() {
  const [data, setData] = useState<{
    lemmata: any[];
  } | null>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  // Load data.json in the browser
  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
      });
  }, []);

  // Filter results dynamically
  useEffect(() => {
    if (!data) return;

    // If query is empty, show all lemmata
    const filtered = data.lemmata
      .filter(
        (l) =>
          !query ||
          [l.original, l.transliteration, l.primary_meaning].some((f) =>
            f?.toLowerCase().includes(query.toLowerCase()),
          ),
      )
      .toSorted((a, b) =>
        (a.transliteration || a.original).localeCompare(
          b.transliteration || b.original,
        ),
      );

    setResults(filtered);
  }, [query, data]);

  if (!data) return <p aria-busy="true">Loading…</p>;

  return (
    <div className="search">
      <input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <SearchResults results={results} />
    </div>
  );
}

function SearchResults({ results }: { results: any[] }) {
  if (!results.length) return <p className="no-results">No results found.</p>;

  return (
    <ul class="search-results">
      {results.map((l) => (
        <li key={l.lemma_id} className="result-item">
          <LemmaLink lemma={l} />
        </li>
      ))}
    </ul>
  );
}
