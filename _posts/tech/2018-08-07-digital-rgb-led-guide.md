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

These LEDs are designed by [APA Electronic co. LTD](http://neon-world.com/en/). They don't show any visible PWM flicker when moving the LED due to a very high modulation frequency (19.2 kHz). The full brighness setting (31) should be used to reduce flicker. It was tested running with 60MHz SPI.

[source 1](https://cpldcpu.wordpress.com/2014/08/27/apa102/)
[source 2](https://www.pjrc.com/why-apa102-leds-have-trouble-at-24-mhz/)

## SK9822

These are a clone of the APA102. Unfortunately it has a slightly different behaviour regarding it's protocol since every frame will be displayed on receiving the next start frame. That results in updating all LEDs at once unlike with the APA102 or WS28XX.

[source](https://cpldcpu.wordpress.com/2016/12/13/sk9822-a-clone-of-the-apa102/)

## Conclusion

TO DO: write a conclusion and order LED stripe

|                           |            SK9822           |         SK6812        |         APA102        |          WS2813        |        WS2812B        |         WS2812        |         WS2811        |         WS2801        |
|---------------------------|:---------------------------:|:---------------------:|:---------------------:|:---------------------:|:---------------------:|:---------------------:|:---------------------:|:---------------------:|
|           Update          |         Simultaneous        |       Staggered       |       Staggered       |       Staggered       |       Staggered       |       Staggered       |       Staggered       |       Staggered       |
|       Update trigger      |   Reset frame (0x00000000)  | RGB data transmission | RGB data transmission | RGB data transmission | RGB data transmission | RGB data transmission | RGB data transmission | RGB data transmission |
|       PWM Frequency       |           ~4.7 kHz          |        ~1.1kHz        |       ~19.2 kHz       |        2kHz          |    430 Hz        |         430 Hz        |         430 Hz        |        2.5 kHz        |
| Global brightness control | programmable current source |     PWM at ~440 Hz    |           -           |           -           |           -           |           -           |           -           |          -           |
| max data rate |  30MHZ |  800 kB/s  |  20MBit/s (max input clock)  |  800 kB/s  |  800 kB/s   |   800 kB/s  | 800 kB/s  |    25MBit/s (max input clock)  |
|       Best Price $/m (IP30)      |          [21.42](https://de.aliexpress.com/item/5mX-New-arrival-SK9822-5050SMD-RGB-digital-flexible-led-strip-light-DC5V-input-30-32-48/32713951190.html)                   |        [16.70](https://www.aliexpress.com/store/product/SK6812-RGBW-similar-ws2812b-4-in-1-1m-4m-5m-30-60-144-leds-pixels-m/836457_32821691618.html)               |        [20.71](https://www.aliexpress.com/store/product/APA102-strip-1m-3m-5m-30-60-72-96-144-leds-pixels-m-APA102-Smart-led/330721_32878004298.html)               |         [18.72](https://de.aliexpress.com/item/Neue-1-mt-5-mt-WS2813-Smart-led-pixel-streifen-Schwarz-Wei-PCB-30-60-leds/32864264738.html)                   | [13.57](https://www.aliexpress.com/item/individually-addressable-full-color-1-3-4-5m-waterproof-ip65-ip67-5050-rgb-30-60-144/32820264632.html)              |            [11.72](https://www.aliexpress.com/store/product/1m-4m-5m-WS2812B-Smart-led-pixel-strip-Black-White-PCB-30-60-144-leds-m/2880007_32793949673.html)          |    144 LED/m not possible              |          144 LED/m not possible             |

## Voltage drop

In order to overcome voltage drop with long LEDs strips a higher voltage is better. Otherwise power injection every couple meters will be required.

## Conclusion

Finally I decided to purchase the WS2812, because when ordering a lot of LEDs the price difference is very noticeable. (1680€ vs. 1050€) The data speed of 800 kBit/s is enough to run 4 meters of stripe with 60 frames per second. To me the missing features of reverse polarity protection and tolerating failing pixels isn't worth almost twice the price if you compare WS2812 to WS2813. Also the lower PWM frequency is acceptable since the object and the viewer won't move around very fast. Also the external resistor next to every LED is a downside compared to WS2813. 🦄🔥
