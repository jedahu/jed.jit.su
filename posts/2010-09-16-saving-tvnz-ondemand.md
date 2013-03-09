---
title: Saving TVNZ ondemand episodes
date: 2010-09-16
tags: [shell]
---

The code in my [previous
post](/2010/09/saving-flash-video-on-linux.html) will work for episodes
from TVNZ’s [ondemand](http://tvnz.co.nz/video) service; but there is a
more direct approach.

Each episode page stores a URL to the episode’s playlist in a javascript
property `"playlist"`. The URL points to an XML file containing the URLs
of four or more video parts and no ads. The following script downloads
the episode page, grabs the playlist URL, downloads the playlist, and
parses it. It returns a newline separated list of video URLs.

You will need to have curl and
[xmlstarlet](http://xmlstar.sourceforge.net) installed.

    #!/bin/sh

    if [ "$1" == "" ]; then
        echo "usage: $0 episode-url"
        exit 1
    fi

    EPISODE="$1"

    PLAYLIST=http://tvnz.co.nz`curl "$EPISODE" | grep -Po "(?<=playlist: ').*?(?=')"`

    curl "$PLAYLIST" | \
        xml sel -N smil=http://www.w3.org/ns/SMIL \
            -t -m "//smil:video[@systemBitrate='700000']" -v '@src' -n -

I have saved it as `tvnz-grab` and call it like so:

    tvnz-grab <episode-page-url> | xargs curl -O

The four or five parts can be played as a single file using mplayer’s
`"-fixed-vo"` option.
