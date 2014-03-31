---
layout: default
status: publish
published: true
title: Avoiding File I/O In Unit Tests
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
excerpt: "Noel's article <a title=\"Games from Within: Stepping Through the Looking
  Glass: Test-Driven Game Development (Part 3)\" href=\"http://www.gamesfromwithin.com/articles/0503/000078.html\">Test-Driven
  Game Development</a> mentions that unit test suites should run quickly.  That
  usually means as little file I/O as possible.  However, sometimes you're dealing
  with middleware or legacy code that requires deserialization to construct objects.
  \ What do you do?\r\n\r\n"
wordpress_id: 20
wordpress_url: http://blog.mungosmash.com/?p=20
date: '2005-07-04 13:58:40 -0700'
date_gmt: '2005-07-04 21:58:40 -0700'
categories:
- Programming
tags:
- Programming
- TDD
- Unit test
---
<p>Noel's article <a title="Games from Within: Stepping Through the Looking Glass: Test-Driven Game Development (Part 3)" href="http://www.gamesfromwithin.com/articles/0503/000078.html">Test-Driven Game Development</a> mentions that unit test suites should run quickly.  That usually means as little file I/O as possible.  However, sometimes you're dealing with middleware or legacy code that requires deserialization to construct objects.  What do you do?</p>
<p><a id="more"></a><a id="more-20"></a></p>
<h4>The Problem</h4></p>
<p>Let's say you have a class that can only be constructed with a stream, something like:</p>
<pre name="code" class="cpp">
class Mesh<br />
{<br />
public: Mesh(InStream& stream);<br />
};<br />
</pre></p>
<p>You would like to construct a Mesh in a test so you can check some functionality.  You could use a FileInStream like this:</p>
<pre name="code" class="cpp">
TEST(CorrectTriangleCount)<br />
{<br />
FileInStream stream("oneTriangle.mesh");<br />
Mesh m(stream);<br />
CHECK_EQUAL(1, m.GetTriangleCount());<br />
}<br />
</pre></p>
<p>However, that would mean file I/O every time the tests are run.  If you've configured your tests to run after every library change (a good practice) it can mean lots of wasted time.  Another, less obvious problem lies in the fact that the test can fail for two reasons: the code for <i>GetTriangleCount()</i> could be buggy, or someone may have deleted "onetriangle.mesh" not knowing it's part of the test suite.</p>
<h4>The 'Optimization' Solution</h4></p>
<p>We can help the first problem and solve the second by adding the data file to the project and using a "Custom Build Rule" in Visual Studio.  Using a simple script we can transform the binary file into a text file containing a C-style array of usigned char values.  Here's a simple Python script that will take binary data from stdin and write an array of byte values to stdout.  Note that you'll want to add a binary setmode() call in Windows.</p>
<pre name="code" class="python">
#!/usr/bin/python<br />
import sys;<br />
import array;<br />
import struct;<br />
import string;<br />
byteData = array.array('B', sys.stdin.read(-1))<br />
byteList = byteData.tolist();<br />
result = [str(b) + ",n" for b in byteList]<br />
print string.join(result);<br />
</pre></p>
<p>And your custom build rule on the binary file looks like:</p>
<pre name="code" class="bash">
cat "$(SourcePath)/$(FileName)" | BinaryToArray.py > "$(SourcePath)/$(FileName).inl"<br />
</pre></p>
<p>This file can be included as static data in your test's cpp file and used with a memory stream in the test.</p>
<pre name="code" class="cpp">
const unsigned char oneTriangleMeshData[] =<br />
{<br />
#include "oneTriangle.mesh.inl"<br />
};</p>
<p>TEST(CorrectTriangleCount)<br />
{<br />
MemoryInStream stream(oneTriangleMeshData, oneTriangleMeshData  + sizeof(oneTriangleMeshData));<br />
Mesh m(stream);<br />
CHECK_EQUAL(1, m.GetTriangleCount());<br />
}<br />
</pre></p>
<p>Assuming the deserialization runs quickly the test will run much faster.  As an added bonus the compiler will issue errors if the file is missing instead of the test failing at runtime.  Any error you can move out of the runtime and into compilation is a win in my book.</p>
<h4>The 'Fix The Fundamental Problem' Solution</h4></p>
<p>The source of the problem is that the 'Mesh' class couples construction with deserialization.  In my opinion, the best fix is to use the Construction Object pattern.  Extract all the deserialized data into a structure separate from the Mesh class.  Then, change your Mesh constructor to take a cinfo instead of a stream.  For example:</p>
<pre name="code" class="cpp">
struct MeshCInfo<br />
{<br />
int numTriangles;<br />
//...<br />
};</p>
<p>class Mesh<br />
{<br />
public: explicit Mesh(const MeshCInfo& cinfo);<br />
};<br />
</pre></p>
<p>Now you can construct your Mesh objects without any file I/O.  Most tests shouldn't require any complicated data to test functionality so they should be easy to hardcode into your tests and fixtures.</p>
<pre name="code" class="cpp">
TEST(CorrectTriangleCount)<br />
{<br />
MeshCInfo info;<br />
info.triangleCount = 1;<br />
Mesh m(info);<br />
CHECK_EQUAL(1, m.GetTriangleCount());<br />
}<br />
</pre></p>
<p>One added benefit of Construction Info structures is that they tend to be very easy to deserialize.  Some <a href="http://alpatrick.blogspot.com">clever people</a> have even figured out ways to auto-generate the {de}serialization code.</p>
