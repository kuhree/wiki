---
draft: 
publish: 
aliases: []
date: 2025-01-04
updated: 2025-02-09
tags: []
up: 
jump: 
down: 
id: every-developer-should-have-a-homelab
---

Audience:: Developers curious about advancing skills and practical examples.

Purpose:: To expose the idea / pros / cons of owning an running a homelab as a developer

Tone:: Conversational / Enthusiastic - Some technical insights and personal experiences

---

## Outline

- Introduction
	- Hook
	- Context: What is a homelab? What does it matter to you?
	- Thesis: Running your own homelab / homenetork will make you a better developer (especially self-taught devs)
- What is a Homelab?
	- Definition
	- Components
	- Ways it can be use - testing, learning, expirementing
- Benefits of a homelab
	- Trying things out without risk of taking down prod
	- Portfolio/Resume building
	- Learning more about networking, security, how others distribute software
- Cons of a homelab
	- Can be costly -- in both time and money
- How to start a homelab
	- Grab whatever unused/second-hand hardware you can find. No 20 year old servers. Something from the last decade or so, relatively small and easy to tinker with
	- Future-proof as much as you can, but don't get caught up on it
		- You don't know what you need when you start so try to get something to cover the basics
	- Grab some virtualization software and get familiar with it -- proxmox for example
	- Create your network, spin up some VMs, and start hosting services
- Obstacles
	- It can take a lot of your time (and money) to start a homelab. Just be cautious of what you're doing and why
	- Use the internet to your advantage. Most times, someone has tried what you're thinking of, just ask google (or chatgpt)
	- My 2-3 most used services are Gitea (git hosting and CI/CD pipelines), traefik (reverse-proxy), and the ARR suite.
		- Once you have these setup it's easier to expand on

## Draft

### Introduction

This all started as a journey to move myself off the "cloud" (someone else's servers) and to take back ownership of my data and the services that I use every day (mail, calendar, notes, file storage, media streaming).

This was around the same time that Google Workspace had upped the pricing and changed plans around. Killedbygoogle was on my then Twitter feed every other month. Data breaches were happening left and right. I was sick of blindly trusting some other company to hold and protect my data.

There are more reasons too, like wanting to offload development tasks without the risk of leaking anything. Or, to host your own streaming service and file hosting for your notes.

I feel 100% better knowing that everything I've ever done is in one place (well, 3+ places). One place that I own and control and can change/destroy it without too much hassle. Have your ever tried cancelling a Google GSuite/Workspace subscription? It's not that easy.

### What is a homelab?

Okay, enough rambling. What even is a homelab?

There are many definitions for a homelab depending on who you ask.

They usually have a few common themes like:

- not used for production
- easy to test new ideas and iterate on existing ones

In my experience, I think it's easier to tell you what it's not, then tell you what it is.

A homelab is not **critical**. If it goes down, no one dies, no one is loosing substantial amounts of money, things like that.

Outside of that, I believe almost anything can be a "home" "lab."

#### Components

For me this, this started with old windows laptops and Raspberry Pis. I was trying to offload download activity to another computer so my desktop was free to play or whatever. In practice, it didn't work how I expected it to, but I learned about bandwidth that week.

It's since evolved into last-gen gaming PCs and some second-hand networking equipment. Still very simple for my needs and maybe even overkill honestly. However, with AI in the mix, things are getting a bit crazy as far as raw power goes.

To start, you only need one thing. A computer of some type. An old laptop, a raspberry PI, a mini PC. It doesn't matter. What matters is that you can get familiar with it and that you physically own the hardware.

#### Use Cases

There is probably an infinite number of ways to utilize a home lab.

Here are my most common:

1. Git hosting. Every line of code I write is initialized into a git repo and synced to a Gitea instance. This has honestly given me so much peace of mind. This alone is worth the time sink.
	1. A few years ago, Microsoft bought GitHub. Everyone freaked out, I moved to GitLab, Github changed their policies. At some point, I was limited on the number of private repositories I could own. Now there's never a limit. Only a hardware limit.
2. CI/CD Pipeline. How many times have you been in the make a change, push the change, watch CI loop when trying to adjust a pipeline. It gets old and repetitive and can even be costly. There are ways you can get around this by running the pipeline locally, however this didn't end too well on my 2019 Intel-based Macbook Pro. So, I offload the pipeline to my much more powerful (and cooler) server and get pinged when it's done.
3. Photo/File Hosting. I've always been a fan of Google Drive. Throw a bunch of files in there and access them anywhere you have a web browser. This workflow enabled so much of the work that I do today. At some point, my usage started to be quite high. Somewhere in the 2-4TB range. This got too expensive very quickly for a broke 20 something. Now I've got the same workflow, on my own hardware. I have access to originals, backups, compressed copies. The best part, I only pay about $50-100/year for storage upgrades on average.

### Benefits of a Homelab

More than just a technical playground--it's a free space for one to develop their skills and push them the their limit. It's a free space for exploring the possibilities without the risk of taking down a company. Here are a few more reasons that you might consider:

- Hands-on Learning: If you're like me, you learn best **doing** things with your hands. A homelab offers the chance to get your hand dirty in a risk-free environment.
- Portfolio Building: As a developer, a homelab is a great conversation piece when it comes to networking, meeting new people, and even as an interview topic.
- Cost: Running a homelab could save you money in the long run. Especially if you already have some old hardware laying around.

A homelab isn't just about the technology. It's about growth and continuous learning. It's about honing your craft and discovering things that you would never have thought about. It's a space where you can push your limits and discover what else is out there.

### How to setup a Homelab

1. Start small

You don't need to break the bank to start. Unless you know exactly what you want to run, your needs will evolve as you grow. Start small with what you have--an old laptop, a mini PC, or even a cloud VM if you're comfortable. Focus on understanding what each piece does and how it fits in the bigger picture.

2. Basic Tools and Equipment

At a minimum, you'll need a computer. Try not to have anything _too_ old (20+ yrs) and as new as you can afford. This is for a couple of reasons:

- Upgrading can be expensive. Once you've maxed out your current hardware, it can be difficult to upgrade depending on your needs. Future proofing as much as you can ensures that you can do incremental upgrades as you need them rather than having switch to whole new platforms.
- Electricity and Silence is not free. Older machines are generally less power efficient and can often run louder (fans!) than their modern counterparts. Getting something from the last decade or so should be safe enough.

Other than that, you may pick up one or multiple of the following depending on your needs.

- Virtualization/Containers: This allows you to split your workloads into "Virtual Machines." I'm talking about software like VMWare, Virtualbox, or Proxmox. There's a lot out there and each has it's own pros and cons. Similar to virtual machines, containers allow you to split the workload into lightweight processes that share the same kernel as the host system. Software like LXC, Docker, and Kubernetes are generally the goto here.
- Networking Gear: I assume that you have an Internet Service Provider and that they gave you a little box for you to connect to. This works for 99.9% of people and is just fine. However, if you're wanting a bit more control, you can always add your own gear in between or in-place of the ISP's modem/router.

3. Get Started

Once you've got all the hardware and infrastructure in place, it's time to start running services. If you're not sure what to run, here are a few ideas to get your started

- Install a VPN like Tailscale or Wireguard so you can access the services from anywhere.
- Set up file sharing such has Nextcloud or Syncthing to sync and access your filed from anywhere

4. Scaling Up

Once you've got a few services running, disks are spinning, network traffic is flowing. You may find yourself in need of an upgrade. From here, you might add more servers. You could explore clustering or dive into advanced networking like VLANs and firewalls. A homelab is yours and should evolve as your skills an interests do. That's the beauty of it.

### Obstacles

[to-be-continued]

## Post

### Introduction

What if you could take back control of your data, your services, and your development environment—all while building new skills and maybe even saving some money?

For me, the journey began as an attempt to step away from the "cloud"—someone else's servers—and reclaim ownership of my data and daily services like email, calendars, file storage, and media streaming. This was around the time Google Workspace was hiking prices and tweaking plans, 'Killed by Google' was trending regularly on Twitter, and news of data breaches seemed endless. I am tired of blindly trusting big companies with my data and dealing with the fallout.

Owning your data is only the beginning. A homelab opens up endless possibilities: hosting your own streaming services, running secure file storage for sensitive notes, even offloading development tasks.

Setting up my homelab gave me a newfound sense of control, security, and freedom. It’s a space I own, manage, and modify as I see fit—something every developer deserves to experience. If you’ve been considering one but haven’t started yet, let me share why it’s worth it and how you can get started.

### What is a Homelab?

Okay, enough rambling--what even is a homelab?

It seems like such a simple question, but there's no right answer here. A homelab can mean many different things to different people. Still, you'll notice a few common traits when you start to look closer:

- They're not used for **production**
- They're easy to test new ideas and iterate on existing ones

In my experience, it’s easier to explain what a homelab isn’t before trying to define what it _is_.

A homelab isn’t **critical**. If it goes down, no one dies, no one loses significant money, and nothing catastrophic happens. Outside of that, almost anything can qualify as a "home" "lab." It’s all about experimentation, learning, and pushing boundaries on your own terms.

#### Components

My homelab journey began with old Windows laptops and Raspberry Pis around 2013. I wanted to offload downloads to free up my desktop for gaming. It didn’t work as expected, but I learned a lot about bandwidth that week!

Today, my setup includes last-gen gaming PCs and second-hand networking equipment—admittedly overkill for my needs. But with AI workloads creeping into my projects, having extra power is becoming essential.

Getting started is simpler than it seems. All you need is one computer—an old laptop, a Raspberry Pi, or even a mini PC. The key is owning the hardware and tinkering freely to learn and grow.

#### Use Cases

1. **Git Hosting**

Every line of code I write lives in a Git repository synced to my self-hosted Gitea instance. This setup gives me total control and peace of mind. No corporate policy changes, no limits on private repos—just the freedom to work as I please.

A few years ago, Microsoft acquired GitHub and many developer (myself included) freaked out. I switched to GitLab and eventually made my way back to Github. With my homelab, I’m no longer at the mercy of external platforms, relying only on the hardware I own and how far I can push it.

2. **CI/CD Pipeline Testing:**

If you’ve ever been stuck in the 'change-push-watch CI' loop, you know how tedious it can be—especially when adjusting pipelines. Running CI locally is one option, but my 2019 Intel MacBook Pro didn't appreciate the extra workload.

Now, I offload these tasks to a much more powerful server in my homelab. It runs cooler, faster, and even pings me when jobs are done. No lag, no frustration, just seamless testing and iteration.

3. **Photo and File Hosting:**

I’ve always loved the convenience of Google Drive/Photos. Throw in a bunch of files, access them from anywhere. But when my storage needs hit 2-4TB, the costs skyrocketed. As a broke twenty-something, I needed something better.

Now, I’ve recreated that workflow on my own hardware. I have access to originals, backups, and even compressed copies, all for a fraction of the cost. I spend about $50-100 per year on storage upgrades on average, compared to hundreds with cloud services.

### Benefits of Having a Homelab

A homelab is more than just a technical playground—it’s a space to grow, experiment, and push your skills to their limits. It’s a free environment to explore new possibilities without the risks of impacting production systems. Here are a few more reasons you might consider building one:

- **Hands-on Learning**: If you’re like me, the best way to learn is by doing. A homelab offers the perfect opportunity to get your hands dirty in a risk-free environment. Whether you’re configuring servers, testing software, or simulating network setups, every mistake is a chance to learn—and the stakes are entirely in your control.
- **Portfolio Building**: As a developer, your homelab is more than just a tool—it’s a conversation starter. Whether you’re at a networking event or in an interview, showcasing the projects you’ve built in your homelab demonstrates initiative, problem-solving skills, and technical curiosity. It’s an impressive way to make your work stand out.
- **Cost**: Running a homelab doesn’t have to break the bank. In fact, it could save you money in the long run. If you already have old hardware lying around—like a retired laptop or an unused Raspberry Pi—you’re halfway there. And compared to the recurring costs of cloud services, a homelab pays for itself over time.

A homelab isn’t just about technology—it’s about growth, discovery, and continuous learning. It’s a place to hone your craft, explore uncharted ideas, and challenge yourself. Whether you’re a beginner or a seasoned developer, a homelab is your personal space to experiment, innovate, and see what else is possible.

### How to setup a Homelab

1. Start small

You don't need to break the bank to start. Unless you know exactly what you want to run, your needs will evolve as you grow. Start small with what you have--an old laptop, a mini PC, or even a cloud VM if you're comfortable. Focus on understanding what each piece does and how it fits in the bigger picture.

2. Basic Tools and Equipment

At it's core, a homelab needs only one thing: a computer. You don't _need_ the latest and greatest, but try to avoid machines that are too outdated (e.g. 20+ years old). Here's why:

- Upgrading can be expensive. Once you've maxed out your current hardware, upgrading can be costly and restrictive. I found that hardware from the last 3-5 generations are usually the sweet spot in price and performance.
- Efficiency. Electricity and silence is not free. Older machines tend to be less power efficient and noisier, with louder fans and higher electricity usage. Modern tech generally strikes a better balance between performance, noise, and energy consumption.

Other than that, you may pick up one or multiple of the following depending on your needs.

- Virtualization/Containers: Split your workloads into isolated environments using tools like VMWare, Virtualbox, or Proxmox. For more lightweight/scalable processes, consider containers with LXC/Docker, and Kubernetes.
- Networking Gear: I assume that you have an Internet Service Provider and that they gave you a little box for you to connect to. This works for 99.9% of people and is just fine. However, if you're wanting a bit more control, you can always add your own gear in between or in-place of the ISP's modem/router to help you create a robust and customizable setup.

3. Get Started

Once you've got all the hardware and infrastructure in place, it's time to start running services. If you're not sure what to run, here are a few ideas to get your started

- Install a VPN like Tailscale or Wireguard so you can access the services from anywhere.
- Set up file sharing such has Nextcloud or Syncthing to sync and access your filed from anywhere

Starting with just a few services will help you to understand your setup and build confidence in making changes.

4. Scaling Up

Once you’ve got a few services humming along and you’re comfortable with your setup, you might find yourself needing more resources. At this point, consider:

- Adding more servers for additional workloads.
- Experimenting with clustering using Kubernetes or other orchestration tools.
- Diving into advanced networking concepts like VLANs and firewalls.

Your homelab evolves as you do. That’s the beauty of it—it grows with your skills, interests, and ambitions.
