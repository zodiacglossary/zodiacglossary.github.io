import React, { useState, useMemo } from "react";
import Fuse from "fuse.js";
import data from "../../public/data.json";

export default function Search() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [pos, setPos] = useState("");
  const [category, setCategory] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(data.lemmata, {
        keys: ["original", "translation", "transliteration", "primary_meaning"],
        threshold: 0.3,
      }),
    []
  );

  const results = useMemo(() => {
    let base = query ? fuse.search(query).map((r) => r.item) : data.lemmata;

    if (language) base = base.filter((l) => l.language_id?.toString() === language);
    if (pos)      base = base.filter((l) => l.partofspeech_id?.toString() === pos);

    if (category) {
      const meaningIds = data.meaningCategories
        .filter((c) => c.category_id.toString() === category)
        .map((c) => c.meaning_id);

      const lemmaIds = data.meanings
        .filter((m) => meaningIds.includes(m.meaning_id))
        .map((m) => m.lemma_id);

      base = base.filter((l) => lemmaIds.includes(l.lemma_id));
    }

    return base;
  }, [query, language, pos, category]);

  return (
    <div>
      <input
        type="search"
        placeholder="Search lemmata…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Language filter */}
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="">All languages</option>
        {data.languages.map((l) => (
          <option key={l.language_id} value={l.language_id}>
            {l.label}
          </option>
        ))}
      </select>

      {/* Parts of Speech */}
      <select value={pos} onChange={(e) => setPos(e.target.value)}>
        <option value="">All POS</option>
        {data.partsofspeech.map((p) => (
          <option key={p.partofspeech_id} value={p.partofspeech_id}>
            {p.label}
          </option>
        ))}
      </select>

      {/* Meaning Category */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All categories</option>
        {data.meaningCategories.map((c) => (
          <option key={c.category_id} value={c.category_id}>
            {c.category}
          </option>
        ))}
      </select>

      <ul>
        {results.map((lemma) => (
          <li key={lemma.lemma_id}>
            <a href={`/lemma/${lemma.lemma_id}`}>
              {lemma.original} — {lemma.translation}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
