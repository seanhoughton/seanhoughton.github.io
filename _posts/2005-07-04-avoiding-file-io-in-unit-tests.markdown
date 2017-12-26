---
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
alias: /2005/07/avoiding-file-io-in-unit-tests/index.html
thumbnail: /system/images/code-thumb.png
---
Noel's article [Test-Driven Game Development](http://www.gamesfromwithin.com/articles/0503/000078.html) mentions that unit test suites should run quickly. That usually means as little file I/O as possible. However, sometimes you're dealing with middleware or legacy code that requires deserialization to construct objects. What do you do?

### The Problem

Let's say you have a class that can only be constructed with a stream, something like:

```cpp
class Mesh
{
public: Mesh(InStream& stream);
};
```

You would like to construct a Mesh in a test so you can check some functionality.  You could use a FileInStream like this:

```cpp
TEST(CorrectTriangleCount)
{
FileInStream stream("oneTriangle.mesh");
Mesh m(stream);
CHECK_EQUAL(1, m.GetTriangleCount());
}
```

However, that would mean file I/O every time the tests are run.  If you've configured your tests to run after every library change (a good practice) it can mean lots of wasted time.  Another, less obvious problem lies in the fact that the test can fail for two reasons: the code for `GetTriangleCount()` could be buggy, or someone may have deleted `onetriangle.mesh` not knowing it's part of the test suite.

### The 'Optimization' Solution

We can help the first problem and solve the second by adding the data file to the project and using a "Custom Build Rule" in Visual Studio.  Using a simple script we can transform the binary file into a text file containing a C-style array of `usigned char` values.  Here's a simple Python script that will take binary data from `stdin` and write an array of byte values to `stdout`.  Note that you'll want to add a binary `setmode()` call in Windows.

```python
#!/usr/bin/python
import sys
import array
import struct
import string
byteData = array.array('B', sys.stdin.read(-1))
byteList = byteData.tolist()
result = [str(b) + ",n" for b in byteList]
print string.join(result)
```

And your custom build rule on the binary file looks like:

```bash
cat "$(SourcePath)/$(FileName)" | BinaryToArray.py > "$(SourcePath)/$(FileName).inl"
```

This file can be included as static data in your test's cpp file and used with a memory stream in the test.

```cpp
const unsigned char oneTriangleMeshData[] =
{
#include "oneTriangle.mesh.inl"
};

TEST(CorrectTriangleCount)
{
MemoryInStream stream(oneTriangleMeshData, oneTriangleMeshData  + sizeof(oneTriangleMeshData));
Mesh m(stream);
CHECK_EQUAL(1, m.GetTriangleCount());
}
```

Assuming the deserialization runs quickly the test will run much faster.  As an added bonus the compiler will issue errors if the file is missing instead of the test failing at runtime.  Any error you can move out of the runtime and into compilation is a win in my book.

### The 'Fix The Fundamental Problem' Solution

The source of the problem is that the `Mesh` class couples construction with deserialization.  In my opinion, the best fix is to use the Construction Object pattern.  Extract all the deserialized data into a structure separate from the `Mesh` class.  Then, change your `Mesh` constructor to take a cinfo instead of a stream.  For example:

```cpp
struct MeshCInfo
{
int numTriangles;
//...
};

class Mesh
{
public: explicit Mesh(const MeshCInfo& cinfo);
};
```

Now you can construct your `Mesh` objects without any file I/O.  Most tests shouldn't require any complicated data to test functionality so they should be easy to hardcode into your tests and fixtures.

```cpp
TEST(CorrectTriangleCount)
{
MeshCInfo info;
info.triangleCount = 1;
Mesh m(info);
CHECK_EQUAL(1, m.GetTriangleCount());
}
```

One added benefit of Construction Info structures is that they tend to be very easy to deserialize. Some [clever people](http://alpatrick.blogspot.com) have even figured out ways to auto-generate the {de}serialization code.

