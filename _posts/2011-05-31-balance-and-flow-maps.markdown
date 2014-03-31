---
layout: default
status: publish
published: true
title: Balance and Flow Maps
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
wordpress_id: 714
wordpress_url: http://www.cerebiggum.com/?p=714
date: '2011-05-31 22:37:24 -0700'
date_gmt: '2011-06-01 06:37:24 -0700'
categories:
- Visualization
tags:
- Data
- Games
- Visualization
- Tableau
---
<p>Heatmaps are an excellent tool for visualizing data with a two dimensional spatial component. They are frequently used to map out player deaths in shooter games. The most common heatmaps use the location of the victim and aggregate the number of kills as the visualized measure. However, this simple metric doesn't tell the whole story. With a few simple tweaks we can build balance and flow maps, which can be useful tools for understanding the way players use the map.</p>
<p>This article uses data from the Molten map in Transformers: War for Cybertron.  I've annotated some interesting features in the following image, but playing the map is probably the best way to get a feel for the layout.<br />
[caption id="" align="aligncenter" width="600" caption="The Molten Map"]<img alt="" src="{{site.url_root}}/assets/data/wp/wp/2011/05/Molten-Diagram.png" width="600" height="384" />[/caption]</p>
<h4>Death Heatmaps</h4><br />
Let's start with a basic "Death" heatmap. This visualization is fairly easy to build.  Each kill is binned based on the victim's location and the number of records in each bin is measured. Adding a thermal colormap makes it easy to differentiate the values.</p>
<p><a href="{{site.url_root}}/assets/data/wp/wp/2011/05/DeathHeatmap.png"><img class="aligncenter size-full wp-image-715" src="{{site.url_root}}/assets/data/wp/wp/2011/05/DeathHeatmap.png" alt="" width="684" height="584" /></a></p>
<p>We can clearly see that there is a lot of action on the bridge the center of the map. The deaths are clustered here, probably because the bridge acts as an elevated choke point. Please disregard the various clusters of four hot pixels near the edges, these are spawn-points and are subject to unusually high kill and death counts.</p>
<h4>Kill Heatmaps</h4><br />
Kill heatmaps are nearly identical to death heatmaps, the only difference being that they aggregate the kills based on the location of the killer instead of the victim.</p>
<p><a href="{{site.url_root}}/assets/data/wp/wp/2011/05/KillHeatmap.png"><img class="aligncenter size-full wp-image-716" src="{{site.url_root}}/assets/data/wp/wp/2011/05/KillHeatmap.png" alt="" width="684" height="584" /></a></p>
<h4>Balance Heatmaps</h4><br />
Although the kill and death heatmaps are very similar, if you look closely you will see areas that differ. This indicates that some areas of the map do not have a perfect kill:death balance. If we subtract the the Death Heatmap totals from the Kill Heatmap totals we get a Balance Heatmap. Areas with positive values (i.e. more kills than deaths) represent effective killing spots, whereas areas with negative values (i.e. more deaths than kills) should probably be avoided.</p>
<p><a href="{{site.url_root}}/assets/data/wp/wp/2011/05/BalanceHeatmap.png"><img class="aligncenter size-full wp-image-717" src="{{site.url_root}}/assets/data/wp/wp/2011/05/BalanceHeatmap.png" alt="" width="684" height="584" /></a></p>
<p>This view of the data does a much better job at highlighting the dangerous places in the map.  We can see the centers of hallways are much safer than the large, open areas in the center of the map.  Also, walls in general seem to be very dangerous - probably because your movement is restricted and it's much easier to get hit with splash damage. The ridges surrounding the low areas in the center of the map illustrate where balance heatmaps differ significantly from kill heatmaps - the kill heatmaps don't highlight them, but the balance maps do.</p>
<p>The raw balance exaggerates areas containing many samples.  This produces a nice saturation boost in high-activity areas.  However, the data can be normalized to even out the tones.</p>
<h4>Normalized Balance Heatmaps</h4><br />
The "normalization" happens within each cell.  The raw balance is divided by the number of samples in each cell.  The value is now in the range [-1,1] and this gives the entire heatmap a more consistent saturation.  Unfortunately the lack of data in the outer areas introduces some noise, but I think it's an acceptable artifact.</p>
<p><a href="{{site.url_root}}/assets/data/wp/wp/2011/05/NormalizedBalanceHeatmap.png"><img class="aligncenter size-full wp-image-718" src="{{site.url_root}}/assets/data/wp/wp/2011/05/NormalizedBalanceHeatmap.png" alt="" width="684" height="584" /></a></p>
<h4>Gradient Maps</h4><br />
Using the same kill data we can perform another aggregation - the kill gradient for each cell.  This is simply the average direction of each kill in each cell.  The result is a vector field representing the most common direction of each kill.  A long vectors indicates a very advantageous firing direction. If we introduce some particles to trace the field some interesting patterns start to emerge.</p>
<p>[caption id="attachment_731" align="aligncenter" width="550" caption="FlowMap (click for interactive version)"]<a href="{{site.url_root}}/assets/data/wp/wp/2011/05/index.html"><img class="size-full wp-image-731" src="{{site.url_root}}/assets/data/wp/wp/2011/05/FlowMapThumbnail-e1306866180634.jpg" alt="" width="550" height="354" /></a>[/caption]</p>
<p>The flowlines trace good "run and gun" paths to try.  This technique is easy to adapt to victim data as well, with the flowlines tracing out the safest retreat paths.</p>
<h4>Future Exploration and Limitations</h4><br />
These visualizations are a good starting point for understanding the way people are playing the map. The flow data is ripe for more analysis. One option is to build an kill adjacency matrix for each cell and visualize it using a mouse probe in Processing.  Combining the balance and flow data may also yield some interesting insights. Filtering the data by weapon type may illustrate differing strategies.</p>
<p>Like any technique there are some limitations to be aware of.  First and foremost, balance heatmaps require a lot of data and are therefore not very practical as a development tool.  Reducing the size of each bin will reduce the noise level, but each bin requires at least a few hundred samples to be useful.  These images were made with millions of rows (a volume of data that internal play-testing is unlikely to produce) and they still exhibit some noise in the outer areas of the map.</p>
<p>Another limitation is the projection of 3D data into a 2D plane. For example, the center of this map contains a bridge and the flattening distorts the values.  Jim Blackhurst recently <a href="http://jimblackhurst.com/wp/?p=213">posted an article</a> about his experiences rendering this type of data as 3D point clouds.</p>
<p>Finally, these techniques require that you have location information for both the killer and the victim for each kill.  This will increase the size of the telemetry payload. Kill tables can grow very large and if bandwidth or disk space is a problem this may be too much additional information.</p>
<h4>Technical Details</h4><br />
The article uses data from Transformers: War for Cybertron. The dataset is composed of 30 million rows collected from public Team Deathmatch games in the Molten map. All the data is stored in an <a href="http://www.infobright.com/">InfoBright/MySQL database</a>. The heatmaps were generated in <a href="http://www.tableausoftware.com">Tableau</a>. The flow visualization was done in <a href="http://processing.org/">Processing</a>.</p>
<p>Most of the SQL queries use the following structure.  The ROUND and GROUP BY statements are very useful tools for building this type of visualization.  For example:</p>
<pre name="code" class="sql">
SELECT x,y,SUM(kills) AS counter FROM<br />
    (SELECT ROUND(x/100)*100 AS x,ROUND(y/100)*100 AS y,1 AS kills FROM kill_table)<br />
GROUP BY x,y<br />
</pre></p>
<p>Anyone who wants to play this map can download the free multiplayer demo in the Xbox LIVE marketplace <a href="http://marketplace.xbox.com/en-US/Product/Transformers-War-for-Cybertron-Multiplayer-Demo/00000000-0000-400d-80df-000141568885">here</a>. Maybe this post will help your score!</p>
<p>In future posts I'll discuss alternative methods of rendering heatmaps and the web-based tools in place at <a href="http://www.highmoonstudios.com/">High Moon Studios</a> for creating them.</p>
