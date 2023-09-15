## SPRING  BOOT REACTIVE APPLICATION 

 Here's an example project structure for a reactive Spring Boot web application that connects to two services in parallel and collects their data to produce a final output. I'll also provide a Maven `pom.xml` file with the necessary dependencies.

Project Structure:
```
└── src
    └── main
        ├── java
        │   └── com
        │       └── example
        │           └── demo
        │               ├── DemoApplication.java
        │               ├── controller
        │               │   └── PersonController.java
        │               ├── model
        │               │   ├── Person.java
        │               │   ├── PersonAddress.java
        │               │   └── PersonInfo.java
        │               ├── service
        │               │   ├── PersonAddressService.java
        │               │   └── PersonInfoService.java
        │               └── util
        │                   └── ResponseTimeLogger.java
        └── resources
            └── application.properties
```

Maven `pom.xml`:
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <properties>
        <java.version>11</java.version>
        <spring-boot.version>2.5.4</spring-boot.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
        </dependency>

        <!-- Spring Boot Actuator (for health check and metrics) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- Lombok (for reducing boilerplate code) -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Maven Compiler Plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>${java.version}</source>
                    <target>${java.version}</target>
                    <encoding>UTF-8</encoding>
                </configuration>
            </plugin>

            <!-- Spring Boot Maven Plugin -->
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
            </plugin>
        </plugins>
    </build>
</project>
```

Explanation of the project structure:
- The main class `DemoApplication` is the entry point of the Spring Boot application.
- The `controller` package contains the `PersonController` class, which defines the REST API endpoints.
- The `model` package contains the data models: `Person`, `PersonAddress`, and `PersonInfo`.
- The `service` package contains the `PersonInfoService` and `PersonAddressService` classes, which handle the integration with the respective services.
- The `util` package contains the `ResponseTimeLogger` class, which can be used to log the response time of different components.
- The `resources` folder includes the `application.properties` file for configuring application-specific properties.

To introduce application loggers to capture the total response time, you can use a logging framework like Log4j2 or SLF4J along with appropriate log appenders and formatters. Here's an example `log4j2.xml` configuration file that includes loggers for different components:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="INFO">
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>
        </Console>
    </Appenders>
    <Loggers>
        <Logger name="com.example.demo.controller" level="INFO"/>
        <Logger name="com.example.demo.service" level="INFO"/>
        <Logger name="com.example.demo.util.ResponseTimeLogger" level="INFO"/>
        <Root level="INFO">
            <AppenderRef ref="Console"/>
        </Root>
    </Loggers>
</Configuration>
```

This configuration sets the log level to `INFO` for the `PersonController`, `PersonInfoService`, and `PersonAddressService` components, as well as the `ResponseTimeLogger`. You can modify the log level as per your requirements.

Remember to include the necessary logging dependencies in your `pom.xml` file and place the `log4j2.xml` configuration file in the `resources` folder.

Feel free to customize the code and configuration files according to your specific requirements. 

Here's the implementation of the Java classes for the reactive Spring Boot web application:

1. `DemoApplication.java` (Main class):
```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

2. `PersonController.java` (REST API Controller):
```java
package com.example.demo.controller;

import com.example.demo.model.Person;
import com.example.demo.model.PersonAddress;
import com.example.demo.model.PersonInfo;
import com.example.demo.service.PersonAddressService;
import com.example.demo.service.PersonInfoService;
import com.example.demo.util.ResponseTimeLogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
public class PersonController {
    private final PersonInfoService personInfoService;
    private final PersonAddressService personAddressService;

    @Autowired
    public PersonController(PersonInfoService personInfoService, PersonAddressService personAddressService) {
        this.personInfoService = personInfoService;
        this.personAddressService = personAddressService;
    }

    @GetMapping("/person/{personId}")
    public Mono<Person> getPersonDetails(@PathVariable String personId) {
        return Mono.zip(
                personInfoService.getPersonInfo(personId).log("PersonInfoService"),
                personAddressService.getPersonAddress(personId).log("PersonAddressService")
            )
            .map(tuple -> {
                PersonInfo personInfo = tuple.getT1();
                PersonAddress personAddress = tuple.getT2();
                return new Person(personInfo, personAddress);
            })
            .doOnSuccess(person -> ResponseTimeLogger.log("Total response time: "));
    }
}
```

3. `Person.java` (Model class):
```java
package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Person {
    private PersonInfo personInfo;
    private PersonAddress personAddress;
}
```

4. `PersonInfo.java` (Model class):
```java
package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PersonInfo {
    private String name;
    private int age;
    // other fields
}
```

5. `PersonAddress.java` (Model class):
```java
package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PersonAddress {
    private String street;
    private String city;
    // other fields
}
```

6. `PersonInfoService.java` (Service class):
```java
package com.example.demo.service;

import com.example.demo.model.PersonInfo;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PersonInfoService {
    public Mono<PersonInfo> getPersonInfo(String personId) {
        // Implementation to fetch person info from a service
        // Replace with your actual logic or service call
        return Mono.just(new PersonInfo("John Doe", 30));
    }
}
```

7. `PersonAddressService.java` (Service class):
```java
package com.example.demo.service;

import com.example.demo.model.PersonAddress;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PersonAddressService {
    public Mono<PersonAddress> getPersonAddress(String personId) {
        // Implementation to fetch person address from a service
        // Replace with your actual logic or service call
        return Mono.just(new PersonAddress("123 Main St", "City"));
    }
}
```

8. `ResponseTimeLogger.java` (Utility class for logging response time):
```java
package com.example.demo.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ResponseTimeLogger {
    private static final Logger logger = LoggerFactory.getLogger(ResponseTimeLogger.class);

    public static void log(String message) {
        long responseTime = calculateResponseTime();
        logger.info("{}{} ms", message, responseTime);
    }

    private static long calculateResponseTime() {
        // Calculate the response time
        // Replace with your actual logic to measure response time
        return System.currentTimeMillis(); // Placeholder value
    }
}
```

Remember to configure your application properties (`application.properties`) as per your requirements, including the server port and any other necessary configurations.

Make sure to include the required dependencies in your Maven `pom.xml` file, including `spring-boot-starter-webflux`, `spring-boot-starter-actuator`, and `lombok` (for reducing boilerplate code). Also, include any additional dependencies required by your specific services.

Feel free to modify the code and add any necessary error handling or additional functionality based on your specific use case.

To capture the time taken to integrate with the `PersonInfo` and `PersonAddress` services, you can modify the `PersonInfoService` and `PersonAddressService` classes to measure the elapsed time. Here's an updated implementation:

1. `PersonInfoService.java` (Updated):
```java
package com.example.demo.service;

import com.example.demo.model.PersonInfo;
import com.example.demo.util.ResponseTimeLogger;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PersonInfoService {
    public Mono<PersonInfo> getPersonInfo(String personId) {
        long startTime = System.currentTimeMillis();

        // Implementation to fetch person info from a service
        // Replace with your actual logic or service call
        Mono<PersonInfo> personInfoMono = Mono.just(new PersonInfo("John Doe", 30));

        return personInfoMono.doOnSuccess(personInfo -> {
            long elapsedTime = System.currentTimeMillis() - startTime;
            ResponseTimeLogger.log("PersonInfo integration time: ", elapsedTime);
        });
    }
}
```

2. `PersonAddressService.java` (Updated):
```java
package com.example.demo.service;

import com.example.demo.model.PersonAddress;
import com.example.demo.util.ResponseTimeLogger;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PersonAddressService {
    public Mono<PersonAddress> getPersonAddress(String personId) {
        long startTime = System.currentTimeMillis();

        // Implementation to fetch person address from a service
        // Replace with your actual logic or service call
        Mono<PersonAddress> personAddressMono = Mono.just(new PersonAddress("123 Main St", "City"));

        return personAddressMono.doOnSuccess(personAddress -> {
            long elapsedTime = System.currentTimeMillis() - startTime;
            ResponseTimeLogger.log("PersonAddress integration time: ", elapsedTime);
        });
    }
}
```

3. `ResponseTimeLogger.java` (Updated):
```java
package com.example.demo.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ResponseTimeLogger {
    private static final Logger logger = LoggerFactory.getLogger(ResponseTimeLogger.class);

    public static void log(String message, long elapsedTime) {
        logger.info("{}{} ms", message, elapsedTime);
    }
}
```

In the updated code:
- We introduce a `startTime` variable in both the `PersonInfoService` and `PersonAddressService` classes to capture the current time before making the service calls.
- After the service calls are completed, we calculate the elapsed time by subtracting the `startTime` from the current time.
- The `ResponseTimeLogger` class is modified to accept the additional `elapsedTime` parameter and log the integration time along with the provided message.

By logging the integration time in these classes, you will be able to capture the total time taken to integrate with the `PersonInfo` and `PersonAddress` services separately.

Feel free to adjust the logging format or add more detailed information as per your requirements.


**Implement a sequencial flow** say modify the application to call the `PersonInfo` service first, retrieve the address IDs, and then call the `PersonAddress` service based on those address IDs, you can make the following changes:

1. `PersonController.java`:
```java
@RestController
public class PersonController {
    private final PersonInfoService personInfoService;
    private final PersonAddressService personAddressService;

    // ...

    @GetMapping("/person/{personId}")
    public Mono<Person> getPersonDetails(@PathVariable String personId) {
        return personInfoService.getPersonInfo(personId)
                .flatMap(personInfo -> personAddressService.getPersonAddresses(personInfo.getAddressIds())
                        .map(personAddresses -> new Person(personInfo, personAddresses)))
                .doOnSuccess(person -> ResponseTimeLogger.log("Total response time: "));
    }
}
```

2. `PersonInfo.java` (Updated with `addressIds` field):
```java
@Data
@AllArgsConstructor
public class PersonInfo {
    private String name;
    private int age;
    private List<String> addressIds;
}
```

3. `PersonInfoService.java` (Updated with new method `getPersonAddresses`):
```java
@Service
public class PersonInfoService {
    private final PersonAddressService personAddressService;

    @Autowired
    public PersonInfoService(PersonAddressService personAddressService) {
        this.personAddressService = personAddressService;
    }

    public Mono<PersonInfo> getPersonInfo(String personId) {
        // Implementation to fetch person info from a service
        // Replace with your actual logic or service call
        return Mono.just(new PersonInfo("John Doe", 30, Arrays.asList("addressId1", "addressId2")));
    }

    public Mono<List<PersonAddress>> getPersonAddresses(List<String> addressIds) {
        return Flux.fromIterable(addressIds)
                .flatMap(personAddressService::getPersonAddress)
                .collectList();
    }
}
```

4. `PersonAddressService.java` (Updated with new method `getPersonAddress`):
```java
@Service
public class PersonAddressService {
    public Mono<PersonAddress> getPersonAddress(String addressId) {
        // Implementation to fetch person address from a service
        // Replace with your actual logic or service call
        return Mono.just(new PersonAddress(addressId + " Street", addressId + " City"));
    }
}
```

In the updated code:
- The `PersonInfo` class now includes a new field called `addressIds`, which represents the list of address IDs associated with the person.
- The `PersonInfoService` class is updated with a new method called `getPersonAddresses`, which takes in a list of address IDs and calls the `getPersonAddress` method from the `PersonAddressService` class for each address ID using `Flux`.
- In the `PersonController`, the `getPersonDetails` method is modified to call `personInfoService.getPersonInfo(personId)` to get the person information.
- Then, `flatMap` is used to call `personAddressService.getPersonAddresses(personInfo.getAddressIds())` using the retrieved address IDs.
- Finally, the `Person` object is constructed using the `PersonInfo` and `PersonAddress` data, and the response time is logged.

With these changes, the application will call the `PersonInfo` service first, retrieve the address IDs, and then call the `PersonAddress` service for each address ID. The final response will contain the combined data from both services.

Please note that this is a simplified example, and you may need to adapt the code to fit your specific use case and replace the placeholder implementation with your actual logic or service calls.

### non reactive spting boot web application

To build the same application as a non-reactive Spring Boot application, you can use traditional servlet-based programming. Here's the modified code and `pom.xml` file:

1. `PersonController.java`:
```java
@RestController
public class PersonController {
    private final PersonInfoService personInfoService;
    private final PersonAddressService personAddressService;

    // ...

    @GetMapping("/person/{personId}")
    public Person getPersonDetails(@PathVariable String personId) {
        PersonInfo personInfo = personInfoService.getPersonInfo(personId);
        List<PersonAddress> personAddresses = personAddressService.getPersonAddresses(personInfo.getAddressIds());
        return new Person(personInfo, personAddresses);
    }
}
```

2. `PersonInfoService.java`:
```java
@Service
public class PersonInfoService {
    private final PersonAddressService personAddressService;

    @Autowired
    public PersonInfoService(PersonAddressService personAddressService) {
        this.personAddressService = personAddressService;
    }

    public PersonInfo getPersonInfo(String personId) {
        // Implementation to fetch person info from a service
        // Replace with your actual logic or service call
        return new PersonInfo("John Doe", 30, Arrays.asList("addressId1", "addressId2"));
    }

    public List<PersonAddress> getPersonAddresses(List<String> addressIds) {
        List<PersonAddress> personAddresses = new ArrayList<>();
        for (String addressId : addressIds) {
            PersonAddress personAddress = personAddressService.getPersonAddress(addressId);
            personAddresses.add(personAddress);
        }
        return personAddresses;
    }
}
```

3. `PersonAddressService.java`:
```java
@Service
public class PersonAddressService {
    public PersonAddress getPersonAddress(String addressId) {
        // Implementation to fetch person address from a service
        // Replace with your actual logic or service call
        return new PersonAddress(addressId + " Street", addressId + " City");
    }
}
```

4. `Person.java`:
```java
@Data
@AllArgsConstructor
public class Person {
    private PersonInfo personInfo;
    private List<PersonAddress> personAddresses;
}
```

5. `pom.xml` (dependencies):
```xml
<!-- Add Spring Web MVC dependency -->
<dependencies>
    <!-- Other dependencies... -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

With these changes, you can build a non-reactive Spring Boot application where the `PersonController` retrieves the person information from the `PersonInfoService`, gets the list of address IDs, and then calls the `PersonAddressService` to fetch the person addresses. The final response is wrapped in the `Person` object.

Make sure to include the necessary dependencies in the `pom.xml` file, such as `spring-boot-starter-web`, to enable Spring Web MVC.

Please note that this non-reactive implementation uses synchronous blocking calls, which may impact performance in high-concurrency scenarios. If you require a reactive, non-blocking approach, consider using Spring WebFlux and reactive libraries.






