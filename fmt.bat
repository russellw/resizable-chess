rem This should go first, because some of the others depend on it
call prettier --no-semi --print-width 132 -w .||exit /b

rem These need to go in the specified order
do-all-recur . comment-space -w||exit /b
do-all-recur . lowercase-comments -w||exit /b

do-all-recur . sort-cases -w||exit /b
do-all-recur . sort-case-blocks -w||exit /b

rem These can go in any order
do-all-recur . js-equals -w||exit /b
do-all-recur . remove-trail-space -w||exit /b
do-all-recur . sort-fns-js -w||exit /b
do-all-recur . sort-marked-lines -w||exit /b

git diff
