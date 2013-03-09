---
title: ~/bin/apod-set-bg
date: 2010-11-03
tags: [shell]
---

[Astronomy Picture Of the Day](http://apod.nasa.gov/apod/) shows a new,
usually desktop sized, picture every day. `apod-set-bg` is a shell
script to download the daily image and set it as the desktop background.
It also downloads the explanation as a separate `html` file.

Requirements: curl, tidy, [xmlstarlet](http://xmlstar.sourceforge.net),
[feh](http://linuxbrit.co.uk/software/feh/).

    #!/bin/sh

    IMG_DIR="$1"

    APOD_URL=http://apod.nasa.gov/apod/ 

    URL_CONTENT=`curl $APOD_URL | tidy -q -asxml`

    IMG_URL=$APOD_URL`echo "$URL_CONTENT" | xml sel -N html='http://www.w3.org/1999/xhtml' -t -v '//html:img/ancestor::html:a/attribute::href' -`

    EXPLANATION=`echo "$URL_CONTENT" | xml sel -N html='http://www.w3.org/1999/xhtml' -t -c '/html:html/html:body/html:center[2]' -c '/html:html/html:body/html:p' -`

    FILE_NAME=`basename "$IMG_URL"`

    FILE_PATH="$IMG_DIR/$FILE_NAME"

    curl -o "$FILE_PATH" "$IMG_URL" || exit 1

    echo "$EXPLANATION" > "$FILE_PATH.html"

    ln -sf "$FILE_PATH" "$IMG_DIR/latest.jpg"
    ln -sf "$FILE_PATH.html" "$IMG_DIR/latest.html"

    feh --bg-fill "$FILE_PATH"

Put the following in your crontab to run daily.

    @daily ID=apod DISPLAY=:0.0 ~/bin/apod-set-bg ~/bg/ >/dev/null 2>&1
