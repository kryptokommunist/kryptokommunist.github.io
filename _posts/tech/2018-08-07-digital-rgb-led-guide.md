---
layout: post
title: Digital RGB LED guide
category: tech
tags:
- led
- lighting
---

I need LEDs, a lot of LEDs. About 13.000 for a lighting project. That should be about 1400$ worth of LED. Therefore here is the result of the research I did to prevent wasting a huge load of cash I do not have anyways.
<!--more-->
## WS2801

![](/images/ws2801.png){:style="width: 220px"}

This is the first generation of control ICs by [World Semiconductor](http://www.world-semi.com) which requires a separate clock input additional to data (SPI).

## WS2811

![](/images/ws2811.png){:style="width: 220px"}

This is the generation after the WS2801. This IC only requires data input and works with a fixed clock speed of either 400kHz or 800kHz, which might require you to save all stripe color values in a buffer in order to match the required speed.

## WS2812

![](/images/ws2812.png){:style="width: 220px"}

This is the name for an SMD LED package with an integrated WS2811 IC.

## WS2812B

![](/images/ws2812b.png){:style="width: 220px"}

This is the improved version of the WS2812. It has a brighter LED with a more uniform color distribution. Also it features an reverse protection circuit, which will prevent breaking the stripe when attaching the power source in the wrong order.

## WS2813

![](/images/ws2813.png){:style="width: 220px"}

This is the latest version. It works just like WS2812B, but also tolerates failing pixels: [see video](https://www.youtube.com/watch?v=a6s2MlZHnC8).

[source](https://playground.boxtec.ch/doku.php/led/ledpixel_guide)

## SK6812

The SK6812 is a clone of the WS2812, that is completely compatible. It's PWM frequency is twice that of the WS2812B which should result in less flickering.

[source](https://cpldcpu.wordpress.com/2016/03/09/the-sk6812-another-intelligent-rgb-led/)

## APA102

These LEDs are designed by [APA Electronic co. LTD](http://neon-world.com/en/). They don't show any visible PWM flicker when moving the LED due to a very hight modulation frequency (19.2 kHz). The full brighness setting (31) should be used to reduce flicker. It was tested running with 60MHz SPI.

[source](https://cpldcpu.wordpress.com/2014/08/27/apa102/)

## SK9822

These are a clone of the APA102. Unfortunately it has a slightly different behaviour regarding it's protocol since every frame will be displayed on receiving the next start frame. That results in updating all LEDs at once unlike with the APA102 or WS28XX.

[source](https://cpldcpu.wordpress.com/2016/12/13/sk9822-a-clone-of-the-apa102/)

## Conclusion

TO DO: write a conclusion and order LED stripe

|                           |            SK9822           |         SK6812        |         APA102        |        WS2812B        |         WS2812        |         WS2811        |         WS2801        |
|---------------------------|:---------------------------:|:---------------------:|:---------------------:|:---------------------:|:---------------------:|:---------------------:|:---------------------:|
|           Update          |         Simultaneous        |       Staggered       |       Staggered       |       Staggered       |       Staggered       |       Staggered       |       Staggered       |
|       Update trigger      |   Reset frame (0x00000000)  | RGB data transmission | RGB data transmission | RGB data transmission | RGB data transmission | RGB data transmission | RGB data transmission |
|       PWM Frequency       |           ~4.7 kHz          |        ~1.1kHz        |       ~19.2 kHz       |         430 Hz        |         430 Hz        |         430 Hz        |        2.5 kHz        |
| Global brightness control | programmable current source |     PWM at ~440 Hz    |           -           |           -           |           -           |           -           |           -           |
|       Best Price $/m      |                             |                       |                       |                       |                       |                       |                       |

## Voltage drop

In order to overcome voltage drop with long LEDs strips a higher voltage is better. Otherwise power injection every couple meters will be required.
