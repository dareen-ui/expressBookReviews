#!/bin/bash
# Runs each API request against the local server and saves the command
# and its output to a file named after the task.
cd "$(dirname "$0")"
BASE=http://localhost:5000

run() {
  local file="$1"; shift
  local cmd="$*"
  { echo "\$ $cmd"; eval "$cmd"; echo; } > "$file"
  cat "$file"; echo "-----"
}

run getallbooks      "curl -s $BASE/"
run getbooksbyISBN   "curl -s $BASE/isbn/1"
run getbooksbyauthor "curl -s \"$BASE/author/Jane%20Austen\""
run getbooksbytitle  "curl -s \"$BASE/title/Things%20Fall%20Apart\""
run getbookreview    "curl -s $BASE/review/1"
run register         "curl -s -X POST $BASE/register -H 'Content-Type: application/json' -d '{\"username\":\"dareen\",\"password\":\"pass123\"}'"
run login            "curl -s -c cookies.txt -X POST $BASE/customer/login -H 'Content-Type: application/json' -d '{\"username\":\"dareen\",\"password\":\"pass123\"}'"
run reviewadded      "curl -s -b cookies.txt -X PUT \"$BASE/customer/auth/review/1?review=A%20timeless%20classic\""
run deletereview     "curl -s -b cookies.txt -X DELETE $BASE/customer/auth/review/1"
rm -f cookies.txt

# Tasks 10-13: call the Axios-based functions from general.js
{ echo "\$ node -e \"<call getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle>\"";
  node -e '
const g = require("./router/general.js");
(async () => {
  console.log("Task 10 - getAllBooks():"); console.log(await g.getAllBooks());
  console.log("Task 11 - getBookByISBN(1):"); console.log(await g.getBookByISBN(1));
  console.log("Task 12 - getBooksByAuthor(\"Jane Austen\"):"); console.log(await g.getBooksByAuthor("Jane Austen"));
  console.log("Task 13 - getBooksByTitle(\"Things Fall Apart\"):"); console.log(await g.getBooksByTitle("Things Fall Apart"));
})().catch(e => { console.error(e.message); process.exit(1); });
'; } > asyncaxios 2>&1
cat asyncaxios
