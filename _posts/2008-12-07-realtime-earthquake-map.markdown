---
layout: default
status: publish
published: true
title: Real-Time Earthquake Map
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
excerpt: |
  Flash, and Flex in particular, has a solid set of tools available ata visualization.  When I found that the USGS provided realtime earthquake data as csv files I couldn't resist building a viewer.  It's based on <a href="http://flowingdata.com/2008/09/03/how-to-create-a-real-time-web-traffic-map-for-your-site/">a traffic map by Nathan at Flowing Data</a>
  <a href="http://blog.mungosmash.com/wp-content/uploads/2008/12/quakes.swf"><img class="size-full wp-image-64" title="Quakes" src="http://blog.mungosmash.com/wp-content/uploads/2008/12/quakes.png" alt="" width="223" height="149" />
  </a>
wordpress_id: 58
wordpress_url: http://blog.mungosmash.com/?p=58
date: '2008-12-07 00:04:34 -0800'
date_gmt: '2008-12-07 08:04:34 -0800'
categories:
- Visualization
tags:
- Data
- Earthquake
- Flash
- Flex
- USGS
- Visualization
alias: /2008/12/realtime-earthquake-map/index.html
---
Flash, and Flex in particular, has a solid set of tools available ata visualization.  When I found that the USGS provided realtime earthquake data as csv files I couldn't resist building a viewer.  It's based on <a href="http://flowingdata.com/2008/09/03/how-to-create-a-real-time-web-traffic-map-for-your-site/">a traffic map by Nathan at Flowing Data</a><br />
<a href="http://blog.mungosmash.com/wp-content/uploads/2008/12/quakes.swf"><img class="size-full wp-image-64" title="Quakes" src="http://blog.mungosmash.com/wp-content/uploads/2008/12/quakes.png" alt="" width="223" height="149" /><br />
</a><br />
<a id="more"></a><a id="more-58"></a>

<h2>What is It</h2><br />
The map polls data from the USGS's realtime earthquake data stream. The resulting data is presented as a map with dots representing earthquakes and a 'seismograph' style chart below.  You can choose to view data from the previous week, current day or just the last hour.

<h2>How it's Built</h2><br />
The viewer is built completely in ActionScript using the Flex toolkit and the Flex Builder development environment.  The scrolling maps are all done with Modest Maps.  There is some minor glue code to pull the data from the USGS web page and csvlib is used to parse the results.

There are still a lot of user interaction features that would be nice to have, but the basics are all there.

<ul>
<li><a href="http://modestmaps.com/">Modest Maps</a></li>
<li><a href="http://earthquake.usgs.gov/eqcenter/catalogs/">USGS Data Feeds</a></li>
<li><a href="http://www.adobe.com/products/flex/">Adobe Flex SDK</a></li>
<li><a href="http://code.google.com/p/csvlib/">csvlib</a></li><br />
</ul>

<h2>Why not use Google Maps API?</h2><br />
I really don't like the look of google maps to be honest.  I think the markers are ugly and there isn't much choice for map style.  One of the biggest issues is that the code has to all be written in JavaScript which is not nearly as good when compared to ActionScript 3.  ModestMaps makes it easy to use Google's tile servers for the maps anyway, so there isn't much reason to write it all in JavaScript.

