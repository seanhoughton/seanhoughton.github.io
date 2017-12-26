---
status: publish
published: true
title: Plume Lightwave Plugin
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
excerpt: While at VSI I got really interested in volume rendering and started writing
  a gas shader for Lightwave.  It was just starting to look like a decent product
  when I was hired at Gratuitous Games and stopped working on it.
wordpress_id: 643
wordpress_url: http://blog.mungosmash.com/?p=4
date: '2000-01-01 18:46:53 -0800'
date_gmt: '2000-01-02 02:46:53 -0800'
categories:
- Programming
tags:
- Graphics
alias: /2000/01/plume-lightwave-plugin/index.html
thumbnail: /media/2009/01/1108608735_plume_pic3.jpg
---
Plume is a volumtric renderer I have been working on for a while on my free time ( which explains the lag ). It is a pixel filter for Lightwave which originated as a stand alone Ray Marching program I wrote. I have ported it to lightwave and what follows are samle renderings. This is just the start of the project and I plan to have some downloadable beta versions soon. I have a Plume shader also which receives gas shadows for seamless integration into Lightwave renderings.

<a id="more"></a><a id="more-643"></a><img class="aligncenter size-full wp-image-272" title="1108608684_plume_pic1" src="{{site.url_root}}/media/2009/01/1108608684_plume_pic1.jpg" alt="1108608684_plume_pic1" width="250" height="329" />

This image demonstrates Plume's ability to use ParticleStorm data. Notice the mixing of colors between particles and the change from dense gas at the bottom to thin gas at the top. Currently, size, color, alpha, and age are supported parameters.

<img class="aligncenter size-full wp-image-273" title="1108608704_plume_pic2" src="{{site.url_root}}/media/2009/01/1108608704_plume_pic2.jpg" alt="1108608704_plume_pic2" width="196" height="240" />

Plume with multiple light source illumination. Any number of light sources can be used, although more lights means slower renders.

<img class="aligncenter size-full wp-image-275" title="1108608735_plume_pic3" src="{{site.url_root}}/media/2009/01/1108608735_plume_pic3.jpg" alt="1108608735_plume_pic3" width="400" height="400" />

Lightwave rendered with Plume applied to four particles in the center of the poles. Notice the shadows being cast by Plume gas onto the floor, and the shadows being cast by the poles onto the gas. Plume gas is rendered seamlessly with Lightwave renderings when the shadow shader is used on all surfaces.

