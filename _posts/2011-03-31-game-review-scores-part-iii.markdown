---
layout: default
status: publish
published: true
title: Game Review Scores - Part III
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
wordpress_id: 705
wordpress_url: http://www.cerebiggum.com/?p=705
date: '2011-03-31 23:50:35 -0700'
date_gmt: '2011-04-01 07:50:35 -0700'
categories:
- Visualization
tags: []
---
<h3>Scraping Data</h3><br />
All of the data used to build these visualizations was extracted from various web sites using a few <a href="http://www.python.org/">Python</a> scripts.  The <a href="http://www.crummy.com/software/BeautifulSoup/">Beautiful Soup</a> library was used to parse and traverse the HTML.</p>
<p>Google Chrome's developer tools are an excellent way to discover the structure of a web site so it can be traversed quickly with scripts.<br />
<a href="{{site.url_root}}/assets/data/wp/wp/2011/03/ChromeDevTools.png"><img class="aligncenter size-full wp-image-707" title="ChromeDevTools" src="{{site.url_root}}/assets/data/wp/wp/2011/03/ChromeDevTools.png" alt="" width="556" height="502" /></a></p>
<p>&nbsp;</p>
<p>Scraping data from web pages is easy as long as you completely ignore the impulse to follow good coding practices.  Don't feel bad about going gangbusters with <a href="http://en.wikipedia.org/wiki/Law_of_Demeter">Law of Demeter</a> violations - if the layout changes you'll probably have to rewrite it anyway.</p>
<p><code><br />
f = urllib.urlopen("www.seansdatagoldmine.com");<br />
s = f.read()<br />
f.close()<br />
soup = BeautifulSoup(s)<br />
chartDiv = soup.find("div", { "id" : "chart_body" } )<br />
chartTable = chartDiv.findAll(name="table",recursive=False)<br />
scoreValue = chartTable[3].findAll("span")[0].findAll("b")[0].text<br />
</code></p>
<p>Sometimes a simple text editor with regular expression features make things easy.  Visual Studio's search/replace is great for cleaning up data.</p>
<h3>Data Layout and Format</h3><br />
Most tabular data on the web is in some sort of "pivot" format.  That is, it's got more than one measure per row.  Tableau (and most database operations) work best when data is organized with a single measure per row.  This usually means un-pivoting the data in either the web scraping scripts or abusing <a href="http://spreadsheetpage.com/index.php/tip/creating_a_database_table_from_a_summary_table/">Excel's PivotTable</a> feature.</p>
<p>All of the data produced for this series was stored in multiple tab-delimited text files.  There was no need to import them into a database as Tableau can do join operations across text files.</p>
<h3>Visualization and Presentation</h3><br />
<a href="http://www.tableausoftware.com/">Tableau Desktop</a> was used to explore the data and arrive at the most interesting details that were worth publishing.  The workbook and data extracts were uploaded to <a href="http://www.tableausoftware.com/products/public">Tableau Public</a> so they could be embedded into posts.</p>
<h3>Analysis</h3><br />
Mathematica was used to match distributions, but nothing interesting came out of it so the results aren't included.</p>
