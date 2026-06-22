#!/bin/bash
# Task 3 — count every "new:" learning comment across the project files.
# Works for all three comment styles because each marker contains the token "new:"
#   HTML: <!-- new: ... -->   CSS: /* new: ... */   JS: // new: ...

REPORT="Michee_bash_report.txt"
FILES=("index.html" "cv.html" "style.css" "app.js")

total=0

# Build the output once, then both print it and save it with tee.
{
  echo "New-learning comment count"
  echo "=========================="
  for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
      count=$(grep -o "new:" "$file" | wc -l)
    else
      count=0
      echo "(warning: $file not found)"
    fi
    printf "%-12s : %d\n" "$file" "$count"
    total=$((total + count))
  done
  echo "--------------------------"
  printf "%-12s : %d\n" "TOTAL" "$total"
} | tee "$REPORT"
