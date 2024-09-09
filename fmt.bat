call prettier --no-semi --print-width 132 -w .

do-all-recur . comment-space -w
do-all-recur . capitalize-comments -w

do-all-recur . js-equals -w

do-all-recur . remove-trail-space -w

git diff
