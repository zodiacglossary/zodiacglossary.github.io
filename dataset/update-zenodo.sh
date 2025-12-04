#!/bin/sh
set -efu

ZENODO_API_URL="https://zenodo.org/api"

files_to_upload="metadata.json
data.json"

[ -z "$ZENODO_TOKEN" ] && {
  echo "ZENODO_TOKEN environment variable is not set. Exiting."
  exit 1
}

curl_zenodo() {
  curl -s -L -H "Content-Type: application/json" -H "Authorization: Bearer $ZENODO_TOKEN" "$@"
}

[ -z "$ZENODO_CONCEPT_ID" ] && {
  echo "ZENODO_CONCEPT_ID environment variable is not set. Exiting."
  exit 1
}

most_recent=$(curl_zenodo "$ZENODO_API_URL/deposit/depositions" | jq -r 'map(select(.conceptrecid == "'"$ZENODO_CONCEPT_ID"'")).[0]')

echo $most_recent | jq .

# if editable (submitted == false), upload file
# if not, get .links.newversion and create a new version
submitted=$(echo "$most_recent" | jq -r '.submitted')

if [ "$submitted" = "false" ]; then
  deposition=$(echo "$most_recent")
else
  new_version_url=$(echo "$most_recent" | jq -r '.links.newversion')
  new_version_response=$(curl_zenodo -X POST "$new_version_url")
  deposition=$(echo "$new_version_response")
fi

files_url=$(echo "$deposition" | jq -r '.links.files')

echo "Processing files for deposition ID: $(echo "$deposition" | jq -r '.id')"

curl_zenodo "$files_url" | jq -c '.[]' | while read -r file; do
  filename=$(echo "$file" | jq -r '.filename')
  file_id=$(echo "$file" | jq -r '.id')
  file_url=$(echo "$file" | jq -r '.links.self')

  if echo "$files_to_upload" | grep -q "^$filename$"; then
    curl_zenodo -X DELETE "$file_url"
    echo "Deleted existing file $filename (ID: $file_id)"
  else
    echo "Skipping irrelevant file: $filename"
  fi
done

for filepath in $files_to_upload; do
  if [ -f "$filepath" ]; then
    new_file=$(curl -s -L -X POST "$files_url" -H "Authorization: Bearer $ZENODO_TOKEN" -F "file=@$filepath" -F "name=$(basename "$filepath")")
    echo "Uploaded file: $(echo "$new_file" | jq -r '.filename')"
  else
    echo "File not found: $filepath"
    exit 1
  fi
done

# update publication_date to today
today=$(date +%Y-%m-%d)
metadata_url=$(echo "$deposition" | jq -r '.links.self')
old_metadata=$(echo "$deposition" | jq '.metadata')
metadata=$(curl_zenodo -X PUT "$metadata_url" -d '{
  "metadata": '"$(echo "$old_metadata" | jq --arg pub_date "$today" '.publication_date = $pub_date')"'
}')

publish_link=$(echo "$deposition" | jq -r '.links.publish')
publish_response=$(curl_zenodo -X POST "$publish_link")
echo "$publish_response"
echo "Published deposition ID: $(echo "$deposition" | jq -r '.id')"
