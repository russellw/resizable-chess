comment-space -w batch.js lib\*.js test\*.js
capitalize-comments -w batch.js lib\*.js test\*.js

js-equals -w batch.js lib test

call prettier --no-semi --print-width 132 -w .
git diff
