---
layout: post
title: Building an AI Gatekeeper – How I Made My Router Ask "Why Do You Need Internet Right Now?"
category:
- tech
tags:
- tech
- ai
- llm
- router
- openwrt
- project
- claude-code
- agentic-coding
- english
---
Late-night doomscrolling is a universal struggle. You tell yourself "just five more minutes" at 11 PM, and suddenly it's 2 AM. I decided to solve this problem the engineering way: by building an AI-powered captive portal that forces me to justify why I need internet access during nighttime hours. If the AI isn't convinced, no internet for me.

<!--more-->

## The Problem

Between 9 PM and 5 AM, the internet becomes a black hole for productivity and sleep. Social media, YouTube, Reddit – they're all designed to keep you engaged. Willpower alone isn't enough when billion-dollar algorithms are optimized to capture your attention.

I wanted a system that would:
1. Block all internet access during nighttime hours
2. Force me to articulate *why* I need access right now
3. Have an AI evaluate whether my reason is legitimate
4. Grant time-limited access only for valid reasons
5. Be completely automatic – no way to "just disable it real quick"

## The Hardware

I used a [**GL.iNet GL-MT3000 (Beryl AX)**](https://aliexpress.com/item/1005008375955032.html) travel router running OpenWrt. At just ~60 Euro, it's a compact, affordable device that's powerful enough to run Python and sits between my devices and the main internet connection. The key specs:

- ARM Cortex-A53 processor
- ~155MB free storage
- OpenWrt-based firmware
- Full iptables/firewall control

![Router setup placeholder]

## The Architecture

The system has three main components:

### 1. Captive Portal (Python HTTP Server)

When you connect to WiFi during restricted hours, all HTTP traffic gets redirected to a local web page. This splash page presents a chat interface where you explain your reason for needing internet access.

### 2. AI Gatekeeper (Google Gemini API)

Your justification gets sent to Google's Gemini LLM with a carefully crafted system prompt. The AI acts as a strict but fair gatekeeper:

- **10 minutes**: Quick checks that genuinely can't wait
- **Up to 60 minutes**: Work/school tasks due TODAY
- **Up to 120 minutes**: Video calls and meetings

The AI can ask up to 3 clarifying questions before making a decision. It's instructed to be understanding but firm – "I want to browse Reddit" gets denied, while "I have a work deadline at midnight" gets approved.

### 3. DNS Hijacking + HTTP Redirect

Getting iOS and macOS to reliably show the captive portal popup required a two-pronged approach:

**DNS Hijacking**: All domain lookups resolve to the router's IP address:
```bash
uci add_list dhcp.@dnsmasq[0].address='/#/192.168.8.1'
```

**HTTP Redirect**: All port 80 traffic gets redirected to our portal:
```bash
iptables -t nat -I PREROUTING 1 -i br-lan -p tcp --dport 80 \
  -j REDIRECT --to-port 2050
```

**Internet Blocking**: Forward chain blocks all LAN→WAN traffic:
```bash
iptables -t filter -I FORWARD 1 -i br-lan -o eth0 -j REJECT
```

When access is granted, these rules are temporarily removed, and normal DNS resolution is restored.

## The Conversation Flow

Here's what a typical interaction looks like:

![Chat interface placeholder]

**AI**: Hi! It's 11:30 PM. Why do you need internet access right now? I'll evaluate if it's urgent enough.

**Me**: I need to check my email for work.

**AI**: How many minutes do you need?

**Me**: About 30 minutes.

**AI**: Why do you need 30 minutes specifically? What will you be doing that requires this much time?

**Me**: I'm expecting an important response from a client about tomorrow's presentation. I need to review it and possibly make changes to my slides.

**AI**: ✓ Access Granted for 30 minutes!

The system then:
1. Adds firewall rules to allow my device's MAC address
2. Starts a timer
3. Kicks me off WiFi when time expires
4. Requires re-justification for more time

## Proof Required for Longer Access

For requests over 10 minutes, the AI requires proof – a screenshot of the email, calendar invite, or assignment. The image gets sent to Gemini's multimodal API, which analyzes whether it supports the stated reason.

![Proof upload interface placeholder]

This prevents gaming the system with vague claims about "work stuff."

## Persistent Request Logging

The system maintains a log of all requests throughout the night. This gets included in the AI's context, so it can see patterns:

```
## Previous requests tonight:
- [22:15] ✓ Quick email check (10 min)
- [23:30] ✓ Client presentation prep (30 min)
- [01:45] ✗ "just want to browse"
```

If I've already been granted access three times tonight, the AI becomes more skeptical. The log gets cleared at 5 AM – each night is a fresh start.

## Auto-Start and Scheduling

The system is fully automatic:

- **On boot**: Checks the time and starts in the appropriate mode
- **9:00 PM**: Cron job enables gatekeeper mode
- **5:00 AM**: Cron job disables it, clears the request log

Even if I reboot the router at midnight trying to escape, it comes back up in gatekeeper mode.

## The Code

The entire system is a single Python script (~1100 lines) that handles:

- HTTP server for the captive portal
- Gemini API integration (with multimodal support for images)
- iptables firewall management
- DNS hijacking for captive portal detection
- External DNS resolution to bypass local hijacking for API calls
- Session tracking and rate limiting
- Persistent request logging

Key technologies:
- Python 3 with `http.server` (no external dependencies)
- Google Gemini API (`gemma-3-27b-it` model)
- iptables for traffic control
- dnsmasq wildcard DNS for captive portal detection
- OpenWrt's procd for service management

The source code is available on GitHub: [github.com/kryptokommunist/smart_router](https://github.com/kryptokommunist/smart_router)

## Built with Claude Code: From Idea to Working System in One Evening

Here's the part that still amazes me: **this entire project was built in a single evening using Claude Code**, Anthropic's agentic coding assistant. What would have been a week of tinkering, Stack Overflow searches, and frustrating debugging sessions became a fluid conversation with an AI pair programmer.

### The Old Way vs. Agentic Coding

Pre-agentic coding, this project would have involved:

1. **Research phase** (1-2 days): Reading OpenWrt documentation, understanding iptables, figuring out captive portal options, learning the Gemini API
2. **Setup struggles** (1 day): SSH configuration, package installation failures, storage constraints
3. **Implementation** (2-3 days): Writing Python code, debugging firewall rules, handling edge cases
4. **Integration hell** (1-2 days): Making all the pieces work together, fixing race conditions, handling timeouts

With Claude Code, I described what I wanted, and it:

- **Explored the router** via SSH, checking available storage, installed packages, and system capabilities
- **Made architectural decisions** based on constraints (abandoned nodogsplash when it proved unreliable, built a custom solution instead)
- **Wrote and deployed code** directly to the router, testing incrementally
- **Debugged issues in real-time** – when the captive portal wasn't triggering, it analyzed iptables rules and fixed the ordering
- **Iterated on feedback** – "the redirect isn't working" led to immediate investigation and fixes

### What Made It Work

The key insight is that agentic coding isn't just "AI writes code." It's having a collaborator who can:

1. **Execute commands** on remote systems (SSH into the router, check logs, restart services)
2. **Maintain context** across a long session (remembering that we switched from nodogsplash to a custom solution)
3. **Debug systematically** (checking firewall rules, testing API endpoints, reading logs)
4. **Handle the tedious parts** (iptables syntax, JSON parsing edge cases, init script boilerplate)

I focused on *what* I wanted: "block internet at night, require AI justification, grant timed access." Claude Code figured out *how* to make it happen on this specific hardware with these specific constraints.

### The Development Flow

The session went something like this:

1. **Me**: "I want an LLM-gated internet access system for my GL-MT3000 router"
2. **Claude**: *SSHs into router, checks specs, proposes architecture*
3. **Me**: "The captive portal isn't showing up"
4. **Claude**: *Checks iptables, finds rule ordering issue, fixes it*
5. **Me**: "Now require image proof for longer requests"
6. **Claude**: *Adds file upload UI, integrates Gemini multimodal API*
7. **Me**: "The AI should know about previous requests tonight"
8. **Claude**: *Adds persistent logging, includes history in LLM context*

Each iteration took minutes, not hours. The AI handled the implementation details while I steered the direction.

### Where Agentic Coding Still Falls Short

Let me be clear: Claude Code isn't magic, and this project required corrections. Here are real examples of where I had to step in:

**1. The Captive Portal Showed the Wrong Page**

After implementing DNS hijacking (all domains → router IP), the captive portal showed the router's admin web UI instead of our splash page. Claude had added this iptables rule:

```bash
# BROKEN: Excludes gateway IP from redirect
iptables ... --dport 80 ! -d 192.168.8.1 -j REDIRECT --to-port 2050
```

The logic seemed sound – "don't redirect traffic meant for the router itself." But with DNS hijacking active, *all* HTTP requests were now destined for the router IP, so *nothing* got redirected. I had to point out that the splash page was wrong, and Claude then diagnosed and fixed it:

```bash
# FIXED: Redirect ALL port 80 traffic
iptables ... --dport 80 -j REDIRECT --to-port 2050
```

**2. The AI Couldn't Reach the Internet**

After enabling DNS hijacking, the Gemini API calls started failing with "failed to reach AI service." The router was using its own DNS server (dnsmasq), which had the wildcard hijack rule – so `generativelanguage.googleapis.com` resolved to `192.168.8.1` instead of Google's servers.

Claude's initial instinct was to hardcode the IP address in the URL. This broke SSL certificate validation (SNI mismatch). I pointed out the error, and after a few iterations, Claude implemented a proper solution: resolve the hostname via external DNS (8.8.8.8), then monkey-patch Python's `socket.getaddrinfo` to inject the resolved IP while keeping the hostname intact for proper SSL/SNI handling.

**3. What This Tells Us About Agentic Coding in 2026**

These bugs share a common pattern: **Claude optimized for the immediate problem without fully modeling downstream effects**. The gateway IP exclusion made sense in isolation. DNS hijacking made sense for captive portal detection. But their interaction created a bug that required human oversight to catch.

Current AI coding assistants are excellent at:
- Implementing well-defined components
- Debugging when you can describe the symptom
- Handling boilerplate and syntax details
- Exploring unfamiliar systems (SSH, check logs, read configs)

They still struggle with:
- Reasoning about system-wide interactions
- Anticipating how change A affects component B
- Knowing what they don't know (no "wait, this might break X")

The workflow that works: **AI implements, human validates**. I couldn't have built this project solo in an evening, but Claude couldn't have shipped it without me catching these integration bugs. We're in the "centaur" phase of AI coding – the combination outperforms either alone.

### This Changes Everything

I've been programming for over a decade. The jump from pre-LLM to agentic coding feels as significant as the jump from assembly to high-level languages. Not because AI writes perfect code (it doesn't – see above), but because it removes the friction between *having an idea* and *seeing it work*.

Projects that lived in my "someday maybe" list because of the activation energy required are now afternoon experiments. The gatekeeper idea had been bouncing around in my head for months – "it would be cool, but dealing with router firmware and captive portals sounds painful." With Claude Code, the pain disappeared – even accounting for the debugging.

## Does It Actually Work?

**Yes.** The friction of having to justify myself to an AI is surprisingly effective. When I'm about to request access for "just checking Twitter," I realize how weak that sounds and often just go to bed instead.

The key insights:

1. **Articulating intent creates friction**: Having to type out why you need something makes you evaluate whether you actually need it
2. **Time limits create urgency**: Knowing I only have 30 minutes makes me focused and efficient
3. **No easy escape**: The router sits between me and the internet – there's no "disable just this once" button
4. **AI is more objective than willpower**: I can't negotiate with myself at 1 AM

## Video Demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/eoj_pzWLsXc?si=2nUCxVeSLl-oRVpP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Future Improvements

Some ideas I'm considering:

- **Multiple user support**: Different rules for different family members
- **Graduated strictness**: Stricter as the night goes on (easier at 9 PM, harder at 2 AM)
- **Weekly reports**: Summary of access patterns and sleep improvements
- **Voice interface**: Ask the AI verbally through a smart speaker

## Conclusion

This project is a double showcase of AI capabilities: an LLM enforcing digital wellbeing, built with the help of an AI coding assistant. Both represent the same insight – AI can be a tool for human flourishing, not just engagement and productivity metrics.

The gatekeeper forces me to articulate my intentions, adding friction where friction is needed. Claude Code removed friction where it was just getting in the way of building something useful.

Building this project was a fun exercise in using AI for behavioral change rather than engagement optimization. Instead of an algorithm trying to keep me online longer, I have one trying to get me offline and to bed. And instead of spending a week wrestling with router firmware, I spent an evening having a conversation.

The technology that powers addictive apps can also power tools for digital wellbeing. Sometimes you just need to put a stern AI between yourself and your bad habits – and another one to help you build it.

---

*The source code is available at [github.com/kryptokommunist/smart_router](https://github.com/kryptokommunist/smart_router). Have questions? Find me on [contact placeholder].*
