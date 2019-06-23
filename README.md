ImoDice for develop.
====
## Build bookmarklet.
Command below generates modules/imodice-bookmarklet.js and modules/imodice-bookmarklet-body.js

```
>npm install
>npm run build.bat
```

Start local bookmarklet server.
```
>npm run localtest.bat
```

You can access simple test site.
http://localhost:9998/

## Build App.
After build bookmarklet invoke below command in app/ directory.

```
>npm install
>npm run pakcage.bat
```

## Unit tests.

After build bookmarklet invoke below command in tests/ directory.

```
>npm run test.bat
```

## Commands
Dump jpeg comment.
```
>node bin/get-jpeg-comment.js old.jpg
```

Update jpeg comment.
```
>usage node bin/set-jpeg-comment.js [--output OUT_IMG] IN_IMG COMMENT
>usage node bin/set-jpeg-comment.js --input TEXT_FILE [--output OUT_IMG] IN_IMG
```

## See Also
https://gangi-man.github.io/
