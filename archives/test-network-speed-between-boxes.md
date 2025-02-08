---
draft: false
publish: true
aliases:
  - Test Network Speed
description: Guide for testing network speeds between Linux machines using iperf
date: 2024-11-19
updated: 2024-11-23
tags:
  - snippets
  - linux/networking
  - linux
id: test-network-speed
---

## Test Network Speed between two boxes

- Install iperf `sudo apt install iper`
- Start 1 Server `iperf -i 10 -s`
- Connect from each node `iperf -i 10 -c <server_ip>`
