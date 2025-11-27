import { useEffect, useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch("/index.json")
      .then(r => r.json())
      .then(setIdx);
  }, []);

  useEffect(() => {
    if (!idx || !query.trim()) {
      setResults([]);
      return;
    }
    const res = idx.search(query).slice(0, 20);
    setResults(res.map(r => r.item));
  }, [query, idx]);

  return (
    <>
      <input
        type="search"
        placeholder="Search glossary…"
        value={query}
        onInput={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "8px", fontSize: "1.2rem" }}
      />

      <ul>
        {results.map((lemma) => (
          <li>
            <a href={`/lemma/${lemma.lemma_id}`}>
              {lemma.original} — {lemma.translation}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
