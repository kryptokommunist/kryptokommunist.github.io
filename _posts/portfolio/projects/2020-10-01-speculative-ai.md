---
layout: default
title: "SpeculativeAI Series"
subtitle: "Audiovisual Neural Network Experiments"
year: "2020"
image: /images/portfolio/projects/ec9151d8d16de474cf9966390812ca43_size_1200x1200.jpeg
categories: portfolio/projects
excerpt: "Designed a multi-modal AI system on Jetson Nano for Ars Electronica, translating images into sound and vice versa."
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
<img src="/images/portfolio/projects/ec9151d8d16de474cf9966390812ca43_size_1200x1200.jpeg" alt="SpeculativeAI main image">
</section>
<section>
<h3>Overview</h3>
The SpeculativeAI series consists of aesthetic experiments aimed at making the processes of artificial neural networks perceptible to visitors through audiovisual translation.

The latest work questions an AI’s capacity for empathy and purpose while communicating with another AI. Conceptually supported by the Center for Artificial Intelligence (University of Oviedo), two independent AI systems were set up to communicate using an invented language of audiovisual associations.
<!--more-->
<p>
<ul>
<li>The light object is a spherical structure with an 80cm diameter, composed of a chaotic heap of 120m LED stripe, a microphone, and an embedded AI computing device (Jetson Nano). It hears sounds and creates images.</li>
<li>The sound object, a dodecahedron made of black opaque Plexiglas with the same diameter, features eight speakers, a camera, and another AI system. It sees images and plays sounds using a Jetson Nano as well.</li>
</ul>
</p>
These objects engage in meaningful conversations by understanding received messages and providing intentional responses.
<p>
</p>
<p>
<a href="https://github.com/birkschmithuesen/SpeculativeAI_Interspace" target="_blank">Sound-to-Visual Translation (GitHub)</a> | 
<a href="https://github.com/birkschmithuesen/SpeculativeAI_Dodeca" target="_blank">Visual-to-Sound Translation (GitHub)</a> | 
<a href="https://www.birkschmithuesen.com/_speculativeAI" target="_blank">Benjamin Schmithüsen Project Page</a>
</p>
</section>
<section>
<h3>Technical Details</h3>
<ul>
<li>I developed the entire ML system for two Jetson Nano devices, including fallback an reliability mechanisms:</li>
  <ul>
    <li><b>Sound-to-Visual:</b> Translates microphone input via Fast Fourier Transform and a neural net to control 14,000 LEDs on 120 meters of LED stripe, 3D-mapped in space.</li>
    <li><b>Visual-to-Sound:</b> Processes camera video streams into a 512-dimensional vector, reduced to 5 dimensions via PCA, then fed into the SuperCollider synthesizer via OSC.</li>
  </ul>
<li>Trained a dictionary between both models to enable conversations between the systems.</li>
</ul>
</section>
<section>
<h3>Gallery</h3>
<img src="/images/portfolio/projects/c1ad3a7f6c5fb71015b87c184832cc2c_size_1000x1000.jpeg" alt="SpeculativeAI image 1">
<img src="/images/portfolio/projects/dd5f915ad1b2d130c3925ff88ed0df16_size_1000x1000.jpeg" alt="SpeculativeAI image 2">
</section>
<section>
<h3>Video Documentation</h3>
<iframe title="vimeo-player" src="https://player.vimeo.com/video/366300020?h=d61127ab15" width="640" height="360" frameborder="0"    allowfullscreen></iframe>
</section>
</div>