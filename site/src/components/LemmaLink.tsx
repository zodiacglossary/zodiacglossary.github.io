import React from "react";

const hasLogogram = (s: string) => /\p{Lu}(?!\p{Ll})/u.test(s ?? "");
const hasNumberOrMark = (s: string) => /[0-9?]/.test(s ?? "");

export default function LemmaLink({ lemma }: { lemma: any }) {
  if (
    !lemma ||
    !lemma.lemma_id ||
    !(lemma.original || lemma.transliteration) ||
    !lemma.primary_meaning
  ) {
    return <>{`(unknown lemma ${lemma?.lemma_id})`}</>;
  }

  // Akkadian: transliteration is the headword; original shows only when it
  // carries a logogram, number, or "?" — same rule as the lemma page.
  if (lemma.language_id === 1) {
    const showOriginal =
      hasLogogram(lemma.original) || hasNumberOrMark(lemma.original);
    return (
      <>
        <a href={`/lemma/${lemma.lemma_id}`}>
          〈{lemma.transliteration || lemma.original}〉
        </a>{" "}
        {showOriginal && lemma.transliteration && (
          <>
            <span className="transliteration">{lemma.original}</span>{" "}
          </>
        )}
        ‘{lemma.primary_meaning}’
      </>
    );
  }

  // All other languages: your original code, untouched.
  const headword = lemma.original || lemma.transliteration;
  const hasBoth = lemma.original && lemma.transliteration;
  return (
    <>
      <a href={`/lemma/${lemma.lemma_id}`}>
        〈{lemma.original ? headword : <span className="transliteration">{headword}</span>}〉
      </a>{" "}
      {hasBoth && (
        <>
          <span className="transliteration">{lemma.transliteration}</span>{" "}
        </>
      )}
      ‘{lemma.primary_meaning}’
    </>
  );
}
