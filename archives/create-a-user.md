---
draft: false
publish: true
aliases:
  - Create a User
description: Guide for creating and configuring users on Linux systems
date: 2024-11-19
updated: 2024-11-23
tags:
  - snippets
  - linux
id: create-a-user
---

## Create a User on Linux

To create a default admin user on Linux, you can follow these steps:

- First, you need to create a new user account using the useradd command. For example, you can create a user named “admin” with the command sudo useradd admin.
- Next, you need to set a password for the new user using the passwd command. For example, you can set the password for the “admin” user with the command sudo passwd admin.
- To grant the new user administrative privileges, you need to add them to the sudo group. You can do this using the usermod command with the -aG option. For example, you can add the “admin” user to the sudo group with the command sudo usermod -aG sudo admin.
- Finally, you can verify that the new user has administrative privileges by logging in as the “admin” user and running a command that requires root privileges, such as sudo apt-get update.
- Here is an example of how you can create a default admin user on a Linux system:

```bash
sudo useradd admin
sudo passwd admin
sudo usermod -aG sudo admin
mkhomedir_helper admin
```

Or, in a one-liner
```shell
sudo useradd -m -G sudo -U -s /bin/bash admin
```
