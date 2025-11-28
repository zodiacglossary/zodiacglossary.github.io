import { useState, useEffect } from "react";
import LemmaLink from "../components/LemmaLink";

type SearchField =
  | "editor"
  | "language"
  | "pos"
  | "literal_translation"
  | "meaning"
  | "category"
  | "original"
  | "transliteration"
  | "publication"
  | "provenance"
  | "source";

interface SearchRow {
  field: SearchField;
  value: string;
}

export default function AdvancedSearch() {
  const [data, setData] = useState<any | null>(null);
  const [rows, setRows] = useState<SearchRow[]>([
    { field: "original", value: "" },
  ]);
  const [results, setResults] = useState<any[]>([]);

  // Load JSON
  useEffect(() => {
    fetch("/data.json")
      .then(r => r.json())
      .then(d => setData(d));
  }, []);

  // Add/remove search rows
  const addRow = () => setRows([...rows, { field: "original", value: "" }]);
  const removeRow = (i: number) =>
    setRows(rows.filter((_, idx) => idx !== i));

  const updateField = (i: number, field: SearchField) => {
    const r = [...rows];
    r[i].field = field;
    r[i].value = "";
    setRows(r);
  };

  const updateValue = (i: number, value: string) => {
    const r = [...rows];
    r[i].value = value;
    setRows(r);
  };

  // Perform filtering whenever rows/data change
  useEffect(() => {
    if (!data) return;

    const { lemmata, meanings, meaningCategories, quotations } = data;

    const meaningByLemma = new Map<number, any[]>();
    meanings.forEach((m: any) => {
      if (!meaningByLemma.has(m.lemma_id)) meaningByLemma.set(m.lemma_id, []);
      meaningByLemma.get(m.lemma_id)!.push(m);
    });

    const quotesByLemma = new Map<number, any[]>();
    quotations.forEach((q: any) => {
      if (!quotesByLemma.has(q.lemma_id)) quotesByLemma.set(q.lemma_id, []);
      quotesByLemma.get(q.lemma_id)!.push(q);
    });

    const result = lemmata.filter((lemma: any) => {
      // ALL rows must match (AND)
      return rows.every(row => {
        const term = row.value.toLowerCase().trim();
        if (!term) return true; // empty rows match everything

        switch (row.field) {
          case "editor":
            return lemma.editor?.toLowerCase().includes(term);

          case "original":
            return lemma.original?.toLowerCase().includes(term);

          case "transliteration":
            return lemma.transliteration?.toLowerCase().includes(term);

          case "literal_translation":
            return lemma.translation?.toLowerCase().includes(term);

          case "language":
            return lemma.language_id === Number(term);

          case "pos":
            return lemma.partofspeech_id === Number(term);

          case "publication": {
            const qs = quotesByLemma.get(lemma.lemma_id) || [];
            return qs.some(q =>
              q.publication?.toLowerCase().includes(term)
            );
          }

          case "meaning": {
            const ms = meaningByLemma.get(lemma.lemma_id) || [];
            return ms.some(m =>
              m.value?.toLowerCase().includes(term)
            );
          }

          case "category": {
            const ms = meaningByLemma.get(lemma.lemma_id) || [];
            return ms.some(m => {
              const cat = meaningCategories.find(
                (c: any) => c.meaning_id === m.meaning_id
              );
              console.log(cat);
              return cat?.category === term;
            });
          }

          case "provenance": {
            const qs = quotesByLemma.get(lemma.lemma_id) || [];
            return qs.some(q =>
              q.provenance?.toLowerCase().includes(term)
            );
          }

          case "source": {
            const qs = quotesByLemma.get(lemma.lemma_id) || [];
            return qs.some(q =>
              q.source?.toLowerCase().includes(term)
            );
          }

          default:
            return true;
        }
      });
    });

    setResults(result);
  }, [rows, data]);

  if (!data) return <p>Loading…</p>;

  return (
    <div className="advanced-search">
      <h2>Advanced Search</h2>

      <div className="search-rows">
        {rows.map((row, i) => (
          <div key={i} className="search-row">
            {/* Field selector */}
            <select
              value={row.field}
              onChange={e => updateField(i, e.target.value as SearchField)}
            >
              <option value="editor">Editor</option>
              <option value="language">Language</option>
              <option value="pos">Part of Speech</option>
              <option value="literal_translation">Literal Translation</option>
              <option value="meaning">Meaning</option>
              <option value="category">Category</option>
              <option value="original">Original</option>
              <option value="transliteration">Transliteration</option>
              <option value="publication">Publication</option>
              <option value="provenance">Provenance</option>
              <option value="source">Source</option>
            </select>

            {/* Input field */}
            {["language", "pos", "category"].includes(row.field) ? (
              <select
                value={row.value}
                onChange={e => updateValue(i, e.target.value)}
              >
                <option value="">—</option>

                {row.field === "language" &&
                  data.languages.map((l: any) => (
                    <option key={l.language_id} value={l.language_id}>
                      {l.label}
                    </option>
                  ))}

                {row.field === "category" &&
                  [...new Set(data.meaningCategories.map((mc: any) => mc?.category))].map((c: any) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}

                {row.field === "pos" &&
                  data.partsofspeech.map((p: any) => (
                    <option key={p.partofspeech_id} value={p.partofspeech_id}>
                      {p.value}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="text"
                value={row.value}
                onChange={e => updateValue(i, e.target.value)}
                placeholder="Enter search term…"
              />
            )}

            <button onClick={() => removeRow(i)}>✕</button>
          </div>
        ))}
      </div>

      <button onClick={addRow} className="add-row">
        + Add Condition
      </button>

      <h3>Results ({results.length})</h3>

      <ul className="results-list">
        {results.map((l: any) => (
          <li key={l.lemma_id}><LemmaLink lemma={l}/></li>

        ))}
      </ul>
    </div>
  );
}
