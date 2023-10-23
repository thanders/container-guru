---
abstract:
publish_date: 2023-10-22
snippet: How to create and manage images? What is the docker Distribution Registry?
summary: Sort summary
tags: ["docker", "image"]
title: Docker - Image creation, management and registry
---

## Section 2 - Docker Image creation, management and registry
## Dockerfile

### Creating a basic Dockerfile
```
FROM ubuntu
RUN apt-get update
RUN apt-get install -y nginx
COPY index.nginx-debian.html /var/www/html
CMD nginx -g 'daemon off;'
```

### Build an image using the current path with tag (repository:tag):
```
docker build . -t nginx:primary
```

### Run a container from image
```
docker container run -d -p 8001:80 --name CONTAINER_NAME IMAGE_ID
```

### Tag an image
```
docker tag d5a02c812427 workdir:primary
```

It can also be tagged while building:
```
docker build . -t workdir:primary
```

### Distribution Registry

The Registry is a stateless, highly scalable server side application that stores and lets you distribute container images and other content.

A registry is a storage and content delivery system, holding named container images and other content, available in different tagged versions.

More information is available [here](https://distribution.github.io/distribution/).



## Image creation, Management and Registry

### COPY and ADD

COPY takes in a src and destination. It only let's you copy in a local file or directory from your host

ADD allows you to do the same, but also allows from two more sources:
From a URL
Extract a tar file directly into the destination

Don’t use ADD because it creates additional layers and increases your image size. If needed, use copy with && with curl OR wget

### EXPOSE

EXPOSE instruction informs Docker that the container listens on the specified network ports at runtime. The EXPOSE instruction does not actually publish the port.

This functions more like documentation for the user

### HEALTHCHECK

https://docs.docker.com/engine/reference/run/#healthcheck

HEALTHCHECK --interval=5s CMD ping -c 1 [IPAddress]


Note IPAddress corresponds to the docker container inspect result. See Networks.bridge.IPAddress.

HEALTHCHECK can be done using the CLI

docker run -dt --name tmp2 --health-cmd "curl -f http://localhost" --health-interval=5s --health-retries=1 busybox sh

 
 
It’s recommended to fail silently when using curl
curl -f http://dexter.kplabs.in/test214.txt


### ENTRYPOINT

Allows  you to set entry location. This can’t be overridden, unlike doing it with CMD.

WORKDIR
WORKDIR /project
WORKDIR context1
WORKDIR context2


If the WORKDIR directory does not exist, it will be created.

WORKDIR can be reused to set a new working directory at any stage of the Dockerfile. The path of the new working directory must be given relative to the current working directory.

### Run an image (detached)
```
docker run -dt workdir:secondary
```

### Execute a command inside a running container

```
docker exec -it work-demo sh
```

ENV
Allows you to set env variables within the container

For example, within the Dockerfile you can use:
```
ENV NGINX 1.2
RUN touch web-$NGINX.txt
```


Through the CLI:
```
docker run -dt --name env02 --env USER=ADMINUSER busybox sh
```
```
docker exec -it env02 sh
echo $USER
```

### Commit

A CLI command that allows you to create a new image based on a container
docker container commit [container name] [new image name]

The --change option will apply Dockerfile instructions to the image that is created. 
```
docker container commit --change='CMD ["bash"]'
```

### Supported Dockerfile instructions:

CMD | ENTRYPOINT | ENV | EXPOSE
LABEL | ONBUILD | USER | VOLUME | WORKDIR

### Docker Layers
Layers are created for each command in the docker file.
docker image history [IMAGE NAME]

&& allows you to combine multiple commands and only create one layer. This will improve performance.

### Managing Images

docker image --help

docker image pull [Image Name]

docker image ls

Inspecting images
```
docker image inspect nginx --format='{{.Id}}'
```

If the value is an object and you add json to the format command you get the whole property back, including the key. Without prepending it with json, the returned object will just contain values separated by spaces.
```
docker image inspect nginx --format='{{json .ContainerConfig}}'
```

### Docker Prune

The docker prune command allows us to clean up unused images. By default the prune command will only clean up dangling images.

Dangling images are images that do not have tags and are not referenced by a container.
```
docker image prune
```

Delete images that are not associated with a container
```
docker image prune -a
```


### Filtering images in Docker hub with search
```
docker search nginx --filter "is-official=true"
```

### Sending a docker image from one computer to another

Save the image to an archive tar file
```
docker save [IMAGE NAME]
docker save myapp > myapp.tar
```

Send the file to the other person
The other person will load the tar file into an image
```
docker load < busybox.tar
```

### Docker build cache

Each time an image is built, the layers are cached. 

If you build two images from a dockerfile, the second image you build should not have to re-build because the layers are cached.

If a layer can’t be retrieved from the cache, all subsequent layers won’t be retrieved from the cache.
