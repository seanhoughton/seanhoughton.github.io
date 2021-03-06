---
alias: /2001/01/combining-lrgb-channels/index.html
categories:
- Photography
date: "2001-01-02T18:53:40Z"
excerpt: Many astrophotographs are taken as multiple monochromatic photos that need
  to be combined into a color finished product later.  Each photo editing package
  seems to have it's own method.  This is a short review of what I have.
tags:
- Astrophotography
- Photography
title: Combining LRGB Channels
---
Because most CCD cameras made for astronomy are monochromatic it is neccessary to place a series of filters over the camera and take seperate images that each cover a different spectral region. These images can then be combined to create a "true-color" image. The problem with placing filters over the camera is that it reduces the amount of light that strikes the chip. This means you need to take longer exposures. However, many CCD cameras have a feature called "binning" that allows you to add the values of 4 (or more) adjacent pixels into a single pixel. This results in a loss in noise (for reasons I will not get in to) and an apparent increase in sensitivity - meaning shorter exposures. The only bad part is that it cuts the resolution of the image in half.

A method has become popular that almost gives you the best of both worlds: fast / low-noise color exposures and high resolution detail. The idea is that you can take the color information from a low resolution color images and the luminance information from a greyscale hi-res image and combine them to produce a color hi-res image. It works well on many subjects (but falls short when dealing with objects that contain high frequency color data). There is more than one way to composite these two images (color and luminance). What follows is a comparison of the methods I have been able to use in Photoshop 4 and from images people have sent me using other applications.

These comparisons are really only applicable in comparing star images. For a great article on why LRGB doesn't always work for deep sky objects, have a look at Wil Milan's page here.

Original hires monochromatic and lowres color (RGB) images of simulated stars

![](1108604651_stars_hires.jpg)

![](1108604743_stars_lowres.jpg)


### Luminosity (Photoshop 4)

Copy both these images into seperate layers in Photoshop. Place the color image below the monochrome image. Then set the monochrome layer to use the "Luminosity" combine mode. Note that this is not the same as a `V` replacement in the `HSV` colorspace as I had origianly thought. If somebody can figure out how to make photoshop go into an `HSV` mode please let me know! If it's not possible I will consider writing a plugin that does this.


### LAB (Photoshop 4)

Load the color image and change it's mode to `LAB`. Then load in the monochrome image. Select the whole image with `Ctrl+A`, and copy it into the buffer with `Ctrl+C`. Now select the color image and click on the `L` channel in the channels tab. Press `Ctrl+V` to paste the monochrome image over the existing channel. This method results in a different look than Luminosity. The stars actually still have some color even when the `L` channel is maxed out at 100% which is odd. The pixels don't turn black when the L image is at 0% either.... hmmmm... The color seems to be a bit more consistant with `LAB`, but the colors are brighter in the Luminosity and would probably appear more colorfull when small. I like `LAB` and the MaximDL methods best (but mostly the MaximDL one!)

![](1108604800_stars_lab.jpg)


### CMYK (Photoshop 4)

Use the same steps as the `LAB` method except use `CMYK` mode and paste the monochrome image into the `K` (black) channel. This method isn't usually used as far as I know.

![](1108604830_stars_cmyk.jpg)


### LRGB (MaximDL)

![](1108604882_stars_maximdl.jpg)

*Courtesy of Ajai Sehgal*

In MaxIm DL Ajai converted the hirez to Monochrome and split the color one up into `RGB`. Ajai then used MaxIm's `LRGB` combine to do the `LRGB`. Here is the result (MaxIm appears to do a true `V` replace in `HSV`). In any case the result is pretty good.

