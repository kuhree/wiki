---
draft: 
publish: true
aliases:
  - Docker Swarm
date: 2024-11-22
updated: 2025-02-09
tags: []
up: 
jump: 
down: 
id: 1731807692-docker-swarm
---

## Docker Swarm

### What is a swarm ?

A `swarm` is the cluster managemnet and orchestrationg features embedded in Docker Engine using swarmkit. `Swarmkit` is a separate project which implements Docker's orchestration layer and is used directly within Docker.

A `swarm` consists of N+ docker hosts running in swarm mode. Of the hosts, there are two roles. A given host can have one or both roles.

- managers, to manage membership and delegation
- workers, running swarm services

Docker Swarm attempt to run a service according to it's optimal state as declared. If a worker goes down, swarm will attempt schedule those tasks on another node. A `task` is a running container, managed by the swarm.

Once a service's configuration is modified, the swarm will update the configuration stop tasks that are out of date and create new ones matching the new upgrade.

### Creating a swarm / Creating a Manager

A swarm requires:

- networked host machines, ideally 3+ (1 manager, 2 workers).
- with docker installed
- the ip of the manager
- the following ports between machines:
  - Port 2377 TCP for communication with and between manager nodes
  - Port 7946 TCP/UDP for overlay network node discovery
  - Port 4789 UDP (configurable) for overlay network traffic

To initialize a swarm

1. SSH into your "manager"
2. Run `docker swarm init --advertise--addr <MANAGER-IP>`

This should return something like:

```sh
$ docker swarm init --advertise-addr 192.168.99.100
Swarm initialized: current node (dxn1zf6l61qsb1josjja83ngz) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join \
    --token <TOKEN> \
    <MANAGER-IP>:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```

3. Run `docker info` to view the current state of the swarm:

```bash
$ docker info

Containers: 2
Running: 0
Paused: 0
Stopped: 2
  ...snip...
Swarm: active
  NodeID: dxn1zf6l61qsb1josjja83ngz
  Is Manager: true
  Managers: 1
  Nodes: 1
  ...snip...
```

4. Run the `docker node ls` command to view information about nodes:

```bash
docker node ls

ID                           HOSTNAME  STATUS  AVAILABILITY  MANAGER STATUS
dxn1zf6l61qsb1josjja83ngz *  manager1  Ready   Active        Leader
```

### Joining the swarm / Creating Workers

1. SSH into your "worker"
2. Run the command from when you created the manager

```bash
docker swarm join \
  --token <TOKEN> \
  <MANAGER-IP>:2377
```

Or, if you don't have access to that, you can get it by running the following on the manager node:

```bash
$ docker swarm join-token worker

To add a worker to this swarm, run the following command:

    docker swarm join \
    --token <TOKEN>
    <MANAGER-IP>:2377
```

3. Repeat, 1-2 on all worker nodes

You can check the status of the nodes on the manager as they join by running:

```bash
$ docker node ls
ID                           HOSTNAME  STATUS  AVAILABILITY  MANAGER STATUS
03g1y59jwfg7cf99w4lt0f662    worker2   Ready   Active
9j68exjopxe7wfl6yuxml7a7j    worker1   Ready   Active
dxn1zf6l61qsb1josjja83ngz *  manager1  Ready   Active        Leader
```

### Deploy a service / Run a container

1. SSH into your "manager"
2. Deploy the service

You can use a command like the following:

```bash
$ docker service create --replicas 1 --name helloworld alpine ping docker.com

9uk4639qpg7npwf3fn2aasksr
```

3. Run `docker service ls` to check the status of the service with
4. Run `docker service inspect --pretty <SERVICE-ID>` to get details about the specific service. Replace `--pretty` for `--json` when needed.

```bash
[manager1]$ docker service inspect --pretty helloworld

ID:		9uk4639qpg7npwf3fn2aasksr
Name:		helloworld
Service Mode:	REPLICATED
 Replicas:		1
Placement:
UpdateConfig:
 Parallelism:	1
ContainerSpec:
 Image:		alpine
 Args:	ping docker.com
Resources:
Endpoint Mode:  vip
```

4. Run `docker service ps <SERVICE-ID>` to see which nodes are running the service:

```bash
[manager1]$ docker service ps helloworld

NAME                                    IMAGE   NODE     DESIRED STATE  CURRENT STATE           ERROR               PORTS
helloworld.1.8p1vev3fq5zm0mi8g0as41w35  alpine  worker2  Running        Running 3 minutes
```

5. [Scale the service](https://docs.docker.com/engine/swarm/swarm-tutorial/scale-service)

### Delete the service

1. SSH into your "manager"
2. Run something like `docker service rm helloworld`

### Deploy a Stack / Compose up

1. Run `docker stack deploy` to deploy a compose stack

> [!NOTE]
> The docker stack deploy command uses the legacy Compose file version 3 format, used by Compose V1. The latest format, defined by the Compose specification isn't compatible with the docker stack deploy command.
>
> For more information about the evolution of Compose, see History of Compose.
