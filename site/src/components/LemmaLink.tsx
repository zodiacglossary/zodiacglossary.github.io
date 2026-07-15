import React from "react";

export default function LemmaLink({ lemma }: { lemma: any }) {
  if (
    !lemma ||
    !lemma.lemma_id ||
    !(lemma.original || lemma.transliteration) ||
    !lemma.primary_meaning
  ) {
    return <>{`(unknown lemma ${lemma?.lemma_id})`}</>;
  }

  // Headword = the "original". If there is no original, promote the
  // transliteration into the headword slot so it gets the same depiction.
  const headword = lemma.original || lemma.transliteration;

  // Only show the separate (small, italic) transliteration when BOTH exist,
  // otherwise it would appear twice.
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
