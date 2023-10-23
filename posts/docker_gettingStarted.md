---
title: Docker - Getting started
publish_date: 2023-10-22
snippet: Getting started with Docker
summary: An article that answers some of the basic quetions about Docker. What is Docker? Why is it useful? Who is it for?
tags: ["docker", "CLI"]
---

## Section 1 - Getting started
## Docker CLI commands

Go to the following site to view the Docker CLI commands

https://docs.docker.com/engine/reference/commandline/docker/


```
docker container stop CONTAINER_ID
```


### Show all Running containers
```
docker ps
```

### Show all containers:
```
docker ps --all OR docker ps -a
```

```
docker container start CONTAINER_NAME
```

### Run a container in detached mode by name
```
docker container run -d --name CONTAINER_NAME IMAGE_NAME
```
### Pause a container
```
docker container pause docker-exec
```

### Stop a container
```
docker container stop docker-exec
```

## Executing commands in a docker container


A docker exec command will only execute while the container's primary process (PID 1) is running

Open the shell of a container that is running bash (e.g. nginx)
```
docker container exec -it CONTAINER_NAME bash
```

Update the container’s
```
apt-get update
apt-get install net-tools
```


## Use netstat
```
netstat -ntlp
```

## Execute a command using docker directly
```
docker container exec -it CONTAINER_NAME netstat -ntlp
```

NOT ALL CONTAINERS CAN BE ATTACHED VIA Bash,
```
docker container run -dt busybox
```

```
docker container exec -it CONTAINER_NAME bash
```

## Override the default command (CMD) using Docker CLI
```
docker container run -d CONTAINER_NAME sleep 50
```

Nginx Example
```
docker pull nginx
```

```
docker run -it --rm -d -p 8080:80 --name web nginx
```

Open web browser with http://localhost:8080/

Restart Policy Options


Flag
Description
no


on-failure


unless-stopped


always




```
docker container run -d --restart unless-stopped CONTAINER_NAME
```


## Disk Usage metrics
Disk usage metrics in Linux
```
df -h
```

## Docker system disk usage metrics
```
docker system df
```

Additional info:
```
docker system df -v
```

Create a 500mb file
```
dd if=/dev/zero of=bigfile.txt bs=1M count=500
```

Verify the file size
```
du -sh FILE_NAME
```

## Delete a container on exit
```
docker container run -dt –rm --name CONTAINER_NAME busybox ping -c10 google.com
```



