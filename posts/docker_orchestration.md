---
abstract:
publish_date: 2023-10-22
snippet: Docker network interfaces explained (bridge, user defined bridge)
summary: Docker networking
tags: ["docker", "image"]
title: Docker - Orchestration
---

## Section 4 - Orchestration

## Containerization

Container orchestration solutions
DockerSwarm, Kubernetes, Apache Mesos, AWS Elastic Container Service (ECS), also

Container orchestration platforms
EKS

```
systemctl stop docker
```

```
docker service ps helloworld
```

### Docker Swarm

Docker Swarm is a container orchestration tool which is natively supported by Docker

Steps to create a swarm:
Setup Docker on each node (droplet). This is required for use with CentOS



A script to install Docker CE on CentOS using Yum
```
#!/bin/bash
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum -y install docker-ce
systemctl start docker
systemctl enable docker
```


Docker Swarm:

Overview


A node is an instance of the Docker engine participating in the swarm.
To deploy your application to a swarm, you submit a service definition to a manager node.
The manager node dispatches units of work called tasks to worker nodes

docker swarm init --advertise-addr <MANAGER-IP>
docker swarm join-token worker


Initialize the Swam Manager [Run this from swam01 server]
Connect to the worker droplet and find the inet address
ifconfig eth0


Initiate the swarm from within the droplet (manager)
docker swarm init --advertise-addr 147.182.231.98


You will see a command to add worker nodes
docker swarm join --token SWMTKN-1-3l9m2ngk2uepro11anq330yictkz2zggmegrmtziz7jmnn9l51-4iccyj5fvkr6f52txsmyu1ala 147.182.231.98:2377


Open a worker droplet and add it as a worker node


Verify the Node status
docker node ls


Net-tools may be required
Yum install net-tools

Adding a worker node to the existing Swarm

Login to the node
Use the docker swarm join -token command described above to add the worker to the swarm
From the manager node, execute docker node ls



### Services, Tasks and Containers


A service is a the definition of the tasks to execute on the manager or worker nodes
Show services
docker service ls

Create a basic service (webserver)
docker service create --name webserver --replicas 1 nginx   



If you remove a service, it will stop the docker container
systemctl stop docker

docker ps - will show the running containers

docker service ps webserver


#### Scaling a swarm service

Scaling Up Operation
docker service scale webserver=5
Scaling Down Operation
docker service scale webserver=1
Verify Service Details:
docker service ps webserver
Remove Service After Practical:
docker service rm webserver

#### Multiple approaches for scaling

Two Approaches:
docker service scale service01=1
docker service update --replicas 1 service02
Scaling Multiple Services Together:
docker service scale service01=3 service02=3


Replicated VS a global service
```
docker service create --name antivirus --mode global -dt ubuntu
```

A global service is a service that runs one task on every node. Each time you add a node to the swarm, the orchestrator creates a task and the scheduler assigns the task to the new node. log monitoring intrusion detection, etc

Draining the swarm node

When a node has been drained, the status goes from active to drain


Change the Node Availability to Drain
```
docker node update --availability drain swarm03
```
Verify Node status
```
docker node ls
```
Change the Node Availability To Active
```
docker node update --availability active swarm03
```

### Docker Inspect
Docker Inspect provides detailed information about the Docker Objects (Containers, Network, Volumes, Swarm Services and Swarm Nodes)

#### Inspect Services
```
docker service ps [Service Name]
```

```
docker service inspect [Service name] --pretty
```

#### Inspect Nodes
```
docker node inspect [Node ID] --pretty
```

```
docker service create --name mywebserver --replicas 2 [Image Name]
```
#### Verify ports on Linux server
netstat -nltp

docker ps


#### Create a new service and specify the port mapping
docker service create --name mywebserver --replicas 2 --publish 8080:80 nginx

docker service ps mywebserver

Verify that the container is accessible on the external port
```
ifconfig eth0,
```
copy the inet (external) ip address,
```
curl [external IP]:[port]
```


### Deploying a multi-service application in Swarm (Docker Stack)


The docker stack command can be used to manage a multi-service application. A stack is a group of interrelated services that share dependencies, and can be orchestrated and scaled together. A stack can compose YAML file like the one that we define during Docker Compose.


docker-compose.yml
```
version: '3'
services:
  webserver:
    image: nginx
    ports:
       - "8080:80"
  database:
    image: redis
```

Deploy Stack:
```
docker stack deploy --compose-file docker-compose.yml mydemo
```
Remove Stack
```
docker stack rm mydemo
```

### Locking a Docker Swarm Cluster

To lock an existing Swarm:
docker swarm update --autolock=true

To unlock a locked Swarm:
```
docker swarm --unlock=[swarm unlock key]
```

To retrieve the Swarm key from an unlocked swarm:
```
docker swarm unlock-key
```

To rotate the Swarm key:
```
docker swarm unlock-key --rotate
```

Example
```
docker swarm update --autolock=true
systemctl restart docker
docker node ls
docker swarm unlock
```

### How to troubleshoot a Swarm service nodes that is in the pending state?

If you do:
```
docker service ps
```

and you see that one or more nodes have a current state of pending, you can inspect the containers to check the container Status to check the error message to understand why it is in the pending state.

If the docker service create command was used to create the service, then you can check it for any contstraints. If a YAML file was used, ,you can check the YAML file for any constraints.

### Mount Volumes with Swarm

Create a service with a volume:
```
docker service create --name myservice --mount type=volume,source=myvolume,target=/mypath nginx
```

Verify the Host where service is created:
```
docker service ps myservice
```
Verify Volume Information
```
docker volume ls
```

To remove a service:
```
docker service rm myservice
```

Service Placement Constraints
Swarm services provide a few different ways for you to control scale and placement of services on different nodes:

- Replicated and global services,
- Resource Constraints [CPU and memory],
- Placement constraints (based on labels),
- Placement preferences


### Creating Service with Node Label Constraints

How to view a node label?

Get the node ID and copy it
docker node ls

Inspect that node in order to view the label
```
docker inspect [node ID]
```

Create a service and assign a label constraint:
Example constraint
The Service should only run on nodes with a container label of Canada.
```
docker service create --name myconstraint --constraint node.labels.region==Canada--replicas 3 nginx
```

Change an existing node to a label that matches the contstraint:
```
docker node update --label-add region=canada swarm03
```


You can verify to see that the Swarm has created containers only running on the Swarm node which has the label Canada:
```
docker service ps myService
```
If you add the label to another node, you will see that containers will also run there.

###  Overlay networks

The overlay network driver creates a distributed network with multiple Docker daemon hosts.

Containers in the overlay network can communicate securely between containers. Bridge and Host networks don't allow for this.

docker network ls will allow you to see local networks.

#### Creating an overlay network

Create Service with Custom Overlay Network:
```
docker service create --name myoverlay --network mynetwork --replicas 3 nginx
```
Verify Networks:
```
docker network ls
```
Find the IP of Container
```
docker container inspect [CONTAINER-NAME]
```
Connect to Container, Install Ping and ping container IP
```
docker container exec -it [CONTAINER-NAME]
apt-get update && apt-get install iputils-ping
ping [IP]
```

#### Secure communication between containers on an overlay network
Communication between containers in an overlay network are not secure by default.

The network must be setup for secure communication.

Example
```
docker network create --opt encrypted  --driver overlay my-overlay-secure-network
```

Note

- When overlay network encryption is enabled, Docker creates IPSEC tunnels between all the nodes.
- The tunnels use AES encryption in GCM mode. Manager nodes automatically rotate the keys every 12 hours.
- Overlay encryption is not supported in Windows. If a windows node attemps to connect to an encrypted overlay network, the node will not be able to communicate.


### Creating Services using Templates

```
docker service create --name demoservice --hostname="{{.Node.Hostname}}-{{.Service.Name}}" nginx
```

Valid Plaholders for templates:

| Placeholder     |
| -----------     |
| .Service.ID     | 
| .Service.Name   | 
| .Service.Labels | 
| .Node.ID        | 
| .Node.Hostname  | 
| .Task.ID        | 
| .Task.Name      | 
| .Task.Slot      | 

However, there are only three supported param flags, --hostname --mount --env

### Spit brain and importance of the quorum

Always have an odd number of nodes in a Swarm.

### High availability of Swarm Manager Nodes
Manager nodes are responsible for handling cluster management tasks

RAFT consensus group - Managers maintain an internal consistency of the internal state of the Swarm and all Services running within it.

An N manager cluster tolerates the loss of at most `(N-1)/2` managers.

Docker recommends a maximum of 7 manager nodes

#### Joining Swarm as a manager

docker swarm join-token manager

docker swarm join --token [THE TOKEN]

### Drain a node on the swarm

DRAIN availability prevents a node from receiving new tasks from the swarm manager. It also means the manager stops tasks running on the node and launches replica tasks on a node with ACTIVE availability.
```
docker node update --availability drain [NODE ID]
```

Forcing a new cluster

If you lose the quorum and need to force the new cluster:

1. Find the node's public IP address using `ifconfig eth0` - see inet address followed by the port
2. Perform the following command:
```
docker swarm init --force-new-cluster --advertise-addr 206.189.139.211:2377
```

### Docker system commands

| Command              | Description                          |
| -----------          | ----------- 
| docker system df     | Show Docker disk usage               |
| docker system events | Get real time events from the server |
| docker system info   | Display system-wide information      |
| docker system prune  | Remove unused data                   |