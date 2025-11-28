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

type SortType =
  | "alphabetical"
  | "alphabetical_transliteration"
  | "alphabetical_primary_meaning"
  | "zodiac"
  | "decans"
  | "planets_babylonian"
  | "planets_weekday"
  | "planets_heliocentric"
  | "planets_geocentric";

interface SortRow {
  type: SortType;
}

const sortFieldMap: Record<SortType, "original" | "transliteration" | "primary_meaning"> = {
  alphabetical: "original",
  alphabetical_transliteration: "transliteration",
  alphabetical_primary_meaning: "primary_meaning",
  zodiac: "primary_meaning",
  decans: "primary_meaning",
  planets_babylonian: "primary_meaning",
  planets_weekday: "primary_meaning",
  planets_heliocentric: "primary_meaning",
  planets_geocentric: "primary_meaning",
};

const sortingLists: Record<string, string[]> = {
  zodiac: [
    "aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius","capricorn","aquarius","pisces"
  ],
  planets_babylonian: ["moon","sun","jupiter","venus","saturn","mercury","mars"],
  planets_weekday: ["sun","moon","mars","mercury","jupiter","venus","saturn"],
  planets_heliocentric: ["mercury","venus","earth","mars","jupiter","saturn","uranus","neptune"],
  planets_geocentric: ["moon","mercury","venus","sun","mars","jupiter","saturn"],
  decans: Array.from({ length: 36 }, (_, i) => `decan ${i + 1}`),
};

function collateSortingKeys<T>(keys: ((a: T, b: T) => number)[]) {
  return (a: T, b: T) => {
    for (const k of keys) {
      const r = k(a, b);
      if (r !== 0) return r;
    }
    return 0;
  };
}


export default function AdvancedSearch() {
  const [data, setData] = useState<any | null>(null);
  const [searchRows, setSearchRows] = useState<SearchRow[]>([{ field: "original", value: "" }]);
  const [sortRows, setSortRows] = useState<SortRow[]>([{ type: "alphabetical" }]);
  const [results, setResults] = useState<any[]>([]);

  // Load JSON
  useEffect(() => {
    fetch("/data.json")
      .then(r => r.json())
      .then(d => setData(d));
  }, []);

  // Add/remove search rows
  const addSearchRow = () => setSearchRows([...searchRows, { field: "original", value: "" }]);
  const removeSearchRow = (i: number) =>
    setSearchRows(searchRows.filter((_, idx) => idx !== i));

  const updateField = (i: number, field: SearchField) => {
    const r = [...searchRows];
    r[i].field = field;
    r[i].value = "";
    setSearchRows(r);
  };

  const updateValue = (i: number, value: string) => {
    const r = [...searchRows];
    r[i].value = value;
    setSearchRows(r);
  };

  const addSortRow = () => setSortRows([...sortRows, { type: "alphabetical" }]);
  const removeSortRow = (i: number) => setSortRows(sortRows.filter((_, idx) => idx !== i));
  const updateSortType = (i: number, type: SortType) => {
    const r = [...sortRows];
    r[i].type = type;
    setSortRows(r);
  };

  // Perform filtering whenever rows/data change
  useEffect(() => {
    if (!data) return;

    const { lemmata, meanings, meaningCategories, quotations } = data;

    // Pre-index meanings and quotations
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

    // -------------------------------
    // 1. Group rows by field
    // -------------------------------
    const grouped: Record<SearchField, SearchRow[]> = {
      editor: [],
      language: [],
      pos: [],
      literal_translation: [],
      meaning: [],
      category: [],
      original: [],
      transliteration: [],
      publication: [],
      provenance: [],
      source: [],
    };

    searchRows.forEach(row => {
      if (row.value.trim() !== "") grouped[row.field].push(row);
    });

    // -------------------------------
    // 2. Filtering with AND-of-ORs
    // -------------------------------
    const filtered = lemmata.filter((lemma: any) => {
      // For each field with conditions, ALL must match
      return (Object.entries(grouped) as [SearchField, SearchRow[]][])
      .every(([field, group]) => {
        if (group.length === 0) return true; // no conditions for this field

        // At least ONE of the conditions for this field must match → OR
        return group.some(({ value }) => {
          const term = value.toLowerCase().trim();

          switch (field) {
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
                return cat?.category?.toLowerCase() === term;
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
    });

    if (sortRows.length) {
      const sortFns = sortRows.map((row) => {
        const field = sortFieldMap[row.type];
        const list = sortingLists[row.type];
        if (list) {
          return (a: any, b: any) => {
            const aVal = (a[field] || "").toLowerCase();
            const bVal = (b[field] || "").toLowerCase();
            const iA = list.indexOf(aVal);
            const iB = list.indexOf(bVal);
            if (iA !== -1 && iB !== -1) return iA - iB;
            if (iA !== -1) return -1;
            if (iB !== -1) return 1;
            return 0;
          };
        } else {
          return (a: any, b: any) => (a[field] || "").localeCompare(b[field] || "");
        }
      });

      filtered.sort(collateSortingKeys(sortFns));
    }

    setResults(filtered);
  }, [searchRows, data, sortRows]);

  if (!data) return <p>Loading…</p>;

  return (
    <div className="advanced-search">
      <h2>Search criteria</h2>

      <div className="search-rows">
        {searchRows.map((row, i) => (
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
                  [...new Set(data.meaningCategories.map((mc: any) => mc?.category))].toSorted().map((c: any) => (
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

            <button onClick={() => removeSearchRow(i)}>✕</button>
          </div>
        ))}
      </div>

      <button onClick={addSearchRow} className="add-row">
        + Add Search Condition
      </button>

      <h2>Sorting</h2>
      <div className="sort-rows">
        {sortRows.map((row, i) => (
          <div key={i} className="sort-row">
            <select value={row.type} onChange={(e) => updateSortType(i, e.target.value as SortType)}>
              {Object.keys(sortFieldMap).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
            <button onClick={() => removeSortRow(i)}>✕</button>
          </div>
        ))}
        <button onClick={addSortRow}>+ Add Sort Criterion</button>
      </div>

      <h3>Results ({results.length})</h3>

      <ul className="results-list">
        {results.map((l: any) => (
          <li key={l.lemma_id}><LemmaLink lemma={l}/></li>

        ))}
      </ul>
    </div>
  );
}
