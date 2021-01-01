#!/usr/bin/env bash

for f in *.md
do
    folder=$(echo -n $f | awk '{print substr($0, 12, length($0)-14)}')
    mkdir $folder && mv $f $folder/index.md
done