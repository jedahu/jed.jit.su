---
title: tvnz-grab in factor
date: 2010-09-16
tags: [factor]
---

The [previous post](/2010/09/saving-tvnz-ondemand-episodes.html) in
factor. I wrote it so my Windows using friends could have a
single-binary solution. Download the [zip
archive](http://download953.mediafire.com/1qg6ftx1okig/lgd7t7o6n9k9h9b/tvnz-grab.zip)
and unzip somewhere in the windows path; `C:\windows\system32` will do.

Usage: `tvnz-grab <episode-page-url>`. It will download all parts of the
episode into the current directory.

Unfortunately, this only works for NZ content. Foreign content uses
Adobe’s encrypted RTMP protocol. To get at episodes using that, check
out [rtmpsuck](http://rtmpdump.mplayerhq.hu).

Imports first.

    ! Copyright (C) 2010 Jeremy Hughes.
    ! See http://factorcode.org/license.txt for BSD license.
    USING: accessors assocs combinators.short-circuit fry
    http.client io.streams.byte-array kernel namespaces make
    regexp sequences xml xml.data locals splitting strings
    io.encodings.binary io io.files command-line http system
    math.parser destructors math math.functions io.pathnames
    continuations xml.traversal ;
    IN: tvnz-grab

Because I intend to extend this program into a small Qt demo, it is
necessary that any words used to display UI information, dispatch on the
type of UI.

    SYMBOL: ui
    SINGLETON: text

And the display methods themselves…

    HOOK: show-progress ui ( chunk full -- )
    HOOK: show-begin-fetch ui ( url -- )
    HOOK: show-end-fetch ui ( -- )
    HOOK: show-page-fetch ui ( -- )
    HOOK: show-playlist ui ( seq -- )
    HOOK: show-fatal-error ui ( error -- )

`M\ text show-progress` uses the symbols `bytes` and `count` to keep
track of the number of bytes downloaded and the proportion of
progress-bar fill respectively.

    : print-bar ( full chunk -- )
        count [
            [ swap / 50 * round ] dip [
                - CHAR: =
                 >string write
            ] [ drop ] 2bi
        ] change ;

    M: text show-progress
        swap bytes [ + [ print-bar ] keep ] change flush ;

    M: text show-begin-fetch
        "Fetching " write print "[" write flush ;

    M: text show-end-fetch
        "]" print flush ;

    M: text show-page-fetch
        "Fetching TVNZ page..." print flush ;

    M: text show-playlist
        length "Found " write number>string write " parts." print
        flush ;

    M: text show-fatal-error
        dup string? [ print ]
        [ drop "Oops! Something went wrong." print ] if 1 exit ;

Failed HTTP request errors need to be wrapped in a user friendly
explanation.

    : wrap-failed-request ( err -- * )
        [
            "HTTP request failed: " % [ message>> % ]
            [ " (" % code>> number>string % ")" % ] bi
        ] "" make throw ;

The playlist parameter in each episode’s web page is in a section of
code looking like this.

    var videoVars = {
        playlist: '/content/3685181/ta_ent_smil_skin.smil',
        config: '/fmsconfig.xml',
        ord: ord
    };

Given this code could change unpredictably, we’ll use nothing more
robust than a regular expression to get at the playlist path.

    : get-playlist ( url -- data )
        http-get [ check-response drop ]
        [ R/ (?<=playlist: ').*(?=')/ first-match ] bi* [
            "http://tvnz.co.nz" prepend http-get [
                [ check-response drop ]
                [ wrap-failed-request ] recover
            ] dip
        ] [ "Could not find playlist at address." throw ] if* ;

The playlist is an XML file of which only the `video` elements concern
us.

    <video src="path-to-segment.flv" systemBitrate="700000"/>

700000 appears to be the highest bit rate so that is what we’ll go for.

`parse-playlist` takes the output of `get-playlist` and returns a list
of URLs to episode segments.

    : parse-playlist ( data -- urls )
        bytes>xml body>> "video" "700000" "systemBitrate"
        deep-tags-named-with-attr
        [ [ drop "src" ] [ attrs>> ] bi at ] map [ ] filter ;

Each segment is downloaded in chunks.

    : call-progress ( data -- )
        length response get check-response
        "content-length" header string>number show-progress ;

    : process-chunk ( data stream -- )
        [ stream-write ] [ drop call-progress ] 2bi ;

    : get-video-segment ( url -- )
        [ show-begin-fetch ] [ ]
        [ part-name binary  ] tri
        [ '[ _ process-chunk ] with-http-get drop flush ]
        with-disposal show-end-fetch ;

    : get-video-segments ( urls -- )
        [ get-video-segment ] each ;

`grab-episode` is where the action starts.

    : (grab-episode) ( url -- )
        show-page-fetch get-playlist parse-playlist dup
        show-playlist [
            0 bytes count [ set ] bi-curry@ bi get-video-segments
        ] with-scope ;

    : grab-episode ( url -- )
        [ (grab-episode) ] [ nip show-fatal-error ] recover ;

For the complete program see [my
github](http://github.com/jedahu/vocabs/tree/master/tvnz-grab/).
