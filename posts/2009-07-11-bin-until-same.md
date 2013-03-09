---
title: ~/bin/until-same
date: 2009-07-11
tags: [shell]
---

Imagine you've started downloading a large file from a server which
doesn't support resuming. It's taking ages and you want to go to bed,
but you also don't want the computer to stay on unnecessarily after
completion of the download. What do you do?

You use `until-same`: a simple shell command that repeats a command
until it's output is the same twice in a row.

    $ until-same -h
    usage: until-same [ -v ] <interval> <command>

    $ until-same 1m ls -l large.iso ; hibernate

`<interval>` uses the same syntax as the sleep command (not the shell
builtin). `-v` simply prints the output of each command execution to
stdout.

And here's the script:

    #!/bin/sh

    verbose=0
    if [[ "$1" == "-v" ]]; then
        verbose=1
        shift
    fi

    if [[ "$1" == "-h" ]] || [[ -z "$1" ]] || [[ -z "$2" ]]; then
        echo "usage: until-same [ -v ] <interval> <command>"
        exit 1
    fi

    interval="$1"
    shift
    curr=`$@`
    prev="$curr NOTTHESAME"

    while [[ "$curr" != "$prev" ]]; do
        env sleep "$interval"
        prev="$curr"
        curr=`$@`
        [[ $verbose == 1 ]] && echo "$curr"
    done
