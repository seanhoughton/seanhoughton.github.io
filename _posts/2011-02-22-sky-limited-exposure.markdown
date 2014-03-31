---
layout: default
status: publish
published: true
title: Sky Limited Exposure
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
wordpress_id: 696
wordpress_url: http://www.cerebiggum.com/
date: '2011-02-22 21:35:27 -0800'
date_gmt: '2011-02-23 05:35:27 -0800'
categories: []
tags: []
---
<p>One of the fun technical challenges in astrophotography is the meticulous attention to detail that you must apply to every step. One of these details is correctly balancing the desire to take long exposures to minimize the effects of readout noise and the desire to take lots of short exposures to minimize the wasted time of an exposure with a random defect such as cosmic ray strikes or tracking errors. Additionally, multiple exposures lets you use advanced pixel rejection techniques that require many images to function well.</p>
<p>It turns out that you can derive an equation that takes the guesswork out of finding this balance. &Acirc;&nbsp;Until now you needed to manually collect various kinds of information from test images and hardware documentation and plug them into a formula by hand. &Acirc;&nbsp;This <a href="http://www.hiddenloft.com/notes/SubExposures.pdf" target="_blank">paper</a> does an excellent job explaining the ideas and formulas behind the process.</p>
<p>I've reduced some of the grunt work by writing a small script for <a href="http://pixinsight.com/" target="_blank">PixInsight</a> that takes an image (loaded with FITS information) as input and spits out a suggested sub-exposure length. &Acirc;&nbsp;It's important to use a test image that <strong>has</strong> been dark subtracted but <strong>has not</strong> been flat fielded.&Acirc;&nbsp;&Acirc;&nbsp;If you have lots of vignetting and you want a very accurate measurement you should extract small images from the edge of the field where the falloff is greatest and use that as your test image.</p>
<p><strong><span style="color: #008080;">Add pixinsight.cerebiggum.com to your PixInsight update list to download the most recent version.</span></strong></p>
<p><a href="{{site.url_root}}/assets/data/wp/wp/2010/11/SkyLimitedExposure-0.2.png"><img class="aligncenter size-full wp-image-673" title="SkyLimitedExposure-0.2" src="{{site.url_root}}/assets/data/wp/wp/2010/11/SkyLimitedExposure-0.2.png" alt="" width="383" height="834" /></a></p>
<p><a href="https://github.com/seanhoughton/CalculateSkyLimitedExposure"><img class="alignleft size-full wp-image-698" title="github" src="{{site.url_root}}/assets/data/wp/wp/2011/02/github.png" alt="" width="100" height="45" /></a></p>
