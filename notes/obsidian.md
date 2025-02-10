---
draft: false
publish: true
aliases:
  - Obsidian
description: Obsidian is a powerful knowledge base that works on top of local Markdown files
date: 2024-11-19
updated: 2025-02-09
tags:
  - tools/obsidian
  - skills/productivity
up: 
jump: 
down: 
---

up:: [[zettelkasten]], [[smart-notes]]
down:: [[dataview]]

---

## Obsidian

> ~~Your second brain, for you, forever~~
> ~~Obsidian is a powerful knowledge base that works on top of a local folder of plain text Markdown files.~~
>
> Sharpen your thinking.
> Obsidian is the private and flexible writing app that adapts to the way you think.
>
> -- <https://obsidian.md>

Obsidian is a markdown-based personal knowledge management system that is geared towards creating a [[second-brain]] where your notes are linked with backlinks.

It's free for personal use and there are business use pricing based on a yearly amount per user.

It can be downloaded for desktop at <https://obsidian.md> or installed from the AUR with `yay obsidian`

It supports Windows, macOS, and Linux ~~with a mobile app coming soon~~ and mobile.

### Tags

Tags are keyword that you use in or assign to files. They allow you to organize your notes in a way that doesn't restrict flow and creativity.

Tags are a direct opposition to the typical folder structure where you can only place a file in one folder. Tags allows you to place files under multiple categories.

### Advanced Techniques

- [Embed files - Obsidian Help](https://help.obsidian.md/Linking+notes+and+files/Embed+files#Embed+an+image+in+a+note)
- [Image Adjustments - SlRvb's Documentation - Obsidian Publish](https://publish.obsidian.md/slrvb-docs/ITS+Theme/Image+Adjustments#Obsidian+Sizing)
	- Add `|512` to the end of an ambedded image to change the size
- Link to a block in another note with `[[note-name^block-id]]`
	- `^` will link a specific block
	- `#` will link to a header
		- [[home#〽️ Stats]]
	- You can even embed a block, section, or whole note by prepending `!`
		- ![[home#〽️ Stats]]
- Fold sections with `Ctrl + ⬆` and `Ctrl + ⬇`
- Enabled multiple cursors by holing alt
- Indent with `tab` and outdent with `shift tab`
- Create a code block with triple `
- Swap lines with `alt + ⬇` and `alt + ⬆`
- Templates within the `99-template` folder or use [[templater]]
- Group tags with `/`
	- `#status/todo`, `#status/backlog`
	- `#tech/language`, `#theme/software-development`, `#tech/concept`
- It's markdown so HTML is supported
	- create elements like <button>button!</button>
	- embed things like tweets
		- <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Here&#39;s a short demo of my latest project. Lot&#39;s of work to do but I wanted to share the progress.<br><br>SHRT<br>Personal Landing Page (PLP) and URL-Shortner.<br><br>Built with:<br>- ReactJS and NextJS<br>- Emotion and Framer-Motion<br>- GCP (Firebase) <a href="https://t.co/9e4BuP1mn7">pic.twitter.com/9e4BuP1mn7</a></p>&mdash; Khari (@tkjohnson121) <a href="https://twitter.com/tkjohnson121/status/1333390020728811520?ref\_src=twsrc%5Etfw">November 30, 2020</a></blockquote>
	- or YouTube video:
		- <iframe width="560" height="315" src="https://www.youtube.com/embed/c6qfrRVUOO8?start=1800" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Resources:

- [Martin Adamin (YT) | Obsidian Advanced Techniques](https://youtu.be/c6qfrRVUOO8?list=TLPQMDQwNjIwMjHBCu4OmoliIg)
- [Anton Heyward | How to create a Tag System](https://youtu.be/hBXVnG6gaYk)
