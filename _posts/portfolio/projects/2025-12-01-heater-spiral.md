---
layout: default
title: "Heater Spiral"
subtitle: "Heat-based body-computer interface pendant"
year: "2025"
image: /images/portfolio/projects/rendered_heater_spiral.png
categories: portfolio/projects
excerpt: "Self-designed PCB pendant that uses a MOSFET-driven heater spiral for embodied awareness practices."
category:
- tech
tags:
- tech
- art
---
<div class="portfolio">
<h1>{{ page.title }}</h1>
<h2>{{ page.subtitle }}</h2>
<section>
<img src="/images/portfolio/projects/rendered_heater_spiral.png" alt="Front of Heater Spiral PCB">
</section>
<section>
<h3>Overview</h3>
Heater Spiral is a wearable body-computer interface that delivers gentle, programmable warmth through a spiral heater trace. I designed and assembled the circular PCB from scratch, integrating a MOSFET-controlled heater that can raise the surface temperature to around 50&nbsp;°C. One application I explored was wearing it as a necklace over the heart with rhythmic warm-up and cooldown phases to anchor attention in the body—similar to metta meditation sessions I tested during retreat. I also prototyped an app that modulates heat based on how near another wearer is, and I plan to redesign the next iteration with a UWB chip for more accurate distance sensing.
<!--more-->
<p></p>
<p>
<a href="https://github.com/kryptokommunist/heater_spiral" target="_blank">GitHub Repository</a> |
<a href="https://x.com/kryptokommunist/status/1901057389018681477" target="_blank">Project Tweet Thread</a>
</p>
</section>
<section>
<h3>Technical Details</h3>
<ul>
<li>Custom two-layer PCB with ornamental copper spiral heater and matching silkscreen art.</li>
<li>MOSFET-based power stage to drive the heater element up to ~50&nbsp;°C.</li>
<li>USB-C for power and programming, with onboard microcontroller and status LEDs.</li>
<li>Test program cycles heating and cooling periods for somatic awareness practice, plus a proximity-based heating demo for paired wearers.</li>
<li>Designed pendant enclosure concepts to house the board as wearable jewelry.</li>
</ul>
</section>
<section>
<h3>Explorations & Next Steps</h3>
<ul>
<li>Next hardware spin will include UWB to refine distance-based warming interactions. Also include fuses as failsafe in case of software failures.</li>
<li>Long-term vision: scale the concept into a pixel-style thermal display that can cover the whole body.</li>
<li>Inspired by meditation practice, sauna rituals, and hot stone massage as embodied, heat-driven experiences.</li>
</ul>
</section>
<section>
<h3>Gallery</h3>
<img src="/images/portfolio/projects/rendered_heater_spiral.png" alt="Front of Heater Spiral PCB">
<img src="/images/portfolio/projects/rendered_heater_spiral_2.png" alt="Back of Heater Spiral showing heater spiral art">
<img src="/images/portfolio/projects/solderered_heater_spiral.png" alt="Heater Spiral PCB illuminated during test">
<img src="/images/portfolio/projects/necklace_heater_spiral.jpeg" alt="Pendant render showing Heater Spiral board front">
<img src="/images/portfolio/projects/necklace_heater_spiral_2.jpeg" alt="Pendant render angled view">
<img src="/images/portfolio/projects/heater_spiral_bake.png" alt="Heater Spiral board baking in an oven">
<div class="video">
<iframe width="560" height="315" src="https://www.youtube.com/embed/JpYmuttcDTM" title="Heater Spiral build video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>
</section>
</div>
