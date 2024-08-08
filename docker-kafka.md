# create docker compose file : docker-compose.yml
  ```yaml
  version: '3.1'

services:
  zookeeper:
    image: wurstmeister/zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"

  kafka:
    image: wurstmeister/kafka
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_ADVERTISED_HOST_NAME: localhost
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
  
  
  ```
run docker compose

```sh
# run docker compose file from the location where cmpose file is saved 
docker compose -f docker-compose.yml up -d

[+] Running 25/25
 ✔ zookeeper Pulled                                                                                               13.7s
   ✔ a3ed95caeb02 Pull complete                                                                                    0.9s
   ✔ ef38b711a50f Pull complete                                                                                    6.6s
   ✔ e057c74597c7 Pull complete                                                                                    6.6s
   ✔ 666c214f6385 Pull complete                                                                                    6.6s
   ✔ c3d6a96f1ffc Pull complete                                                                                    6.7s
   ✔ 3fe26a83e0ca Pull complete                                                                                    6.7s
   ✔ 3d3a7dd3a3b1 Pull complete                                                                                    9.4s
   ✔ f8cc938abe5f Pull complete                                                                                    9.5s
   ✔ 9978b75f7a58 Pull complete                                                                                    9.5s
   ✔ 4d4dbcc8f8cc Pull complete                                                                                    9.5s
   ✔ 8b130a9baa49 Pull complete                                                                                    9.7s
   ✔ 6b9611650a73 Pull complete                                                                                    9.7s
   ✔ 5df5aac51927 Pull complete                                                                                   10.3s
   ✔ 76eea4448d9b Pull complete                                                                                   10.4s
   ✔ 8b66990876c6 Pull complete                                                                                   10.4s
   ✔ f0dd38204b6f Pull complete                                                                                   10.4s
 ✔ kafka Pulled                                                                                                   21.0s
   ✔ 42c077c10790 Pull complete                                                                                   11.2s
   ✔ 44b062e78fd7 Pull complete                                                                                   11.3s
   ✔ b3ba9647f279 Pull complete                                                                                   11.4s
   ✔ 10c9a58bd495 Pull complete                                                                                   13.0s
   ✔ ed9bd501c190 Pull complete                                                                                   13.1s
   ✔ 03346d650161 Pull complete                                                                                   16.9s
   ✔ 539ec416bc55 Pull complete                                                                                   16.9s
[+] Running 3/3
 ✔ Network resources_default  Created                                                                              0.0s
 ✔ Container zookeeper        Started                                                                              1.0s
 ✔ Container kafka            Started                                                                              0.7s

# enter docker kafka container
docker exec -it kafka bin/sh
# cd /opt/kafka_2.13-2.8.1
# ls -lrt
total 48
-rw-r--r-- 1 root root   953 Sep 14  2021 NOTICE
-rw-r--r-- 1 root root 14520 Sep 14  2021 LICENSE
drwxr-xr-x 2 root root  4096 Sep 14  2021 licenses
drwxr-xr-x 3 root root  4096 Sep 14  2021 bin
drwxr-xr-x 2 root root  4096 Sep 14  2021 site-docs
drwxr-xr-x 2 root root  4096 May 28  2022 libs
drwxr-xr-x 1 root root  4096 Aug  8 14:35 config
drwxr-xr-x 2 root root  4096 Aug  8 14:35 logs
# cd bin
# ls -lrt
total 156
-rwxr-xr-x 1 root root  1019 Sep 14  2021 zookeeper-shell.sh
-rwxr-xr-x 1 root root  1366 Sep 14  2021 zookeeper-server-stop.sh
-rwxr-xr-x 1 root root  1393 Sep 14  2021 zookeeper-server-start.sh
-rwxr-xr-x 1 root root   867 Sep 14  2021 zookeeper-security-migration.sh
drwxr-xr-x 2 root root  4096 Sep 14  2021 windows
-rwxr-xr-x 1 root root  1714 Sep 14  2021 trogdor.sh
-rwxr-xr-x 1 root root   958 Sep 14  2021 kafka-verifiable-producer.sh
-rwxr-xr-x 1 root root   958 Sep 14  2021 kafka-verifiable-consumer.sh
-rwxr-xr-x 1 root root   863 Sep 14  2021 kafka-topics.sh
-rwxr-xr-x 1 root root   945 Sep 14  2021 kafka-streams-application-reset.sh
-rwxr-xr-x 1 root root   860 Sep 14  2021 kafka-storage.sh
-rwxr-xr-x 1 root root  1361 Sep 14  2021 kafka-server-stop.sh
-rwxr-xr-x 1 root root  1376 Sep 14  2021 kafka-server-start.sh
-rwxr-xr-x 1 root root 10329 Sep 14  2021 kafka-run-class.sh
-rwxr-xr-x 1 root root   874 Sep 14  2021 kafka-replica-verification.sh
-rwxr-xr-x 1 root root   874 Sep 14  2021 kafka-reassign-partitions.sh
-rwxr-xr-x 1 root root   959 Sep 14  2021 kafka-producer-perf-test.sh
-rwxr-xr-x 1 root root   886 Sep 14  2021 kafka-preferred-replica-election.sh
-rwxr-xr-x 1 root root   862 Sep 14  2021 kafka-mirror-maker.sh
-rwxr-xr-x 1 root root   873 Sep 14  2021 kafka-metadata-shell.sh
-rwxr-xr-x 1 root root   863 Sep 14  2021 kafka-log-dirs.sh
-rwxr-xr-x 1 root root   870 Sep 14  2021 kafka-leader-election.sh
-rwxr-xr-x 1 root root   863 Sep 14  2021 kafka-features.sh
-rwxr-xr-x 1 root root   866 Sep 14  2021 kafka-dump-log.sh
-rwxr-xr-x 1 root root   869 Sep 14  2021 kafka-delete-records.sh
-rwxr-xr-x 1 root root   871 Sep 14  2021 kafka-delegation-tokens.sh
-rwxr-xr-x 1 root root   948 Sep 14  2021 kafka-consumer-perf-test.sh
-rwxr-xr-x 1 root root   871 Sep 14  2021 kafka-consumer-groups.sh
-rwxr-xr-x 1 root root   944 Sep 14  2021 kafka-console-producer.sh
-rwxr-xr-x 1 root root   945 Sep 14  2021 kafka-console-consumer.sh
-rwxr-xr-x 1 root root   864 Sep 14  2021 kafka-configs.sh
-rwxr-xr-x 1 root root   860 Sep 14  2021 kafka-cluster.sh
-rwxr-xr-x 1 root root   873 Sep 14  2021 kafka-broker-api-versions.sh
-rwxr-xr-x 1 root root   861 Sep 14  2021 kafka-acls.sh
-rwxr-xr-x 1 root root  1420 Sep 14  2021 connect-standalone.sh
-rwxr-xr-x 1 root root  1396 Sep 14  2021 connect-mirror-maker.sh
-rwxr-xr-x 1 root root  1423 Sep 14  2021 connect-distributed.sh
```

# download kafka tool (Kafka gui) 

https://www.kafkatool.com/download.html

```
## create a kafka connection
bootstrap server : localhost:9092
test and connect

go to topics
create a new topic: quickstart

add messages to the topic

read messages from the same topic
```

