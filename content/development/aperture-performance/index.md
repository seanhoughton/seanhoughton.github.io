---
alias: /2005/12/aperture-performance/index.html
author: Sean
author_email: sean.houghton@gmail.com
author_login: Sean
categories:
- Photography
date: "2005-12-09T21:36:04Z"
date_gmt: 2005-12-10 05:36:04 -0800
excerpt: |+
  Apple's new Aperture program is awesome.  It's easily the best image cataloging program available, and it's in version 1.  However, the performance leaves quite a bit to be desired.  Here are the things I've discovered.

published: true
status: publish
tags:
- Aperture
- Photography
title: Aperture Performance
wordpress_id: 31
wordpress_url: http://blog.mungosmash.com/?p=31
---
Apple's new Aperture program is awesome.  It's easily the best image cataloging program available, and it's in version 1.  However, the performance leaves quite a bit to be desired.  Here are the things I've discovered.

<a id="more"></a><a id="more-31"></a><br />
I  used a combination of the <b>fs_usage</b> tool and the <b>Thread Viewer</b> tool to profile Aperture.  Both excellent tools are included in the Developer package.  I wanted to find out why it always takes 10 seconds for the search filter dialog to open up, causing the application to become unresponsive the entire time.

The results point to the database implementation.  Aperture uses a SQL database to store information about the images in the library.  Apple chose to use SQLite, probably because it's easy to embed into an application and doesn't require any additional setup.  The following image demonstrates the problem with it:

[image=ApertureThreads]

It appears that Aperture is performing a database query to decide which buttons to show in the filter hud.  This is perfectly reasonable and should happen nearly instantaneously.  It doesn't.  As I mentioned earlier, one of my projects contains just over 600 images and it takes 10 seconds to open the dialog.  I've confirmed that the keywords are the main problem by opening the dialog in a project with a similar number of non-keyworded images with minimal lag.

[image=ApertureFilterHud]

References:

<a title="Aperture internals" href="http://www.majid.info/mylos/stories/2005/12/01/apertureInternals.html">Aperture internals</a>

<a title="SQLite syntax" href="http://www.sqlite.org/lang.html">SQLite Command Reference</a>

<a title="Apple Performance Analysis Tools" href="http://developer.apple.com/documentation/Performance/Conceptual/PerformanceOverview/PerformanceTools/chapter_4_section_3.html">Apple Performance Analysis Tools</a>

