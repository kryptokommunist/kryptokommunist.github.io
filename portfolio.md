---
layout: default
title: Portfolio
header: false
permalink: /portfolio/
include: true
---
<div class="portfolio">

<p class="synopsis">Hi 👋,

I am a curious being that is very much interest in bhuddism, mindfulness, aliveness, embodiment, technology and qualia. I am good with computers. My CV is <a class="titleLink" href="/images/Marcus_Ding_Website.pdf">here</a>. May you be well, friend.</p>

    <div class="tabs">
        <button class="tab-link active" onclick="openTab(event, 'art')">Art</button>
        <button class="tab-link" onclick="openTab(event, 'work')">Work Experience</button>
        <button class="tab-link" onclick="openTab(event, 'education')">Education</button>
    </div>

    <div id="art" class="tab-content active">
        <h1>Installations</h1>
        <p class="synopsis">From an early age on I was fascinated with computers and digital light installations as an medium of expression. From implementing lighting at forrest raves around Berlin in the early days I moved later to installations for festivals and exhibitions. The mesmerizing patterns and the ability to make a place feel magical are what draws me to make these kinds of installation.</p>

        <div id="event2Container">
            {% for post in site.categories['portfolio/art'] | sort: 'date' %}
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
                </div>
            </section>
            {% endfor %}
        </div>
    </div>

    <div id="work" class="tab-content">
        <h1>Work Experience</h1>
        <p class="synopsis">My professional path reflects my passion for both software and hardware development. From managing IT infrastructure during a startup's growth phase to developing spacecraft systems, I've consistently sought out opportunities that combine technical innovation with practical impact. Through freelance work and various projects, I've maintained a strong focus on creative problem-solving while building systems that make a difference.</p>
        <div id="event2Container">
            <section class="projectCard">
            <div class="titleContainer">
                <div>
                <a class="titleLink" href="https://www.pts.space">
                    <h2>Embedded Software Developer and Fullstack Web Developer</h2>
                </a>
                <a class="titleLink" href="https://www.pts.space">
                    <h3>Planetary Transportation Systems</h3>
                </a>
                <p class="date">June 2023 – January 2024</p>
                <p class="description">Developing web applications and hardware solutions for STM32-based cube sat onboard computer. Contributing to both spacecraft systems and ground control software development.</p>
                </div>
            </div>
            </section>

            <section class="projectCard">
            <div class="titleContainer">
                <div>
                <a class="titleLink" href="https://www.micropsi-industries.com">
                    <h2>IT Infrastructure Working Student</h2>
                </a>
                <a class="titleLink" href="https://www.micropsi-industries.com">
                    <h3>micropsi industries</h3>
                </a>
                <p class="date">2018 – 2023</p>
                <p class="description">Led IT infrastructure development during significant company growth from 10 to 50 employees. Managed comprehensive DevOps systems, network configuration, and internal services including Jenkins CI, Office365, and security systems.</p>
                </div>
            </div>
            </section>

            <section class="projectCard">
            <div class="titleContainer">
                <div>
                <a class="titleLink" href="https://hpi.de">
                    <h2>Hingecore Master Project</h2>
                </a>
                <a class="titleLink" href="https://hpi.de">
                    <h3>Prof. Baudisch, Hasso-Plattner-Institute</h3>
                </a>
                <p class="date">March 2021 – October 2021</p>
                <p class="description">Developed algorithm for unfolding 3D models into 2D plane, implemented in TypeScript. Led to publication at UIST22 and integration into existing kyub codebase.</p>
                </div>
            </div>
            </section>

            <section class="projectCard">
            <div class="titleContainer">
                <div>
                <a class="titleLink" href="https://hpi.de">
                    <h2>Global Team-Based Innovation</h2>
                </a>
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
                <a class="titleLink" href="https://summerofcode.withgoogle.com">
                    <h2>Google Summer of Code Participant</h2>
                </a>
                <a class="titleLink" href="https://www.freecadweb.org">
                    <h3>FreeCAD</h3>
                </a>
                <p class="date">May 2020 – August 2020</p>
                <p class="description">Implemented Jupyter Notebook integration in Python for FreeCAD open-source CAD program. Collaborated with experienced mentors to enhance software capabilities and improve user experience.</p>
                </div>
            </div>
            </section>

            <section class="projectCard">
            <div class="titleContainer">
                <div>
                <a class="titleLink" href="https://github.com/kryptokommunist">
                    <h2>Freelance Programmer</h2>
                </a>
                <a class="titleLink" href="https://github.com/kryptokommunist">
                    <h3>Berlin, Germany</h3>
                </a>
                <p class="date">2019 – present</p>
                <p class="description">Designing and implementing custom software solutions in Python and Java, including an installation featured at Ars Electronica 2019. Specializing in both new development and enhancement of existing systems.</p>
                </div>
            </div>
            </section>

        </div>
    </div>

    <div id="education" class="tab-content">
        <h1>Education</h1>
        <p class="synopsis">My academic journey combines deep technical expertise with interdisciplinary learning. Starting at Humboldt University with a foundation in computer science and physics, I transitioned to the Hasso-Plattner-Institute to focus on practical IT systems engineering. This combination of theoretical understanding and hands-on implementation has shaped my approach to solving complex technical challenges and developing innovative solutions.</p>
        <div id="event2Container">
            <section class="projectCard">
            <div class="titleContainer">
                <div>
                <a class="titleLink" href="https://hpi.de">
                    <h2>Master IT-Systems-Engineering</h2>
                </a>
                <a class="titleLink" href="https://hpi.de">
                    <h3>Hasso-Plattner-Institute</h3>
                </a>
                <p class="date">2018 – present</p>
                <p class="description">Advanced studies in IT systems engineering with focus on practical project work and innovative technologies. Notable projects include Hingecore algorithm development and Global Team-Based Innovation course with Uni St. Gallen and LBBW.</p>
                </div>
            </div>
            </section>

            <section class="projectCard">
            <div class="titleContainer">
                <div>
                <a class="titleLink" href="https://hpi.de">
                    <h2>Bachelor IT-Systems-Engineering</h2>
                </a>
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
                <a class="titleLink" href="https://www.spiritrock.org">
                    <h2>Mindful Leadership Training</h2>
                </a>
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
                <a class="titleLink" href="https://hpi.de/school-of-design-thinking">
                    <h2>Design Thinking Basic Track</h2>
                </a>
                <a class="titleLink" href="https://hpi.de/school-of-design-thinking">
                    <h3>School of Design Thinking</h3>
                </a>
                <p class="date">2018</p>
                <p class="description">Completed one-semester course in user-centered innovation principles. Applied Design Thinking methodology in interdisciplinary team projects with external partners.</p>
                </div>
            </div>
            </section>

            <section class="projectCard">
            <div class="titleContainer">
                <div>
                <a class="titleLink" href="https://www.hu-berlin.de">
                    <h2>Bachelor in Computer Science/Physics</h2>
                </a>
                <a class="titleLink" href="https://www.hu-berlin.de">
                    <h3>Humboldt-Universität zu Berlin</h3>
                </a>
                <p class="date">2013 – 2015</p>
                <p class="description">Initial studies combining computer science as core subject with physics as minor. Built foundational knowledge in both theoretical computer science and physical sciences.</p>
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
