---
alias: /2006/04/finding-duplicate-images-in-aperture/index.html
categories:
- Photography
- Programming
date: "2006-04-08T19:47:55Z"
excerpt: |+
  While playing around with the Aperture database I decided to try to make something useful.  The result is an Automator workflow that looks for duplicate master image names.

header:
featured_image: /articles/development/finding-duplicate-images-in-aperture/teaser.png
tags:
- Aperture
- Photography
thumbnail: /system/images/code-thumb.png
title: Finding Duplicate Images in Aperture
---
While playing around with the Aperture database I decided to try to make something useful.  The result is an Automator workflow that looks for duplicate master image names.

<a id="more"></a><a id="more-39"></a><br />
Here's the result.  Disclaimer: it's not pretty and the output goes so TextEdit instead of some fancy Cocoa application or Aperture album.  Please give it a try and let me know if anything goes wrong.<br />
<br/><br/><br />
<a href="http://mungosmash.com/MediaPool/FindApertureDuplicates-0.1.zip">Find Aperture Duplicates v0.1</a>

<br/><br/>

<ul>TODO

<li>Print the project in which each duplicate exists</li>
<li>Figure out how to create a 'duplicates' album with AppleScript</li>
<li>Figure out how to do the query using AppleScript instead of sqlite3 and direct database access</li>
<li>Use capture date to eliminate false positives</li><br />
</ul>

