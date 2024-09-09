do-all-recur-js . comment-space -w 
do-all-recur-js . capitalize-comments -w 
do-all-recur-js . js-equals -w 

call prettier --no-semi --print-width 132 -w .
git diff
