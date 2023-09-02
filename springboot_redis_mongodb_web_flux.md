### build a Spingboot  Reactive webflux controller project where given a  personId as Input Person, fetch Person data from REDIS CACHE, if not found in REDIS then go to MongoDB.

#### Show me the Project structure, Maven Pom.xml, Java code 

```
Certainly! Here's an example of a Spring Boot Reactive WebFlux project with a controller that fetches person data from Redis cache and falls back to MongoDB if the data is not found in Redis.
```

**Project Structure:**
```
person-api/
├─ pom.xml
└─ src/
   ├─ main/
   │  ├─ java/
   │  │  └─ com/
   │  │     └─ example/
   │  │        ├─ controller/
   │  │        │  └─ PersonController.java
   │  │        ├─ model/
   │  │        │  └─ Person.java
   │  │        ├─ repository/
   │  │        │  ├─ PersonRepository.java
   │  │        │  └─ RedisPersonRepository.java
   │  │        └─ service/
   │  │           └─ PersonService.java
   │  └─ resources/
   │     └─ application.properties
   └─ test/
      └─ java/
         └─ com/
            └─ example/
               └─ controller/
                  └─ PersonControllerTest.java
```

**pom.xml:**

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>person-api</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>11</java.version>
        <spring-boot.version>2.5.4</spring-boot.version>
        <spring-boot-starter-data-mongodb-reactive.version>2.5.4</spring-boot-starter-data-mongodb-reactive.version>
        <spring-boot-starter-data-redis-reactive.version>2.5.4</spring-boot-starter-data-redis-reactive.version>
    </properties>

    <dependencies>
        <!-- Spring Boot WebFlux -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
            <version>${spring-boot.version}</version>
        </dependency>
        
        <!-- Spring Boot Data MongoDB Reactive -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb-reactive</artifactId>
            <version>${spring-boot-starter-data-mongodb-reactive.version}</version>
        </dependency>
        
        <!-- Spring Boot Data Redis Reactive -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
            <version>${spring-boot-starter-data-redis-reactive.version}</version>
        </dependency>
        
        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <version>${spring-boot.version}</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
            </plugin>
        </plugins>
    </build>
</project>
```

**Person.java:**

```java
package com.example.model;

public class Person {
    private String id;
    private String name;
    // Other fields, getters, and setters
}
```

**PersonRepository.java:**

```java
package com.example.repository;

import com.example.model.Person;
import reactor.core.publisher.Mono;

public interface PersonRepository {
    Mono<Person> findById(String id);
}
```

**RedisPersonRepository.java:**

```java
package com.example.repository;

import com.example.model.Person;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public class RedisPersonRepository implements PersonRepository {
    private final ReactiveRedisTemplate<String, Person> redisTemplate;

    public RedisPersonRepository(ReactiveRedisTemplate<String, Person> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Mono<Person> findById(String id) {
        return redisTemplate.opsForValue().get(id);
    }
}
```

**MongoPersonRepository.java:**
```java
package com.example.repository;

import com.example.model.Person;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public class MongoPersonRepository implements PersonRepository {
    private final ReactiveMongoTemplate mongoTemplate;

    public MongoPersonRepository(ReactiveMongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Mono<Person> findById(String id) {
        return mongoTemplate.findById(id, Person.class);
    }
}
```

**RepositoryConfig**

```java
package com.example.config;

import com.example.repository.PersonRepository;
import com.example.repository.RedisPersonRepository;
import com.example.repository.MongoPersonRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.data.redis.core.ReactiveRedisTemplate;

@Configuration
public class RepositoryConfig {
    
    @Bean("redisPersonRepository")
    public PersonRepository redisPersonRepository(ReactiveRedisTemplate<String, Person> redisTemplate) {
        return new RedisPersonRepository(redisTemplate);
    }
    
    @Bean("mongoPersonRepository")
    public PersonRepository mongoPersonRepository(ReactiveMongoTemplate mongoTemplate) {
        return new MongoPersonRepository(mongoTemplate);
    }
    
    // Other bean definitions and configurations...
}
```

```
In the above code, the RepositoryConfig class is annotated with @Configuration to indicate that it contains bean definitions. The redisPersonRepository bean is defined with the ID "redisPersonRepository" using the @Bean annotation, and it references the RedisPersonRepository class, taking a ReactiveRedisTemplate as a parameter. Similarly, the mongoPersonRepository bean is defined with the ID "mongoPersonRepository" and references the MongoPersonRepository class, taking a ReactiveMongoTemplate as a parameter.

Make sure to replace the ReactiveRedisTemplate and ReactiveMongoTemplate types with the appropriate classes based on your Redis and MongoDB configurations.

Remember to include this configuration class in your application context so that the beans are created and available for injection in the PersonService class.
```

```
To specify the bean IDs for the Redis and Mongo repositories in the PersonService class, you can use the @Qualifier annotation along with the corresponding bean IDs. Here's an example:
```

**PersonService.java:**

```java
package com.example.service;

import com.example.model.Person;
import com.example.repository.PersonRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PersonService {
    private final PersonRepository redisPersonRepository;
    private final PersonRepository mongoPersonRepository;
    private final Logger logger = LoggerFactory.getLogger(PersonService.class);

    public PersonService(@Qualifier("redisPersonRepository") PersonRepository redisPersonRepository,
                         @Qualifier("mongoPersonRepository") PersonRepository mongoPersonRepository) {
        this.redisPersonRepository = redisPersonRepository;
        this.mongoPersonRepository = mongoPersonRepository;
    }

    /*
    public Mono<Person> getPersonById(String id) {
        return redisPersonRepository.findById(id)
                .switchIfEmpty(fetchFromMongo(id))
                .doOnNext(person -> logger.info("Person found in Redis cache."))
                .doOnNext(person -> logger.info("Person fetched from MongoDB."))
                .switchIfEmpty(Mono.error(new RuntimeException("Person not found")));
    }
    */

    public Mono<Person> getPersonById(String id) {
        return redisPersonRepository.findById(id)
                .flatMap(person -> {
                    logger.info("Person found in Redis cache.");
                    return Mono.just(person);
                })
                .switchIfEmpty(fetchFromMongo(id)
                        .doOnNext(person -> logger.info("Person fetched from MongoDB.")))
                .switchIfEmpty(Mono.error(new RuntimeException("Person not found")));
    }

    private Mono<Person> fetchFromMongo(String id) {
        return mongoPersonRepository.findById(id);
    }
}
```

```
In the PersonService constructor, the @Qualifier annotation is used to specify the bean IDs for the Redis and Mongo repositories. The redisPersonRepository parameter is annotated with @Qualifier("redisPersonRepository"), indicating that it should be injected with the bean having the ID "redisPersonRepository". Similarly, the mongoPersonRepository parameter is annotated with @Qualifier("mongoPersonRepository"), indicating that it should be injected with the bean having the ID "mongoPersonRepository".

By using the @Qualifier annotation, you can differentiate between multiple beans of the same type and explicitly specify which bean should be injected into the PersonService.

Make sure the bean IDs specified in the @Qualifier annotations match the IDs you defined for the Redis and Mongo repositories in your configuration.
```

```
In the updated code, the flatMap operator is used after retrieving the person data from Redis. If the person data is found in Redis, it logs the message "Person found in Redis cache" and continues the flow by emitting the person data downstream.

If the person data is not found in Redis, the switchIfEmpty operator is triggered, and the control flows to the next alternative, which is fetching the person data from MongoDB. In this case, the doOnNext operator will log the message "Person fetched from MongoDB" when the person data is received from MongoDB.

By rearranging the operators, you can ensure that the appropriate log messages are printed based on whether the data is found in Redis or fetched from MongoDB.
```


**PersonController.java:**
```java
package com.example.controller;

import com.example.model.Person;
import com.example.service.PersonService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class PersonController {
    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping("/persons/{personId}")
    public Mono<Person> getPersonById(@PathVariable String personId) {
        return personService.getPersonById(personId);
    }
}
```

**application.properties:**
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/my-database
spring.data.redis.host=localhost
spring.data.redis.port=6379
```

**PersonControllerTest.java:**
```java
package com.example.controller;

import com.example.model.Person;
import com.example.service.PersonService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.autoconfigure.web.reactive.WebFluxTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

@WebFluxTest(PersonController.class)
public class PersonControllerTest {
    @MockBean
    private PersonService personService;

    @Test
    public void testGetPersonById() {
        String personId = "123";
        Person person = new Person();
        person.setId(personId);
        person.setName("John Doe");

        Mockito.when(personService.getPersonById(personId)).thenReturn(Mono.just(person));

        WebTestClient
                .bindToController(new PersonController(personService))
                .build()
                .get()
                .uri("/persons/{personId}", personId)
                .exchange()
                .expectStatus().isOk()
                .expectBody(Person.class)
                .isEqualTo(person);
    }
}
```

```
In this project, we have a simple Spring Boot Reactive WebFlux application. The Person class represents the model for a person. The PersonRepository interface defines the contract for fetching person data, and the RedisPersonRepository implements the repository using Redis as the cache. The PersonService class handles the business logic and interacts with the repository. The PersonController class is the REST API controller that exposes an endpoint to retrieve a person by ID. The application.properties file contains the configuration for MongoDB and Redis.

The PersonControllerTest class demonstrates how to write a test for the PersonController using Mockito and WebTestClient.

Please note that the provided code snippets are for illustrative purposes, and you may need to adjust them according to your specific project
```
