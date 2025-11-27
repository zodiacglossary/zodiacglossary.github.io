import React from "react";

export default function LemmaLink({ lemma }: { lemma: any }) {
  if (!lemma || !lemma.lemma_id || !(lemma.original || lemma.transliteration) || !lemma.primary_meaning) {
    return <>{`(unknown lemma ${lemma?.lemma_id})`}</>;
  }

  return (
    <>
      <a href={`/lemma/${lemma.lemma_id}`}>〈{lemma.original || "—"}〉</a>{" "}
      <span className="transliteration">{lemma.transliteration}</span> ‘{lemma.primary_meaning}’
    </>
  );
}
