call prettier --no-semi --print-width 132 -w .

comment-space -w batch.js lib test
js-equals -w batch.js lib test

git diff
