---
layout: default
title: "HingeCoreMaker"
subtitle: "Laser-Cut Foamcore for Fast Assembly"
year: "2022"
image: /images/portfolio/projects/csm_Figure_1_0f047a8bef.png
categories: portfolio/projects
excerpt: "HingeCoreMaker automates the design and unfolding of 3D models for laser-cutting layouts."
category:
- tech
tags:
- tech
- engineering
- software
---
<div class="portfolio">
<h1>{{ page.title }}</h1>
<h2>{{ page.subtitle }}</h2>
<section>
<img src="/images/portfolio/projects/csm_Figure_1_0f047a8bef.png" alt="HingeCore main image">
</section>
<section>
<h3>Overview</h3>
HingeCore introduces a novel laser-cutting approach utilizing foamcore to create 3D structures with finger hinges for fast and glue-free assembly. This method supports the creation of robust, aesthetic, and functional models, ranging from furniture to art objects.

HingeCoreMaker is the accompanying software tool, seamlessly integrating with 3D modeling platforms to automate the conversion of 3D designs into 2D laser-cutting layouts, optimizing for precision and efficiency.

<p>
<ul>
<li>Finger hinges allow quick folding and assembly without the need for adhesives or tabs, reducing assembly time by 2.9x compared to traditional methods.</li>
<li>HingeCore models are highly durable, withstanding significant loads (e.g., 62kg with 5mm foamcore).</li>
<li>The generated layouts leverage three cut types (full, half-way, and crease) for optimized assembly.</li>
</ul>
</p>
<p>
<a href="https://hpi.de/baudisch/projects/hingecore.html" target="_blank">HCI chair Project Page</a> | 
<a href="https://doi.org/10.1145/3526113.3545618" target="_blank">Publication (ACM Digital Library)</a> | 
<a href="https://youtu.be/N710JaRqcq8" target="_blank">Demo Video (YouTube)</a>
</p>
</section>
<section>
<h3>Technical Details</h3>
I contributed the following:
<ul>
<li>Developed a custom unfolding algorithm in TypeScript to automatically convert 3D models into 2D layouts for laser cutting, ensuring no collision of parts during folding or assembly.</li>
<li>Enhanced software performance by identifying and resolving critical bugs and implementing structural improvements.</li>
<li>Contributed to the integration of HingeCoreMaker into Kyub, streamlining user workflows while preserving compatibility with standard 3D modeling tools.</li>
<li>Collaborated on the development of layout generation using precision calibration for distinct cut types (full, half-way, crease).</li>
</ul>
</section>
<section>
<h3>Gallery</h3>
<img src="/images/portfolio/projects/csm_figure_8_87b9e1e26d.png" alt="HingeCore assembly process">
<img src="/images/portfolio/projects/Screenshot 2025-01-17 at 16.25.25.png" alt="HingeCore interface example">
</section>
<section>
<h3>Videos</h3>
<iframe title="youtube-player" src="https://www.youtube.com/embed/N710JaRqcq8" width="640" height="360" frameborder="0" allowfullscreen></iframe>
</section>
</div>
