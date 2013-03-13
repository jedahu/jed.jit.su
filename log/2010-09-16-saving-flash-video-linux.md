---
title: Saving flash video on linux
date: 2010-09-16
tags: [shell]
---

On linux, the flash-player caches video in files under `/tmp`. Each
video gets a file called `/tmp/Flash[random-string]`. These are easy
enough to find and rename to `[meaningful-string].flv`. However, some
players delete these files on completion, which is a pain given they are
the files containing the video we want to save.

Hard linking these files solves the problem. The `Flashxxx` files will
be deleted by the player, but their contents will sill be available at
whatever location we made the hard link.

Some players split their content into multiple files, so we want this
hard linking process to be automatic.

I have the following script saved as `lnflv` in my `~/bin`.

    #!/bin/sh

    cd /tmp
    for x in Flash*; do
        count=`find . -xdev -samefile "$x" | wc -l`
        if [ $count -gt 1 ]; then
            echo "Not linking $x. Already linked."
        else
            echo "Linking $x."
            ln "$x" "dl-$x.flv"
        fi
    done

Run it every thirty seconds like this: `watch -n30 lnflv`. Each flash
file not already hard linked will be linked to `/tmp/dl-Flashxxx.flv`.

Order by time and rename video parts with something like this:

    alpha=a
    for f in `find . -size +10M -name dl-Flash\* | xargs ls -tr`; do
        cp "$f" [name]$alpha.flv
        alpha=`echo -n $alpha | tr 'a-y' 'b-z'`
    done

Change `[name]` to the name of whatever you are watching. `"-size +10M"`
filters out files smaller than 10MB; this screens out short ads and is
only required for video streams that embed them.
