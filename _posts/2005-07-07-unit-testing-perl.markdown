---
layout: default
status: publish
published: true
title: Unit Testing Perl
author: Sean
author_login: Sean
author_email: sean.houghton@gmail.com
excerpt: |+
  While working on a small script at work today it occurred to me that had I been writing it in C++ I would have already had quite a few tests for the logic I had written.  In a fit of madness I wrote a small test function in Perl and called it from the start of the script.  After working on a couple more tests to verify some subroutines that I wasn't sure were working properly I realized that I had more test code than script code!  By the time the script was done I had twice as much test code as script code and <b>my ass had been saved many times by the tests</b>.

wordpress_id: 22
wordpress_url: http://blog.mungosmash.com/?p=22
date: '2005-07-07 21:07:47 -0700'
date_gmt: '2005-07-08 05:07:47 -0700'
categories:
- Programming
tags:
- TDD
- Unit test
alias: /2005/07/unit-testing-perl/index.html
---
While working on a small script at work today it occurred to me that had I been writing it in C++ I would have already had quite a few tests for the logic I had written.  In a fit of madness I wrote a small test function in Perl and called it from the start of the script.  After working on a couple more tests to verify some subroutines that I wasn't sure were working properly I realized that I had more test code than script code!  By the time the script was done I had twice as much test code as script code and <b>my ass had been saved many times by the tests</b>.

<a id="more"></a><a id="more-22"></a><br />
At the time I was sitting with someone who had minimal experience with unit tests and TDD, but he quickly got into it.  I've noticed that programmers are reluctant to write tests with projects they start from scratch, but once they sit down and work in an environment that already has a testing harness set up they are quick to adapt.

This script was supposed to be really small.  That's how all Perl scripts start, right?  Anyway, it quickly became obvious that the most error prone part of the code was the set of regular expression substitutions we were using to do the heavy lifting in the script.  We found that refactoring the script into many subroutines consistently made both testing easier and the code more readable (Perl readable!?).  Here's the simple way we organized the script;

<pre lang="perl">
#!/usr/bin/perl<br />
use strict;

RunTests();<br />
DoWork();

sub DoWork<br />
{<br />
# use ApplySubstitution() in some fancy way<br />
}

sub ApplySubstitution<br />
{<br />
...<br />
}

#### Unit Tests Follow ####

sub TestSpacesAreConvertedIntoUnderscores<br />
{<br />
$result = ApplySubstitution("Two words");<br />
$expected = "Two_Words";<br />
CheckEqual($expected, $result);<br />
}

sub TestLeadingWhitespaceIsRemoved<br />
{<br />
$result = ApplySubstitution("  Word  ");<br />
$expected = "Words";<br />
CheckEqual($expected, $result);<br />
}

sub CheckEqual<br />
{<br />
($expected, $actual) = @_;<br />
die "'$expected' does not equaln'$actual'" if ($actual ne $expected);<br />
}

sub RunTests<br />
{<br />
TestSpacesAreConvertedIntoUnderscores();<br />
TestLeadingWhitespaceIsRemoved();<br />
}<br />
</pre>

Our substitution was moderately complex, but you get the idea.  Now, all that is required to add a new test is to write it and add it to the RunTests subroutine.  This worked really well for the smallish (~3 pages) script that we wrote.  After finding a few problems in the results when running it on a large dataset we just replicated each problem in a new test case and worked on the code until it passed.   The script and tests took about 6 hours to write.

I've since found a few test modules for Perl that might be worth looking in to, but this method was extremely easy to create and work with and required no special modules or had any APIs to learn.

For reference, here are some articles on Perl and unit testing.  Since I only write relatively small Perl scripts I'm going to stick with my easy method for now.

<a href="http://perlunit.sourceforge.net/">PerlUnit Framework</a><br />
<a href="http://www.extremeperl.org/bk/unit-testing">Extreme Perl: Unit Testing</a><br />
<a href="http://www.perl.com/pub/a/2001/12/04/testing.html">An Introduction to Testing</a>

