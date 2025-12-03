// export/export.js
import fs from "node:fs";
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new Client(); // data comes from dotenv

async function main() {
  await client.connect();

  // --- Fetch core data ---------------------------------------
  const lemmata = (await client.query(`
    SELECT
      l.lemma_id,
      l.published,
      l.original,
      l.translation,
      l.transliteration,
      l.partofspeech_id,
      pos.label AS partofspeech_label,
      pos.value AS partofspeech_value,
      l.language_id,
      lang.label AS language_label,
      lang.value AS language_value,
      loan_lang.label AS loan_language_label,
      loan_lang.value AS loan_language_value,
      l.primary_meaning,
      l.editor,
      l.literal_translation2,
      l.last_edit,
      l.comment,
      l.checked,
      l.attention,
      l.loan_type
    FROM lemmata l
    LEFT JOIN partsofspeech pos ON pos.partofspeech_id = l.partofspeech_id
    LEFT JOIN languages lang ON lang.language_id = l.language_id
    LEFT JOIN languages loan_lang ON loan_lang.language_id = l.loan_language_id
    WHERE l.published
    ORDER BY l.lemma_id ASC;
  `)).rows;

  // --- Fetch others -------------------------------------------
  const meanings = (await client.query(`SELECT * FROM meanings ORDER BY meaning_id;`)).rows;
  const meaningCategories = (await client.query(`SELECT * FROM meaning_categories ORDER BY category_id;`)).rows;
  const variants = (await client.query(`SELECT * FROM variants ORDER BY variant_id;`)).rows;
  const quotations = (await client.query(`SELECT * FROM quotations ORDER BY quotation_id;`)).rows;
  const externalLinks = (await client.query(`SELECT * FROM external_links ORDER BY external_link_id;`)).rows;
  const crossLinks = (await client.query(`
    SELECT cl.*
    FROM cross_links cl
    JOIN lemmata l1 ON cl.lemma_id = l1.lemma_id
    JOIN lemmata l2 ON cl.link = l2.lemma_id
    WHERE l1.published = TRUE
      AND l2.published = TRUE
    ORDER BY cl.cross_link_id;
  `)).rows;
  const users = (await client.query(`SELECT id, first_name, last_name, email, username, website FROM users WHERE active ORDER BY id;`)).rows;

  // --- Build object -------------------------------------------
  const data = {
    lemmata,
    meanings,
    meaningCategories,
    variants,
    quotations,
    externalLinks,
    crossLinks,
    users,
    languages: (await client.query(`SELECT * FROM languages ORDER BY language_id;`)).rows,
    partsofspeech: (await client.query(`SELECT * FROM partsofspeech ORDER BY partofspeech_id;`)).rows,
  };

  // --- Output JSON --------------------------------------------
  fs.writeFileSync("./data.json", JSON.stringify(data, null, 2));
  console.log("Export complete: data.json");

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
