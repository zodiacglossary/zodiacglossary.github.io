// src/pages/people.tsx
import "../styles/global.css";

export default function People() {
  const users = data.users; // contributors
  const lemmataByUser = (userId: number) =>
    data.lemmata.filter(l => l.editor === userId.toString()); // or adjust field

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1>Contributors</h1>
      {users.map(u => (
        <details key={u.id} className="border rounded p-2">
          <summary className="font-semibold cursor-pointer">
            {u.first_name} {u.last_name} ({lemmataByUser(u.id).length} entries)
          </summary>
          <ul className="mt-2 list-disc list-inside">
            {lemmataByUser(u.id).map(l => (
              <li key={l.lemma_id}>
                <a href={`/lemma/${l.lemma_id}`}>
                  〈{l.original}〉 <i>{l.transliteration}</i> ‘{l.primary_meaning}’
                </a>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}
