---
status: publish
published: true
title: The Aperture Database Structure
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
excerpt: "I'm working on decoding the Aperture database structure.  Just playing around
  in the database has been very interesting.\r\n\r\n<i>Update: this was written with
  Aperture 1.0 in mind.  This is probably completely inaccurate now</i>\r\n\r\n"
wordpress_id: 32
wordpress_url: http://blog.mungosmash.com/?p=32
date: '2005-12-09 22:15:54 -0800'
date_gmt: '2005-12-10 06:15:54 -0800'
categories:
- Programming
tags:
- Aperture
- Photography
alias: /2005/12/the-aperture-database-structure/index.html
---
I'm working on decoding the Aperture database structure.  Just playing around in the database has been very interesting.

<i>Update: this was written with Aperture 1.0 in mind.  This is probably completely inaccurate now</i>

<a id="more"></a><a id="more-32"></a><br />
These tables are incomplete.  However, they do contain the columns that I used in my test queries.

Update: I just found a cool tool called <a href="http://sqlitebrowser.sourceforge.net/">SQLite Database Browser</a> that makes it much easier to look around the db than using the command line sqlite3 tool.

<table class='table table-condensed'>
    <thead>
        <tr><th colspan=2>The Tables</th></tr>
        <tr><th>Table Name</th><th>Description</th></tr>
    </thead>
    <tbody>
        <tr><td>ZRKARCHIVE</td><td></td></tr>
        <tr><td>ZRKARCHIVERECORD</td><td></td></tr>
        <tr><td>ZRKARCHIVEVOLUME</td><td></td></tr>
        <tr><td>ZRKFILE</td><td>Information about the on-disk files</td></tr>
        <tr><td>ZRKFOLDER</td><td></td></tr>
        <tr><td>ZRKIMAGEADJUSTMENT</td><td>Image adjustments made to versions</td></tr>
        <tr><td>ZRKMASTER</td><td>Information about master images</td></tr>
        <tr><td>ZRKPERSISTENTALBUM</td><td></td></tr>
        <tr><td>ZRKPROPERTYIDENTIFIER</td><td>Property types (and each keyword!?)</td></tr>
        <tr><td>ZRKSEARCHABLEPROPERTY</td><td>Links between properties and versions</td></tr>
        <tr><td>ZRKVERSION</td><td>Versions of all masters</td></tr>
    </tbody>
</table>

<table class='table table-condensed'>
    <thead>
        <tr><th colspan=2>Searchable Property</th></tr>
        <tr><th>Attribute Name</th><th>Description</th></tr>
    </thead>
    <tbody>
        <tr><td>Z_PK</td><td>A unique ID for this property link</td></tr>
        <tr><td>ZVERSION</td><td>Link to an image version in the ZRKVERSION table</td></tr>
        <tr><td>ZPROPERTYIDENTIFIER</td>
        <td>Link to the a property identifier in ZRKPROPERTYIDENTIFIER</td></tr>
    </tbody>
</table>

<table class='table table-condensed'>
    <thead>
        <tr><th colspan=2>Property Identifier</th></tr>
        <tr><th>Attribute Name</th><th>Description</th></tr>
    </thead>
    <tbody>
        <tr><td>Z_PK</td><td>A unique ID for this property description</td></tr>
        <tr><td>ZPROPERTYKEY</td><td>A description of this property</td></tr>
        <tr><td>ZPROPERTYTYPE</td><td>2=Keyword, 3=EXIF, 5=Aperture, 7=Timezone</td></tr>
    </tbody>
</table>

<table class='table table-condensed'>
    <thead>
        <tr><th colspan=2>Version</th></tr>
        <tr><th>Attribute Name</th><th>Description</th></tr>
    </thead>
    <tbody>
        <tr><td>Z_PK</td><td>A unique ID for this version</td></tr>
        <tr><td>ZFILE</td><td>Link to the original file in ZRKFILE</td></tr>
        <tr><td>ZMASTER</td><td>Link to the master image in ZRKMASTER</td></tr>
        <tr><td>ZDATELASTSAVEDINDATABASE</td><td>Time the image was last modified (NSDate)</td></tr>
    </tbody>
</table>

<table class='table table-condensed'>
    <thead>
        <tr><th colspan=2>Folder (projects and albums are considered folders)</th></tr>
        <tr><td><i>Attribute Name</i></td><td><i>Description</i></td></tr>
    </thead>
    <tbody>
        <tr><td>Z_PK</td><td>A unique ID for this folder</td></tr>
        <tr><td>ZLIBRARYRELATIVEPATH</td><td>Path relative to the root of the library</td></tr>
    </tbody>
</table>

<table class='table table-condensed'>
    <thead>
        <tr><td colspan=2>Master</td></tr>
        <tr><td><i>Attribute Name</i></td><td>Description</td></tr>
    </thead>
    <tbody>
        <tr><td>Z_PK</td><td>A unique ID for this master</td></tr>
        <tr><td>ZPROJECT</td><td>A link to the project this master is part of in ZRKFOLDER</td></tr>
    </tbody>
</table>

Here are some example queries:

Print out all properties that can be assigned to an image.

```sql
select ZPROPERTYKEY from ZRKPROPERTYIDENTIFIER
```

Print out all images that are part of project 51.

```sql
select * from ZRKMASTER where ZPROJECT=51
```

Search all properties of specific type (keywords):

```sql
select * from ZRKPROPERTYIDENTIFIER where ZPROPERTYTYPE=2
```

I would like to reproduce the database query that goes along with slowdown in the filter hud.  It involves selecting all property names for properties that are keywords and are assigned to versions of masters that are part of the selected folder.  It's hard to say and even harder to read the query that does it.

The brute force N^3 algorithm in psuedocode.  On my machine a query of the searchable property table keyed on a specific property indentifier takes around 0.009s of user time.  For my problem case that would be *600 versions * 118 keywords * 0.009 seconds = 10 minutes*.

```
foreach version in folder
foreach propertyidentifier of type 'keyword'
foreach searchableproperty with propkey of propertyidentifier.key
add keyword to hud
```

SQL provides a method for doing this in one query that will speed things up significantly.  Using the "IN" selection option you can build up combinations of queries.  Note that I'm not even using the speed optimized index data in the database and it's still really fast.

```sql
select ZPROPERTYKEY from ZRKPROPERTYIDENTIFIER where ZPROPERTYTYPE=2 and Z_PK in
(select ZPROPERTYIDENTIFIER from ZRKSEARCHABLEPROPERTY where ZVERSION in
(select Z_PK from ZRKVERSION where ZMASTER in
(select Z_PK from ZRKMASTER where ZPROJECT=61)))
```

```
Sean Houghton
Motorcycle
Crash
Trackday
Joel Pritchett
Stephane Etienne
Sean Houghton   People
Joel Pritchett  People
Stephane Etienne        People

real    0m0.269s
user    0m0.236s
sys     0m0.033s
```

Here's a selection to count the number of versions that had to be checked for keywords: 664.  Opening the filter hud with this folder takes 3 seconds in Aperture, but the database query only takes around 1/4 second of that.

```sql
select count(*) from ZRKVERSION where ZMASTER in
(select Z_PK from ZRKMASTER where ZPROJECT=61)
```

```
664
```
