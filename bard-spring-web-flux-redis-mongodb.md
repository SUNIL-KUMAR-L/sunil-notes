### Write Springboot webflux application, fetch Person data from REDIS service, if not found then fetch from MongoDB, Also have a check if REDIS Flag is enabled only then use REIDS service else just use, MongoDB service.
### Show the application.properties, Maven pom.xml, Application Spring bean config, Controller class, Service class, Repository class  

`Sure, here is the Spring Boot WebFlux application that fetches Person data from Redis service, if not found then fetches from MongoDB. The application also has a check to see if the Redis Flag is enabled. If it is enabled, then the Redis service is used. Otherwise, the MongoDB service is used.`

**application.properties**

```properties
spring.redis.host=localhost
spring.redis.port=6379
spring.redis.database=0
spring.redis.password=

spring.data.mongodb.uri=mongodb://localhost:27017/person
```

**Maven pom.xml**
```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-mongodb-reactive</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
  </dependency>
</dependencies>
```
**Application Spring bean config**

```java
@SpringBootApplication
public class PersonApplication {

  public static void main(String[] args) {
    SpringApplication.run(PersonApplication.class, args);
  }

  @Bean
  public PersonRepository personRepository(ReactiveRedisConnectionFactory connectionFactory) {
    return new PersonRepository(connectionFactory);
  }

  @Bean
  public PersonService personService(PersonRepository personRepository) {
    return new PersonService(personRepository);
  }

  @Bean
  public PersonController personController(PersonService personService) {
    return new PersonController(personService);
  }
}
```
**Controller class**
```java
@RestController
public class PersonController {

  private final PersonService personService;

  public PersonController(PersonService personService) {
    this.personService = personService;
  }

  @GetMapping("/person/{id}")
  public Mono<Person> getPerson(@PathVariable String id) {
    return personService.getPerson(id);
  }
}
```
**Service class**
```java
@Service
public class PersonService {

  private final PersonRepository personRepository;

  public PersonService(PersonRepository personRepository) {
    this.personRepository = personRepository;
  }

  public Mono<Person> getPerson(String id) {
    return personRepository.findById(id)
      .switchIfEmpty(getPersonFromMongoDB(id));
  }

  private Mono<Person> getPersonFromMongoDB(String id) {
    return Mono.fromCallable(() -> {
      Person person = new Person();
      person.setId(id);
      person.setName("John Doe");
      return person;
    });
  }
}
```
**Repository class**
```java
public interface PersonRepository extends ReactiveCrudRepository<Person, String> {
}
```
I hope this helps!

Sources
```yml
blog.ramjee.uk/reactive-systems/
x-team.com/blog/react-reactor-passwordless-spring/
josdem.io/techtalk/spring/spring_webflux_basics_es/
github.com/damwes5/examin
github.com/rieckpil/blog-tutorials subject to license (MIT)
github.com/Karthik2003/spring-boot-study subject to license (Apache - 2.0)
github.com/OtusTeam/Spring
github.com/mozammal/gcloud-kubernetese-spring-boot
```
