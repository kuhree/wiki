---
draft: false
publish: true
aliases:
  - SSH Passwordless Login
  - SSH Key Authentication
description: Guide for setting up passwordless SSH authentication using public key pairs
date: 2024-11-19
updated: 2025-02-09
tags:
  - snippets
  - tools/linux
up: 
jump: 
down: 
id: ssh-passwordless
---

- [ ] To set up passwordless SSH login between two servers, typically with public key authentication, follow these steps:

1. **Generate an RSA key pair** on the server you're copying from:
   ```txt
   ssh-keygen -t rsa -b 4096 -C "username@hostname"
   ```

2. **Copy the public key to the destination server** using `ssh-copy-id`:
   ```txt
   ssh-copy-id user@destination-server
   ```
   Or, if `ssh-copy-id` is not available, manually copy the public key from your local `.ssh/id_rsa.pub` file:
   ```txt
   cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   chown -R `whoami`:`whoami` ~/.ssh
   ```

3. **Add the destination server to your local `/etc/hosts.deny` (optional)**:
   ```txt
   : deny from all
   ```
   This helps prevent any unauthorized logins.

4. **Configure `sshd_config` on the destination server** if necessary, such as setting `PermitRootLogin` and `PasswordAuthentication`, which you might want to disable for security reasons:

   ```sh
   sudo cat << EOF > /etc/ssh/sshd_config
   # Custom configuration options...
   PasswordAuthentication no
   PermitRootLogin no
   # ...
   EOF
```txt

5. **Restart the SSH service** on both servers:

   ```
   sudo systemctl restart sshd
   ```txt

Now, you should be able to log in from one server to another using just your private key:

```
ssh user@destination-server
```txt

You'll be prompted once to confirm the public key fingerprint on the destination server. After that, SSH login will be passwordless.

**Note**: The specific commands might vary slightly based on your Linux distribution and version or if you're running macOS or Windows using Cygwin, Git Bash, etc. Always refer to your system's documentation for precise steps.
