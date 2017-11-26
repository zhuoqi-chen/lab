tree -f -L 4 -H . -P "*.html|*.js" -I "node_modules" > index.html
http-server -c-1 -p 9999