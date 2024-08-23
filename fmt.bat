comment-space -w batch.js lib test
capitalize-comments -w batch.js lib test

js-equals -w batch.js lib test

call prettier --no-semi --print-width 132 -w .
git diff
