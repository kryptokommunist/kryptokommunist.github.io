---
layout: default
title: "Doyle Spiral Studio"
subtitle: "Generative Doyle spiral animations etched into steel and wood"
year: "2025"
image: /images/portfolio/projects/doyle_spiral_2.png
categories: portfolio/projects
excerpt: "Animating Doyle spiral circle packings and translating them into etched steel and wood artworks."
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
<img src="/images/portfolio/projects/doyle_spiral_2.png" alt="Doyle Packing heading image">
</section>
<section>
<h3>Overview</h3>
<p>
Doyle Studio is a generative art tool I created to compute <a href="https://en.wikipedia.org/wiki/Doyle_spiral" target="_blank">Doyle spirals</a> and more patterns that can be exported as SVGs for fabrication with a fiber laser. The software can be used to animate geometric textures on a rotating disk, then translate the animations into physical pieces through engraving angled line patterns with a fibo laser. The current pipeline renders animated patterns and generates high-resolution SVGs for
laser engraving. The surfaces reflection sequences can be changed based on the angle of the engrave line pattern similar to a <a href="https://en.wikipedia.org/wiki/Zoetrope" target="_blank">zoetrope</a>.
</p>
<!--more-->
<p>
<a href="https://github.com/kryptokommunist/doyle_packing" target="_blank">GitHub Repository</a>
</p>
</section>
<section>
<h3>Experiments</h3>
<ul>
<li>Tested both steel etching and wood lasering; both work, but steel is more promising for crisp contrast and durability.</li>
<li>Ongoing tuning of fabrication settings to make the animated motion very clearly visible in the etched results.</li>
<li>Planned animation UI driven by cellular automata rules to vary the Doyle spiral parameters over time.</li>
<li>Future experiments with pixel-grid renderings to compare against the smooth circle packings for alternative animation aesthetics.</li>
</ul>
</section>
<section>
<h3>Gallery</h3>
<img src="/images/portfolio/projects/doyle_software_2.png" alt="Doyle Packing software view 1">
<img src="/images/portfolio/projects/doyle_software.png" alt="Doyle Packing software view 2">
<img src="/images/portfolio/projects/doyle_spiral_2.png" alt="Rendered Doyle spiral 1">
<img src="/images/portfolio/projects/doyle_spiral.png" alt="Rendered Doyle spiral 2">
<img src="/images/portfolio/projects/doyle_spiral_3.png" alt="Rendered Doyle spiral 3">
</section>
<section>
<h3>Videos</h3>
<iframe title="Doyle Packing software demo" src="https://www.youtube.com/embed/qkzsHEQotLk?si=xtfMyvqlOFirsrTB" width="640" height="360" frameborder="0" allowfullscreen></iframe>
<p></p>
<iframe title="Steel etching result" src="https://www.youtube.com/embed/mn3keMGJIm8?si=w1zPKr-BppDldjaU" width="640" height="360" frameborder="0" allowfullscreen></iframe>
<p></p>
<iframe title="Wood laser result" src="https://www.youtube.com/embed/EdZXvTYIgcg?si=x5p5dOq0x1jZuLTG" width="640" height="360" frameborder="0" allowfullscreen></iframe>
</section>
<section>
<h3>Acknowledgments</h3>
Thanks to <a href="https://arr.am">Arram Sabeti</a> for coming up with the idea originally, I encountered his art on <a href="https://x.com/arram/status/1438541186319282178">twitter</a>.
</section>
</div>
