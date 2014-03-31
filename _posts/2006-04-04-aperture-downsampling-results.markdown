---
layout: default
status: publish
published: true
title: Aperture Downsampling Results
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
excerpt: |+
  Most of the time we want more resolution in our images so they can be printed on bigger and bigger  formats.  However, for web publishing it's important to have quality downsized version of our images.  A question about how Aperture does this was raised on the <a href="http://discussions.apple.com/category.jspa?categoryID=184">Aperture discussion group</a> about image downsizing.  I used a few test images from <a href="http://oshyan.ashundar.com/image_resampling_main.html">Oshyan Greene's website</a> to find out.<br/><br/>

wordpress_id: 38
wordpress_url: http://blog.mungosmash.com/?p=38
date: '2006-04-04 22:12:04 -0700'
date_gmt: '2006-04-05 06:12:04 -0700'
categories:
- Photography
tags:
- Aperture
- Photography
alias: /2006/04/aperture-downsampling-results/index.html
---
Most of the time we want more resolution in our images so they can be printed on bigger and bigger  formats.  However, for web publishing it's important to have quality downsized version of our images.  A question about how Aperture does this was raised on the <a href="http://discussions.apple.com/category.jspa?categoryID=184">Aperture discussion group</a> about image downsizing.  I used a few test images from <a href="http://oshyan.ashundar.com/image_resampling_main.html">Oshyan Greene's website</a> to find out.<br/><br/>

<a id="more"></a><a id="more-38"></a><br />
Here are the results.  It's hard to tell exactly what algorithm Apeture is using, but it's probably bilinear filtering since it's very easy to do using the GPU.  However, many other kernels could be implemented using pixel shaders.<br />
<br/>

Please compare these to the other results on Oshyan's site.  After all, once Aperture 1.1 comes out people will need something to freak out about other than RAW conversion.<br />
</br>

Oh, and remember that resolution test images are not always good representations of what the algorithm will look like with normal images.  However, it does give you a good idea of the general behavior of the algorithm.

<mtgib:thumb id=463/>

<mtgib:thumb id=467/>

<mtgib:thumb id=470/>

