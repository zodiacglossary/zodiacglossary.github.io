import fs from "node:fs";
import Fuse from "fuse.js";

const data = JSON.parse(fs.readFileSync("./public/data.json", "utf8"));

const fuse = new Fuse(data.lemmata, {
  keys: [
    "original",
    "translation",
    "transliteration",
    "primary_meaning",
  ],
  includeScore: true,
  threshold: 0.35,
});

fs.writeFileSync("./public/index.json", JSON.stringify(fuse));
console.log("Search index built.");
