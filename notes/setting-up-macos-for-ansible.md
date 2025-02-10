---
draft: 
publish: 
aliases: []
date: 2024-12-28
updated: 2025-02-09
tags:
  - tools/macos
  - tools/ansible
up: 
jump: 
down: 
---

There are a few requirements in order to run an Ansible playbook on a MacOS machine (or most other Unix machines).

1. SSH Access

My preferred way to access a machine through Ansible is SSH. Create a key, copy it over, done. Well also set some settings, but you can find that.

> See [[ssh-passwordless]] for more information on setting up Passwordless authentication.

**That's it. You're done.** I mean. not _quite_, but that's the majority of it.

2. Package Manager

As far as I can tell, MacOS doesn't come with a default package manager. For this instance we'll be using [Homebrew](https://brew.sh/). It's slow, but it gets the job done. In the future I may give nix-darwin a shot. Or, not.

Follow the instruction on their website to learn more about installing homebrew.

Alternatively, you could include a step in the Ansible playbook like so:

```yaml
- name: install homebrew
  become: no
  block:
    - name: check if homebrew is already installed
      stat:
        path: /usr/local/bin/brew
      register: brewExists
    - name: run the installer
      shell: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
      delay: 3
      when: not brewExists.stat.exists
```

> [!note] Please remember to copy over the SSH key, I forgot this time.
