---
alias: /2005/07/better-photo-handling-in-movabletype/index.html
author: Sean
author_email: sean.houghton@gmail.com
author_login: Sean
categories:
- Programming
date: "2005-07-03T21:08:16Z"
date_gmt: 2005-07-04 05:08:16 -0700
excerpt: |+
  After getting sick at the XBox developer conference (and dosing up on plenty of dextromethorphan) I decided to move my website content over to MovableType.  I had been using a home-brew system but it was nowhere near as feature rich as the MT system.  However, I'm really happy with my old photo gallery system and wanted to be able to show photos from the gallery in my MT entries.

  It only took me about three hours to adapt my image embedding tags into a MT text formatting plugin.  I still have to port my gallery pages to MT templates, stay tuned for a page on that once I get it done.

published: true
status: publish
tags:
- Photography
title: Better Photo Handling In MovableType
wordpress_id: 19
wordpress_url: http://blog.mungosmash.com/?p=19
---
After getting sick at the XBox developer conference (and dosing up on plenty of dextromethorphan) I decided to move my website content over to MovableType.  I had been using a home-brew system but it was nowhere near as feature rich as the MT system.  However, I'm really happy with my old photo gallery system and wanted to be able to show photos from the gallery in my MT entries.

It only took me about three hours to adapt my image embedding tags into a MT text formatting plugin.  I still have to port my gallery pages to MT templates, stay tuned for a page on that once I get it done.

### The Goal

The default image linking in MT is pretty weak.  When you upload a file you have to choose a good location for it every time, then you have to paste HTML into your entry by hand.  I want to be able to just type [image=PalmTrees] or maybe [thumb=PalmTrees] and have the image show up in the post.

### Setup

You'll need a recent version of MovableType installed and working.  You'll also want a bit of Perl know-how.

In order to make this work you need a collection of images on your server and some way to get the full path of the image given the name.  I'm using a SQL database to do the name-to-path lookup, but you could also just use a file naming convention and put all your images in the same folder.

### Text Formatter Plugins

MovableType has special plugin type for text formatting.  All it does is feed you a bunch of strings and you can do whatever you want to them and return the results.  This makes it really easy to add custom tag support.  We're going to use that feature to replace our custom image tag with a standard html img tag that points to the image file.

Create the new plugin script in the plugin folder of your MT install.  Mine is at

`/www/cgi-bin/MovableType/plugins/MungoFormatter.pl`

First, you'll need to register your formatter with MT using the MT interface.

```perl
use MT;
MT->add_text_filter(
'my_text_format' => {
label => 'MyTextFormat',
on_format => &applyFormat
}
);
```

Next, you need to implement the 'applyFormat' method to do the work.  Regular expressions are the best way to substitute text in Perl so we'll use them.  I use the 'e' option at the end of the regexp so Perl will evaluate the substitution and call the <i>getPhotoHTML</i> method for each occurrance.  I'll leave it up to you to implement the <i>getPhotoHTML</i> method.

```perl
sub applyFormat
{
my $text = shift;
$text =~ s/[(w+)=(w+)]/getPhotoHTML($1, $2)/ge;
return $text;
}
```

My site does a mySQL lookup with 'name' and returns an img tag (it also wraps the image with an anchor that links to the photograph detail page).  You could also just prepend a path and append an extension and be done with it.  If you've got an account on one of those internet photo storage sites there may be an easy way to link by name.

```perl
sub getPhotoHTML
{
my $imageType = shift;
my $imageName = shift;

# lookup 'name' in a SQL database
# or, wrap 'name' with path and extension data, like "/images/$name.jpg" or something
# or, do something else

return $html;
}
```

Now, whenever you create your entries you can use the [image=name] syntax and place images the easy way.

### Details

Ok, so there's one thing missing from this filter - line breaks.  The stock filter will add 'br' tags to whatever you write to keep the paragraphs looking right.  You'll probably want to add another substitution to make this work with your filter.  Mine replaces carriage returns with breaks and looks like:

```perl
$text =~ s/[nr]/<br/>/g;
```

