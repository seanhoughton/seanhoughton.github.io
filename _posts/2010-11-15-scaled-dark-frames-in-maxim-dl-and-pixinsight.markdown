---
layout: default
status: publish
published: true
title: Scaled Dark Frames in MaxIm DL and PixInsight
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
wordpress_id: 656
wordpress_url: http://www.cerebiggum.com/?p=656
date: '2010-11-15 20:43:17 -0800'
date_gmt: '2010-11-16 04:43:17 -0800'
categories:
- Photography
tags:
- Astrophotography
- Photography
- PixInsight
- MaxIm DL
alias: /2010/11/scaled-dark-frames-in-maxim-dl-and-pixinsight/index.html
---
I'm evaluating MaxIm DL and PixInsight at the same time because I only want to purchase one image processing package.  The first significant obstacle I've come across is that PixInsight doesn't seem to scale dark frames very well.  I've run the exact same calibration process on the same image and I get completely different results with the two packages.  I'm testing using a 600 second raw image, a 300 second master dark frame, and a master bias frame.

<i>Please see <a href="http://www.astrophoto.net/calibration.htm">this page</a> for the basics of image calibration</i>

<center><br />
[latex size=2]I_{calibrated}=I_{raw} - (K_{scale}*(I_{dark}-I_{bias}) + I_{bias})[/latex]<br />
</center><br />
<br/>

<center>Using the following set of calibration frames...</center>

<table width="100%">
<tbody>
<tr>
<td>
<center><br />
[caption id="" align="aligncenter" width="105" caption="Raw"]<img title="Original" src="{{site.url_root}}/media/2010/11/Original.png" alt="" width="105" height="90" />[/caption]</td><br />
</center>

<td>
<center><br />
[caption id="" align="aligncenter" width="105" caption="Dark"]<img title="ST8300-Dark-300s-Bin1--15C" src="{{site.url_root}}/media/2010/11/ST8300-Dark-300s-Bin1-15C.png" alt="" width="105" height="90" />[/caption]</center></td>

<td><center><br />
[caption id="" align="alignnone" width="105" caption="Bias"]<img title="ST8300-Bias-Bin1--15C" src="{{site.url_root}}/media/2010/11/ST8300-Bias-Bin1-15C.png" alt="" width="105" height="90" />[/caption]</center></td><br />
</tr><br />
</tbody><br />
</table>

<br/><br />
<center>Resulting in completely different results...</center><br />
<br/>

<table>
<tbody>
<tr>
<td>
<center><br />
[caption id="" align="alignnone" width="105" caption="MaxIm DL"]<img title="MaximCalibrated" src="{{site.url_root}}/media/2010/11/MaximCalibrated.png" alt="" width="105" height="90" />[/caption]</center></td>

<td>
<center><br />
[caption id="attachment_664" align="alignnone" width="105" caption="PixInsight"]<a href="{{site.url_root}}/media/2010/11/PixInsightCalibratedNoOpt.png"><img src="{{site.url_root}}/media/2010/11/PixInsightCalibratedNoOpt.png" alt="" title="PixInsightCalibratedNoOpt" width="105" height="90" class="size-full wp-image-664" /></a>[/caption]<br />
</center></td>

<td>
<center><br />
[caption id="" align="alignnone" width="105" caption="PixInsight (optimized)"]<img title="PixInsightCalibrated" src="{{site.url_root}}/media/2010/11/PixInsightCalibrated.png" alt="" width="105" height="90" />[/caption]</center></td>

<td>
<center><br />
[caption id="" align="alignnone" width="105" caption="PixInsight (pixel math)"]<img title="PixelMath" src="{{site.url_root}}/media/2010/11/PixelMath.png" alt="" width="105" height="90" />[/caption]</center></td><br />
</tr><br />
</tbody><br />
</table><br />
<br/><br />
<i>Note: all images have been cropped and stretched for web display</i><br />
<br/>

<ul>
<li>Running the hot pixel at [29,59] through the equation we end up with 0.2360-(2*(0.2642-0.0179)+0.0179) =  -0.0282 which is probably clamped to "0".  This explains the black pixel in the PixelMath image.</li>
<li>PixInsight's optimized calibration module is doing almost nothing to the image.  However, the value changes by about 0.53% (from K=23.6% to K=23.07%)</li>
<li>MaxIm DL does an excellent job of scaling the dark frame.</li><br />
<Ii>PixInsight's non-optimized calibration does not seem to add a pedestal which results in lots of clipping at the low end</li><br />
</ul>

