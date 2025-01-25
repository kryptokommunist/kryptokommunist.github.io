---
layout: post
title: Google Summer of Code 2020 – Creating a FreeCAD 3D view inside Jupyter Notebooks
category:
- tech
- english
tags:
- tech
- gsoc
- freecad
---

Accidentally while [creating a lamp](https://forum.freecadweb.org/viewtopic.php?f=24&t=48957) I ended up learning [FreeCAD](https://www.freecadweb.org). FreeCAD is an amazing open source CAD program. It still amazes me that people created this for free and everyone to use. The software is still in it's alpha version and is far from perfect as you can tell by the current release version number 0.19 and the [heated discussions](https://forum.freecadweb.org/viewtopic.php?t=43461) around how soon a 1.0 release could be reached. Still it's usable and once you get the gist of it you can create powerful and complex designs. FreeCADs approach to CAD is a parametric design. That means that you specify shapes with parameters. This way you can change your design at any time just by tuning these parameters. For example with my lamp design the number of aluminium bars is a parameter I can simply tweak at any point in time. This gives great flexibility and allows for fast customization.

I was seeing the potential of designing a parametric lamp and creating a web page where you could change the parameters to your liking and see a live 3D rendering of the changed lamp. But after some research I saw that this does not exist for FreeCAD yet. Some coincidences later I thought I could apply for a [Google Summer of Code](https://summerofcode.withgoogle.com) project to get closer to realizing this idea.

<!--more-->

So I sent out two applications: [A better IPython and Jupyter Notebook Integration for FreeCAD](https://docs.google.com/document/d/1VgfsD06Qvb87S-tQazfTsyYTp14Z3EjF4V9puPVNCTQ/edit?usp=sharing) and [Measurement tool for FreeCAD](https://docs.google.com/document/d/1lxe3MTVMQYnv6r3W7KuuzcKgY_rLS2Qgd6FjZlstwaU/edit?usp=sharing). In the end the first one was chosen which was closer to my original idea that got me excited and on the path of applying. I definitely didn't expect the application to succeed, but that might just be the classic imposter syndrome. I put in quite some thought researching the topic and contacted some of the previous students, I even the one who applied for the exact same idea some years before. He was so nice to send me a link to his old application so I could use the feedback he got on his application from back then. This was especially helpful since I didn't get any feedback on my application that I admittedly started a bit late. After the acceptance the project started moving. The FreeCAD community ist mostly organized in an old school internet forum. I haven't used one since I was active on an RC car forum when I was 14. Anyways here is the project thread: [link](https://forum.freecadweb.org/viewtopic.php?f=8&t=46039).

![](/images/gsoc-2020-interactivity-demo.gif)
<p class="caption">It's not much, but it's honest work. This demo shows the benefits of using the Jupyter Notebook environment. You can quickly code an interactive UI that creates objects in a FreeCAD document and removes them again. Also you can see that the viewer will tell you the index of faces and edges. This is important if you want to script FreeCAD entirely in a notebook.</p>

Here is a demo of the entire example Jupyter Notebook. Be aware that due to the missing Python kernel (this is just a static site) most of the interactivity is lost. For full interactivity you should run [the notebook](https://github.com/kryptokommunist/Jupyter_FreeCAD/blob/7dc507e295525909668996adf47bb0df68950fdf/FreeCAD%20inside%20Jupyter%20Notebook%20-%20Examples.ipynb) yourself.

<iframe width="800" height="640" src="/google-summer-of-code-2020" frameborder="0" allowfullscreen></iframe>

<p></p>

But enough with the story telling let's get to the technical details shall we? As said before, the project is targeting [Jupyter Notebooks](https://jupyter.org). They allow users to run and visualize their code together with markdown text inside the web browser. The notebooks support a multitude of programming environments. One of them is Python. Since FreeCAD is a C++ application with an Python binding, that means we can script FreeCAD inside the notebook. Some members of the FreeCAD community played with the idea before and managed to get FreeCAD running from within the notebook. Unfortunately you had to start the entire desktop app along side if you wanted to visualize what you were scripting. This is were the GSoC (Google Summer of Code) project comes to play. The goal was to display the FreeCAD 3D view inside the notebook.

Since the goal is to have a very general solution that will be able to display any content that exists inside the desktop apps 3D view we need to work directly with it's scene graph. So how does FreeCAD generate it's 3D view. Internally FreeCAD relies on an CAD library that calculates all shapes mathematically in an potentially infinite resolution. The visualization on the other hand is realized with an probably not widely know framework called [Coin3D](https://coin3d.github.io). Thankfully someone started creating a Python binding for the Coin3D library as a masterthesis. It still lives on under the name [pivy](https://github.com/coin3d/pivy).

Based on this the plan was to somehow extract the objects from the Coin3D scene graph and to then translate them into a [WebGL](https://en.wikipedia.org/wiki/WebGL) based library that can be rendered inside the notebook. Yikes this meant I might have to touch JavaScript which is not a beauty to work with. After some deliberations I chose [pythreejs](https://github.com/jupyter-widgets/pythreejs) which is a Jupyter Notebook extension that integrates the infamous [ThreeJS](https://github.com/mrdoob/three.js) with a Python bridge. That meant less JavaScript and a smooth integration into the Jupyter Notebook environment. My previous experiments with directly inserting the ThreeJS JavaScript library all failed horribly.

In the end the task was not that complex. All I needed to do was to extract faces and edges from the Coin3D scene graph and then reassemble it in a slightly modified structure inside pythreejs. What still made this project a challenge was starting from zero knowledge about FreeCADs internals and computer graphics. Additionally some potential bugs make their way into the project and finding and solving can take a lot of time. Also communication with many stake holder slows down the progress and it can be frustrating if you think you found a bug and then the project is not maintained regularly and you have to watch your [issues](https://github.com/jupyter-widgets/pythreejs/issues/329) [die silently](https://github.com/jupyter-widgets/pythreejs/issues/331) on Github. Overall it's still a great experience to work so autonomously on an project that is used by so many people. So I hope there will be some people interested in using FreeCAD inside Jupyter Notebook as well.

I will continue to improve the project in the future. You can find the repository here. If you use the module and encounter any issues or just find it useful, don't hesitate to post to the [forum thread](https://forum.freecadweb.org/viewtopic.php?f=8&t=46039) or let me know with a [tweet](https://twitter.com/kryptokommunist) or an issue in the [repository](https://github.com/kryptokommunist/Jupyter_FreeCAD).

Thanks to my mentors: [@ickby](https://forum.freecadweb.org/memberlist.php?mode=viewprofile&u=686), [@kkremitzki](https://twitter.com/thekurtwk), [@yorik](https://twitter.com/yorikvanhavre). I'm grateful for them spending time on helping me with the project. Doing this entirely in their spare time is insanely great! Also thanks to the entire FreeCAD community who gave helpful input. I was especially impressed by how much effort [@vocx-fc](https://github.com/FreeCAD/FreeCAD/pull/3569) put into reviewing my second pull request to FreeCAD.
