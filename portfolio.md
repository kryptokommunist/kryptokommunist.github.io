---
layout: default
title: Portfolio
header: false
permalink: /portfolio/
include: true
---
<div class="portfolio">

<div id="profile-container" style="width: 57%; margin: 0 auto; text-align: center;">
<section class="projectCard">
                <a href="{{ post.url }}">
                    <img src="/images/profile.jpg" alt="">
                </a>
                <div>
                    <p> Hi 👋,<br><br>
        I'm Marcus. I like to build technology that supports people in becoming more alive.  
        I am interested in technology, Buddhism, mindfulness, aliveness, embodiment, and qualia.  
        My CV is <a class="titleLink" href="/images/Marcus_Ding_Website.pdf">here</a>.  
        Say hi if we're into some of the same things!</p>
                </div>
            </section>
</div>


    <div class="tabs">
        <button class="tab-link active" onclick="openTab(event, 'projects')"><a>Projects</a></button>
        <button class="tab-link" onclick="openTab(event, 'work')"><a>Work Experience</a></button>
        <button class="tab-link" onclick="openTab(event, 'education')"><a>Education</a></button>
    </div>

    <div id="projects" class="tab-content active">
        <p class="synopsis">From an early age on I was fascinated with computers. During a summer holiday as a teenager I built breakout in Java and fell in love with programming. Later digital light installations catched my attention. From implementing lighting at forrest raves around Berlin in the early days I moved later to installations for festivals and exhibitions. I love making software that is challenging and especially if it incorporates hardware as well as machine learning aspects.</p>

        <div id="event2Container">
            {% for post in site.categories['portfolio/projects'] %}
            {% assign post_preview = post.excerpt %}
            {% if post.content contains '<!--more-->' %}
                {% assign post_preview = post.content | split: '<!--more-->' | first %}
            {% endif %}
            <section class="projectCard">
                <a class="titleLink desktopHide" href="{{ post.url }}">
                    <h2>{{ post.title }}</h2>
                </a>
                <a href="{{ post.url }}">
                    <img src="{{ post.image }}" alt="" border="1">
                </a>
                <div>
                    <a class="titleLink mobileHide" href="{{ post.url }}">
                        <h2>{{ post.title }}</h2>
                    </a>
                    <h3>{{ post.subtitle }}</h3>
                    <p>{{ post.year }}</p>
                    <p>{{ post_preview }}</p>
                </div>
            </section>
            {% endfor %}
        </div>
    </div>

    <div id="work" class="tab-content">
        <p class="synopsis">My professional path reflects my passion for both software and hardware development. From managing IT infrastructure during a startup's growth phase to developing spacecraft systems, I've consistently sought out opportunities that combine technical innovation with practical impact. Through freelance work and various projects, I've maintained a strong focus on creative problem-solving while building systems that make a difference.</p>

        <div id="event2Container">
            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>Software Engineer</h2>
                        <a class="titleLink" href="https://www.pts.space">
                            <h3>Planetary Transportation Systems</h3>
                        </a>
                        <p class="date">May 2023 - December 2023</p>
                        <p class="description">Developed full-stack web applications with Flask, MySQL, React stack for customer Zeitfracht. Developed satellite onboard computer software for a CubeSat (STM32, FreeRTOS, C++). <a href="https://github.com/Curium-Five">code</a></p>
                    </div>
                </div>
            </section>

            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>IT Infrastructure & DevOps Engineer (Part-time)</h2>
                        <a class="titleLink" href="https://www.micropsi-industries.com">
                            <h3>micropsi industries</h3>
                        </a>
                        <p class="date">2018 – 2023</p>
                        <p class="description">Led IT infrastructure scaling from 10 to 50 employees, while valuation grew from $2M to $25M. Optimized DevOps workflows, implementing CI/CD pipelines, cutting deployment time by 60%. Managed network configurations and internal services, ensuring 99.99% uptime.</p>
                    </div>
                </div>
            </section>

            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>Researcher</h2>
                        <a class="titleLink" href="https://hpi.de/baudisch">
                            <h3>HCI lab, Prof. Baudisch, Hasso-Plattner-Institute</h3>
                        </a>
                        <p class="date">March 2021 – October 2021</p>
                        <p class="description">Developed algorithms for unfolding 3D models into 2D, implemented in TypeScript. Published at <a href="https://uist.acm.org/uist2022/">UIST22</a>.</p>
                    </div>
                </div>
            </section>

            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>Global Team-Based Innovation</h2>
                        <a class="titleLink" href="https://hpi.de">
                            <h3>HPI, University of St. Gallen, LBBW</h3>
                        </a>
                        <p class="date">October 2021 – June 2022</p>
                        <p class="description">Collaborated in a cross-disciplinary team of 3 HPI IT-Systems-Engineering and 3 St. Gallen business students on risk analysis solutions for SMEs. Conducted extensive interviews with enterprises, developed design prototypes, and created a final web application for risk analysis through weekly iterations with LBBW stakeholders.</p>
                    </div>
                </div>
            </section>

            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>Google Summer of Code</h2>
                        <a class="titleLink" href="https://www.freecadweb.org">
                            <h3>FreeCAD</h3>
                        </a>
                        <p class="date">May 2020 – August 2020</p>
                        <p class="description">Implemented Jupyter Notebook integration for FreeCAD, enhancing scriptability for open-source CAD software.</p>
                    </div>
                </div>
            </section>

            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>ML & Software Engineer</h2>
                        <a class="titleLink" href="https://github.com/kryptokommunist">
                            <h3>Freelance, Berlin, Germany</h3>
                        </a>
                        <p class="date">2018 – 2020</p>
                        <p class="description">Implemented a deep learning model for human path prediction in interactive theater (PyTorch, PyQT5). Designed a multi-modal AI system on Jetson Nano for Ars Electronica, translating images into sound and vice versa, improved inference time 10x.</p>
                    </div>
                </div>
            </section>

            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>XStage</h2>
                        <a class="titleLink" href="https://xstageproject.com">
                            <h3>Experimental Stage Project</h3>
                        </a>
                        <p class="date">2018 – Present</p>
                        <p class="description">Built interactive installations using microcontrollers, and 3D printing for festivals and conferences with 3000 - 100.000 visitors each.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </div>

    <div id="education" class="tab-content">
        <p class="synopsis">My academic journey combines deep technical expertise with interdisciplinary learning. Starting at Humboldt University with a foundation in computer science and physics, I transitioned to the Hasso-Plattner-Institute to focus on practical IT systems engineering. This combination of theoretical understanding and hands-on implementation has shaped my approach to solving complex technical challenges and developing innovative solutions.</p>

        <div id="event2Container">
            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>Master IT-Systems-Engineering</h2>
                        <a class="titleLink" href="https://hpi.de">
                            <h3>Hasso-Plattner-Institute</h3>
                        </a>
                        <p class="date">2020 – 2022, 2025 - present</p>
                        <p class="description">Advanced studies in IT systems engineering with focus on practical project work and innovative technologies. Notable projects include Hingecore algorithm development and Global Team-Based Innovation course with Uni St. Gallen and LBBW. Emphasis on Human Computer Interaction. Resumed MSc after sabbatical exploring AI, art and mindfulness. Now writing my masters thesis.</p>
                    </div>
                </div>
            </section>

            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>Bachelor IT-Systems-Engineering</h2>
                        <a class="titleLink" href="https://hpi.de">
                            <h3>Hasso-Plattner-Institute</h3>
                        </a>
                        <p class="date">2015 – 2018</p>
                        <p class="description">Completed bachelor's degree with a grade of 1.6 while serving as spokesperson for the Makerklub. Developed strong foundation in IT systems engineering through practical coursework and hands-on projects.</p>
                    </div>
                </div>
            </section>

            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>Mindful Leadership Training</h2>
                        <a class="titleLink" href="https://www.spiritrock.org">
                            <h3>Spirit Rock Meditation Center</h3>
                        </a>
                        <p class="date">2022</p>
                        <p class="description">Completed 9-month training program focused on mindful, compassionate leadership with Nikki Mirghafori, PhD and Marc Lesser, MBA. Developed skills in emotional intelligence, team empowerment, and fostering inclusive environments.</p>
                    </div>
                </div>
            </section>

            <section class="projectCard">
                <div class="titleContainer">
                    <div>
                        <h2>Design Thinking Basic Track</h2>
                        <a class="titleLink" href="https://hpi.de/school-of-design-thinking">
                            <h3>School of Design Thinking</h3>
                        </a>
                        <p class="date">2018</p>
                        <p class="description">Designed and prototyped solutions for real-world challenges from industry partners with a human-centered design.</p>
                    </div>
                </div>
            </section>

        </div>
    </div>


</div>

<script>
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    var selectedTab = document.getElementById(tabName);
    selectedTab.classList.add("active");
    selectedTab.style.display = "block";
    evt.currentTarget.classList.add("active");
}
</script>

<style>
.tabs {
    display: flex;
    justify-content: flex-start;
    border-bottom: 2px solid #ddd;
    margin-bottom: 20px;
}

.tab-link {
    background: none;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
}

.tab-link.active {
    border-bottom: 2px solid #000;
    font-weight: bold;
}

.tab-content {
    display: none;
    animation: fadeSlideEffect 0.5s;
}

.tab-content.active {
    display: block;
    animation: fadeSlideEffect 0.5s;
}

@keyframes fadeSlideEffect {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
