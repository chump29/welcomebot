#!/usr/bin/env -S bash -e

strip() {
  echo "${1:1:-1}"
}

clear

echo -e "📌 Variables:\n"

_biome=$(jq '.devDependencies."@biomejs/biome"' ../package.json)
_biome=$(strip "$_biome")
export _biome
echo -e " • _biome: $_biome"

_bun=$(jq .engines.bun ../package.json)
_bun=$(strip "$_bun")
export _bun
echo -e " • _bun: $_bun"

_discord=$(jq '.dependencies."discord.js"' ../package.json)
_discord=$(strip "$_discord")
export _discord
echo -e " • _discord: $_discord"

echo -e "\n🛠️  Creating README.md..."

envsubst < README.template.md > ../README.md

echo -e "\n✔️  Done!\n"
