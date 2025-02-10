---
draft: false
publish: true
aliases:
  - Test Network Speed
description: Guide for testing network speeds between Linux machines using iperf
date: 2024-11-19
updated: 2025-02-09
tags:
  - snippets
  - tools/linux/networking
  - tools/linux
up: 
jump: 
down: 
id: test-network-speed
---

## Test Network Speed between two boxes

- Install iperf `sudo apt install iper`
- Start 1 Server `iperf -i 10 -s`
- Connect from each node `iperf -i 10 -c <server_ip>`
