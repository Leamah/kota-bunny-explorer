#!/bin/bash
# Sets up Appwrite database and collections via REST API
# Requires an API key with databases.read + databases.write scopes

ENDPOINT="https://fra.cloud.appwrite.io/v1"
PROJECT_ID="69cc168e00183ee74608"
DB_ID="kota-bunny-db"

echo "Enter your Appwrite API Key:"
read -r API_KEY

HEADERS=(
  -H "Content-Type: application/json"
  -H "X-Appwrite-Project: $PROJECT_ID"
  -H "X-Appwrite-Key: $API_KEY"
)

echo "Creating database..."
curl -s -X POST "$ENDPOINT/databases" \
  "${HEADERS[@]}" \
  -d "{\"databaseId\": \"$DB_ID\", \"name\": \"Kota Bunny DB\"}" | head -c 200
echo ""

echo "Creating Vendors collection..."
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections" \
  "${HEADERS[@]}" \
  -d '{"collectionId": "vendors", "name": "Vendors", "documentSecurity": false, "permissions": ["read(\"any\")", "create(\"users\")", "update(\"users\")"]}' | head -c 200
echo ""

# Vendor attributes
for attr in \
  '{"key":"name","size":255,"required":true}' \
  '{"key":"address","size":500,"required":true}' \
  '{"key":"category","size":50,"required":true}' \
  '{"key":"source","size":20,"required":true,"default":"community"}'; do
  curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/vendors/attributes/string" \
    "${HEADERS[@]}" -d "$attr" > /dev/null
done

curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/vendors/attributes/float" \
  "${HEADERS[@]}" -d '{"key":"rating","required":true,"min":0,"max":5,"default":0}' > /dev/null

curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/vendors/attributes/integer" \
  "${HEADERS[@]}" -d '{"key":"review_count","required":true,"min":0,"default":0}' > /dev/null

curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/vendors/attributes/integer" \
  "${HEADERS[@]}" -d '{"key":"upvotes","required":true,"min":0,"default":0}' > /dev/null

curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/vendors/attributes/boolean" \
  "${HEADERS[@]}" -d '{"key":"is_vetted","required":true,"default":false}' > /dev/null

echo "Vendors attributes created."

echo "Creating Reviews collection..."
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections" \
  "${HEADERS[@]}" \
  -d '{"collectionId": "reviews", "name": "Reviews", "documentSecurity": false, "permissions": ["read(\"any\")", "create(\"users\")"]}' | head -c 200
echo ""

curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/reviews/attributes/string" \
  "${HEADERS[@]}" -d '{"key":"vendor_id","size":255,"required":true}' > /dev/null
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/reviews/attributes/string" \
  "${HEADERS[@]}" -d '{"key":"user_id","size":255,"required":true}' > /dev/null
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/reviews/attributes/string" \
  "${HEADERS[@]}" -d '{"key":"content","size":2000,"required":true}' > /dev/null
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/reviews/attributes/float" \
  "${HEADERS[@]}" -d '{"key":"rating","required":true,"min":1,"max":5}' > /dev/null

echo "Reviews attributes created."

echo "Creating Recipes collection..."
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections" \
  "${HEADERS[@]}" \
  -d '{"collectionId": "recipes", "name": "Recipes", "documentSecurity": false, "permissions": ["read(\"any\")"]}' | head -c 200
echo ""

curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/recipes/attributes/string" \
  "${HEADERS[@]}" -d '{"key":"title","size":255,"required":true}' > /dev/null
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/recipes/attributes/string" \
  "${HEADERS[@]}" -d '{"key":"content","size":10000,"required":true}' > /dev/null
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/recipes/attributes/string" \
  "${HEADERS[@]}" -d '{"key":"image_url","size":2000,"required":false}' > /dev/null
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/recipes/attributes/datetime" \
  "${HEADERS[@]}" -d '{"key":"generated_at","required":true}' > /dev/null

echo "Recipes attributes created."

echo "Creating Upvotes collection..."
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections" \
  "${HEADERS[@]}" \
  -d '{"collectionId": "upvotes", "name": "Upvotes", "documentSecurity": false, "permissions": ["read(\"any\")", "create(\"users\")"]}' | head -c 200
echo ""

curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/upvotes/attributes/string" \
  "${HEADERS[@]}" -d '{"key":"vendor_id","size":255,"required":true}' > /dev/null
curl -s -X POST "$ENDPOINT/databases/$DB_ID/collections/upvotes/attributes/string" \
  "${HEADERS[@]}" -d '{"key":"user_id","size":255,"required":true}' > /dev/null

echo "Upvotes attributes created."
echo ""
echo "Done! All collections created. Check your Appwrite Console to verify."
