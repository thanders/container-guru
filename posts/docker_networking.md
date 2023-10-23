---
abstract:
publish_date: 2023-10-22
snippet: Docker network interfaces explained (bridge, user defined bridge)
summary: Docker networking
tags: ["docker", "image"]
title: Docker - Networking
---

## Section 3 - Networking

### Install bridge-utils locally
```
sudo apt install bridge-utils
brctl show
```

### Show a list of network interfaces and their types
docker network ls


### Inspect a network interface

docker network inspect bridge


### Overview of User-defined Bridge

User-defined bridges provide better isolation and interoperability between containerized applications
User-defined bridges provide DNS resolution between containers
Containers can be attached and detached from user-defined bridges on the fly
Each user-defined network creates a configurable bridge

### Create a user defined bridge
```
docker network create --driver bridge mybridge
```

### Create a container and map the host port to the container’s port (host:container)
```
docker container run -dt --name webserver -p 80:80 nginx
```

docker container exec -it bridge01 bash

Install ping:
apt-get install iputils-ping


ping 172.17.0.4


