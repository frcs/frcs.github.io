---
layout: post
title: FFMPEG commands for uploading 360 videos with spatial audio to YouTube
tags:
- 3D, VR
comments: true
---

It has been a few weeks since we've recorded [Trinity360]({% post_url 2016-04-19-trinity360 %})'s event and we've started rendering a 360 video with spatial audio.

Thanks to the audio team of Prof Boland from the [Sigmedia](http://sigmedia.tv) research group of Trinity College Dublin, Google has brought spatial audio support to Google Cardboard's virtual reality system (see [Google Developers Blog](http://goo.gl/UMShaX)). So now we can experience spatial audio on YouTube!

I've detailed below the `ffmpeg` commands we used to upload 360 videos with spatial audio to YouTube. We have followed the instructions set on the [YouTube help](https://support.google.com/YouTube/answer/6395969?hl=en&ref_topic=2888648). We also wanted to preview our footage using the jump inspector and thus we also conformed using instructions [here](https://support.google.com/jump/answer/6395819).



## Video encoding

Our stitched 360-mono video is named `trinity360-stitched.video.mov` and we'll target a video stream with the following specs:

* h264 main profile
* 40 Mbit/s
* 3840 by 2160 resolution
* 30 fps
* YUV 4:2:0 progressive

```
ffmpeg -i trinity360-stitched.video.mov              \
       -c:v libx264 -b:v 40m -vf scale=3840:2160     \
       -r 30 -profile main -pix_fmt yuv420p          \
       trinity360.encodedforjump.video.360.mono.mp4
```

Now, it is important for the jump inspector that the file ends with `.360.mono.mp4` (but it doesn't for YouTube).


## Audio encoding

Our Ambisonics are a 4 channel wav file (44.1kHz, 16bit) in the ACN SN3D Ambisonics format specified by YouTube. To work with jump inspector, we converted these for to `aac` 128k as follows:

```
ffmpeg -i trinity360-Tetra-B-format-ACN-SN3D-4ch.wav     \
       -channel_layout 4.0 -c:a aac -b:a 128k -strict -2 \
       trinity360-ACN-SN3D-4ch-aac128.mp4
```

## Combining Audio and Video

```
ffmpeg -i trinity360.encodedforjump.video.360.mono.mp4   \
       -i trinity360-ACN-SN3D-4ch-aac128.mp4             \
       -channel_layout 4.0 -c:a copy -c:v copy -shortest \
       trinity360.encodedforjump.360.mono.mp4
```

## Setting the Metadata

We've downloaded Google's 360 Video Metadata app [360 Video Metadata app](https://github.com/google/spatial-media/releases) and selected  *spherical* and  *Spatial Audio*:

![My helpful screenshot](/images/spatial-media-metadata-injector.png)

## Upload to YouTube

Then the video was uploaded to YouTube. Nothing special needs to be done here, you just have to wait for a couple of hours for the spatial audio to be fully processed, so be patient.

----

For completeness, this is the ffmpeg version we're using:

```
ffmpeg version 2.8.6 Copyright (c) 2000-2016 the FFmpeg developers
  built with Apple LLVM version 7.0.2 (clang-700.1.81)
    configuration: --prefix=/opt/local --enable-swscale --enable-avfilter --enable-avresample --enable-libmp3lame --enable-libvorbis --enable-libopus --enable-libtheora --enable-libschroedinger --enable-libopenjpeg --enable-libmodplug --enable-libvpx --enable-libsoxr --enable-libspeex --enable-libass --enable-libbluray --enable-lzma --enable-gnutls --enable-fontconfig --enable-libfreetype --enable-libfribidi --disable-indev=jack --disable-outdev=xv --mandir=/opt/local/share/man --enable-shared --enable-pthreads --cc=/usr/bin/clang --enable-vda --enable-videotoolbox --arch=x86_64 --enable-yasm --enable-gpl --enable-postproc --enable-libx264 --enable-libxvid
```





