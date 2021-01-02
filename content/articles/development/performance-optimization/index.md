---
alias: /2006/07/performance-optimization/index.html
categories:
- Programming
date: "2006-07-02T23:33:31Z"
excerpt: |+
  Results of performance optimization study on both PowerPC and CoreDuo machines.  100 runs of the same two functions were done and the best time from each is recorded as changed are made to the code and compiler flags.

  The "Sum" test sums 10,000 vectors (c = a + b).

  The "Diffuse" test runs a fluid diffusion pass on a 2D array of vectors.

header:
featured_image: /articles/development/performance-optimization/teaser.png
tags:
- CoreDuo
- G5
- Optimization
- Performance
thumbnail: /system/images/code-thumb.png
title: Performance Optimization
---
Results of performance optimization study on both PowerPC and CoreDuo machines.  100 runs of the same two functions were done and the best time from each is recorded as changed are made to the code and compiler flags.

The "Sum" test sums 10,000 vectors (c = a + b).

The "Diffuse" test runs a fluid diffusion pass on a 2D array of vectors.

<a id="more"></a><a id="more-43"></a>

<h2>PowerPC (G5 1.8Ghz)</h2>

<table width="100%">
<tr>
<td>Change</td>
<td>Sum</td>
<td>Diffuse</td></tr>

<tr>
<td>Baseline</td>
<td>28ms</td>
<td>48ms</td></tr>

<tr>
<td>Switch to vFloat type</td>
<td>68ms</td>
<td>116ms</td></tr>

<tr>
<td>'inline' Vector ctor</td>
<td>69ms</td>
<td>128ms</td></tr>

<tr>
<td>AltiVec Vector functions</td>
<td>27ms</td>
<td>62ms</td></tr>

<tr>
<td>'inline' AltiVec functions</td>
<td>25ms</td>
<td>58ms</td></tr>

<tr>
<td>'inline' getNeighborSum()</td>
<td>25ms</td>
<td>38ms</td></tr>

<tr>
<td>Hand tune diffuse with vec_madd</td>
<td>n/a</td>
<td>23ms</td></tr>

<tr>
<td>-mtune=G5</td>
<td>24ms</td>
<td>22ms</td></tr>

<tr>
<td>-ffast-math=16</td>
<td>24ms</td>
<td>22ms</td></tr>

<tr>
<td>-falign-loops=16</td>
<td>24ms</td>
<td>22ms</td></tr><br />
</table>

<h2>Intel (Core Duo 2Ghz)</h2>

<table width="100%">
<tr>
<td>Change</td>
<td>Sum</td>
<td>Diffuse</td></tr>

<tr>
<td>Baseline</td>
<td>43ms</td>
<td>81ms</td></tr>

<tr>
<td>Inline SSE</td>
<td>18ms</td>
<td>29ms</td></tr><br />
</table>

