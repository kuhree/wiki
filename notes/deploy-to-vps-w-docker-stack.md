---
draft: 
publish: true
aliases: []
date: 2024-11-22
updated: 2025-02-09
tags:
  - tools/docker
  - tools/linux
up: 
jump: 
down: 
media_link: https://www.youtube.com/watch?v=fuZoxuBiL9o&list=TLPQMjExMTIwMjSfE4QdeDU6eA&index=1
---

up:: [[docker-swarm]]
jump::
down::

---

- [04:44](https://www.youtube.com/watch?t=284&v=fuZoxuBiL9o) Example app - Dockerfile - Compose - Github Action
- [05:39](https://www.youtube.com/watch?t=339&v=fuZoxuBiL9o) Get a VPS with "Hostinger" (or just selfhost)
	- based on Ubuntu setup
	- Setup domain/dns
	- [07:54](https://www.youtube.com/watch?t=474&v=fuZoxuBiL9o) setup a production VPS
	- [08:31](https://www.youtube.com/watch?t=511&v=fuZoxuBiL9o) install docker
- [09:15](https://www.youtube.com/watch?t=555&v=fuZoxuBiL9o) Remote docker host
	- Environment variable `export DOCKER_HOST=ssh://<user>@<hostname>`
	- [09:23](https://www.youtube.com/watch?t=563&v=fuZoxuBiL9o) Docker context
		- can store/manage multiple docker hosts
		- [09:35](https://www.youtube.com/watch?t=575&v=fuZoxuBiL9o) create a context
			- `docker context create <context-name> --docker "host=ssh://<user>@<hostname>"`
		- [10:17](https://www.youtube.com/watch?t=617&v=fuZoxuBiL9o) use the context
			- `docker context use <context-name>`
- [10:42](https://www.youtube.com/watch?t=642&v=fuZoxuBiL9o) docker swarm is required on all nodes for stacks
	- [10:35](https://www.youtube.com/watch?t=635&v=fuZoxuBiL9o) init the swarm on the first machine
		- `docker swarm init`
			- save the returned token or `docker swarm join-token worker` to get a new one
- [11:14](https://www.youtube.com/watch?t=674&v=fuZoxuBiL9o) deploy the first stack
	- `docker stack deploy -c /path/to/compose.yaml <stack-name>`
- [13:33](https://www.youtube.com/watch?t=813&v=fuZoxuBiL9o) secrets
	- [14:04](https://www.youtube.com/watch?t=844&v=fuZoxuBiL9o) create one
		- `docker secret create <secret-name>`
		- [14:26](https://www.youtube.com/watch?t=866&v=fuZoxuBiL9o) secrets require a file or stdin
			- `printf 'mysecretpassword' | docker secret create db-password -`
				- will return the id of a secret
	- [14:45](https://www.youtube.com/watch?t=885&v=fuZoxuBiL9o) list secrets
		- `docker secrets ls`
- [16:23](https://www.youtube.com/watch?t=983&v=fuZoxuBiL9o) support rolling releases (blue/green)
	- [16:43](https://www.youtube.com/watch?t=1003&v=fuZoxuBiL9o)add this to compose
		- `deploy -> update_config -> order -> start-first`
- [17:54](https://www.youtube.com/watch?t=1074&v=fuZoxuBiL9o) scaling applications
	- `docker service scale myservice=3`
- [20:00](https://www.youtube.com/watch?t=1200&v=fuZoxuBiL9o) rollbacks <3
	- `docker service rollback <service-name>`
- [20:23](https://www.youtube.com/watch?t=1223&v=fuZoxuBiL9o) actions
	- build -> test -> push -> deploy
	- [22:32](https://www.youtube.com/watch?t=1352&v=fuZoxuBiL9o) create a "deploy" user to manage permissions
		- see also [[create-a-user]] and [[ssh-passwordless]]

## Sources

- [docker stack is my new favorite way to deploy to a VPS - YouTube](https://www.youtube.com/watch?v=fuZoxuBiL9o&list=TLPQMjExMTIwMjSfE4QdeDU6eA&index=1)
