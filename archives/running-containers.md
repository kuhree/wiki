---
draft: 
publish: true
aliases:
  - running-containers
date: 2024-11-22
updated: 2024-11-23
tags: []
id: 1731047778-running-containers
---

## running-containers

So there's like 100+ ways to run a "container"?

Off the top of my head

- LXC - docker is based on this. Super lightweight, lowish protection
- [[install-docker|Docker]] - learn this, it's used/applies everywhere
  - Docker Desktop - don't use this
  - Colima - cli docker desktop -- less features, better customization for my workflow
  - orbstack - FOSS docker desktop -- nice, pretty, recommend
- Podman - Docker-like -- without the mistakes (root)?
- [[kubernetes|Kubernetes (K8s)]] - haven't touched
  - k3s
  - minikube - single node
  - microk8s - single node
  - k8s - the full thing, straight from google?
- IaC
  - [[nixos|NixOS]] - offers LXC/OCI containers in config
  - [[opentofu|OpenTofu/Terraform]] - docker provider
