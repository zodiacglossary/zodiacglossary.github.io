import { useState, useEffect, useMemo } from "react";
import LemmaLink from "../components/LemmaLink";
import LemmaTitle from "../components/LemmaTitle"; 
// Lowercase, drop accents, AND turn sub/superscript digits into normal ones
// (E₂ → e2), so typing "E2" matches "E₂".
function norm(s: string) {
  return (s ?? "")
    .toLowerCase()
    .normalize("NFKD")                 // ₂ → 2, š → s + mark, etc.
    .replace(/[\u0300-\u036f]/g, "");  // remove the leftover accent marks
}

export default function Search() {
  const [data, setData] = useState<{
    lemmata: any[];
    meanings: any[];
  } | null>(null);
  const [query, setQuery] = useState("");

  // Load data.json in the browser
  useEffect(() => {
    fetch("/data.json")
      .then((r) => r.json())
      .then((d) => setData(d));
  }, []);

  // Build a lookup: lemma_id -> ["Pleiades", "Taurus", "constellation", ...]
  const meaningsByLemma = useMemo(() => {
    const map = new Map<number, string[]>();
    if (!data) return map;
    for (const m of data.meanings) {
      if (!m.value) continue;
      const list = map.get(m.lemma_id) ?? [];
      list.push(m.value);
      map.set(m.lemma_id, list);
    }
    return map;
  }, [data]);

  // Filter results dynamically
  const results = useMemo(() => {
    if (!data || !query.length) return [];
    const q = norm(query);

    return data.lemmata
      .filter((l) => (l.original || l.transliteration) && l.primary_meaning)
      .filter((l) => {
        const fields = [
          l.original,
          l.transliteration,
          l.primary_meaning,
          ...(meaningsByLemma.get(l.lemma_id) ?? []), // all other meanings
        ];
        return fields.some((f) => f && norm(f).includes(q));
      })
      .toSorted((a, b) =>
        (a.transliteration || a.original || "").localeCompare(
          b.transliteration || b.original || "",
        ),
      );
  }, [query, data, meaningsByLemma]);

  if (!data) return <p aria-busy="true">Search loading…</p>;

  return (
    <div className="search">
      <input
        type="text"
        value={query}
        placeholder="Search our glossary..."
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <SearchResults results={results} />
    </div>
  );
}

function SearchResults({ results }: { results: any[] }) {
  if (!results.length) return <></>;
  return (
    <ul className="search-results">
      {results.map((l) => (
        <li key={l.lemma_id} className="result-item">
          <LemmaLink lemma={l} />
        </li>
      ))}
    </ul>
  );
}
