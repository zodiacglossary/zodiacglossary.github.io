export default function LemmaTitle({ lemma }: { lemma: any }) {
  // language_id === 1 → Akkadian: transliteration first, original second
  if (lemma.language_id === 1) {
    return (
      <>
        {lemma.transliteration}
        {lemma.transliteration && lemma.original ? <br /> : null}
        {lemma.original && (
          <span className="transliteration">{lemma.original}</span>
        )}
      </>
    );
  }
  // other languages: original first, transliteration second
  return (
    <>
      {lemma.original}
      {lemma.original && lemma.transliteration ? <br /> : null}
      {lemma.transliteration && (
        <span className="transliteration">{lemma.transliteration}</span>
      )}
    </>
  );
}
