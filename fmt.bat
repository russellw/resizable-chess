js-equals -w batch.js lib test
call prettier --no-semi --print-width 132 -w .
git diff
