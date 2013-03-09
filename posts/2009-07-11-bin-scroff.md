---
title: ~/bin/scroff
date: 2009-07-11
tags: [shell]
---

I play movies using mplayer, and it's somewhat annoying when my screen
goes to sleep after half an hour. `scroff` runs a command with
gnome-screensaver or DPMS disabled (depending on which is available).

    $ scroff mplayer big_buck_bunny_720p_stereo.ogg

And the script:

    #!/bin/sh

    if [[ -x `which gnome-screensaver-command 2>/dev/null` ]]
    then
        gnome-screensaver-command --inhibit &
        pid=$!
        "$@"
        kill $pid
    elif [[ -x `which xset` ]] \
        && [[ `xset q | grep "DPMS is Enabled"` ]]
    then
        xset -dpms
        "$@"
        xset +dpms
    else
        "$@"
    fi

Since I use mplayer all the time I've saved the following as
\~/bin/mplayer:

      #!/bin/sh

      scroff /usr/bin/mplayer "$@"
