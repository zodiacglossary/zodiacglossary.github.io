import { useEffect, useState } from "react";
import data from "../../public/data.json";

export default function Search() {
  const [query, setQuery] = useState("");
  const [selectedLangs, setSelectedLangs] = useState(
    data.languages.map((l) => l.language_id),
  );
  const [sortBy, setSortBy] = useState<
    "original" | "transliteration" | "primary_meaning"
  >(
    "original",
  );

  const toggleLang = (id: number) => {
    setSelectedLangs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const selectAll = () =>
    setSelectedLangs(data.languages.map((l) => l.language_id));
  const deselectAll = () => setSelectedLangs([]);

  // Only filter if there is a query
  const filteredLemmata = query.length > 0
    ? data.lemmata
      .filter(
        (l) =>
          selectedLangs.includes(l.language_id) &&
          [l.original, l.transliteration, l.primary_meaning].some((f) =>
            f.toLowerCase().includes(query.toLowerCase())
          ),
      )
      .sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
    : [];

  return (
    <div>
      <input
        type="text"
        value={query}
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{ marginTop: "0.5em" }}>
        <button onClick={selectAll}>Select All</button>
        <button onClick={deselectAll}>Deselect All</button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "0.5em" }}>
        {data.languages.map((l) => (
          <label key={l.language_id} style={{ marginRight: "1em" }}>
            <input
              type="checkbox"
              checked={selectedLangs.includes(l.language_id)}
              onChange={() =>
                toggleLang(l.language_id)}
            />
            {l.label}
          </label>
        ))}
      </div>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
        <option value="original">Original</option>
        <option value="transliteration">Transliteration</option>
        <option value="primary_meaning">Primary Meaning</option>
      </select>

      {query.length === 0
        ? (
          <p style={{ marginTop: "1em" }}>
            Type something to search the glossary…
          </p>
        )
        : filteredLemmata.length === 0
        ? <p style={{ marginTop: "1em" }}>No results found.</p>
        : (
          <ul style={{ marginTop: "1em" }}>
            {filteredLemmata.map((l) => (
              <li key={l.lemma_id}>
                <a href={`/lemma/${l.lemma_id}`}>
                  〈{l.original}〉
                </a>{" "}
                <i>{l.transliteration}</i> ‘{l.primary_meaning}’
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
