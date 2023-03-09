working examples of reactive spring boot application that combines 2 services output 
(say person info by personid and addresses of person by personid) 
finally response is person and its related addresses

```java
@RestController
public class PersonController {
 
    @Autowired
    private PersonService personService;
 
    @Autowired
    private AddressService addressService;
 
    @GetMapping("/person/{personId}")
    public Mono<Person> getPersonAndAddresses(@PathVariable("personId") Integer personId) {
        Mono<Person> personMono = personService.getPersonById(personId);
        Mono<List<Address>> addressMono = addressService.getAddressesByPersonId(personId);
 
        return Mono.zip(personMono, addressMono, (person, addresses) -> {
            person.setAddresses(addresses);
            return person;
        });
    }
}
```


combine 2nd service response, where 2 service fetch is sequential based on 1st service
later, finally respond back with  person and its related addresses

Here is an example of a reactive Spring Boot application that combines two services output, where the person service responds with a person and a list of address IDs, and the address service is used to collect the address info list by address ID. The API then responds back with the person info along with a list of addresses:

```java
@RestController
public class PersonController {
 
    @Autowired
    private PersonService personService;
 
    @Autowired
    private AddressService addressService;
 
    @GetMapping("/person/{personId}")
    public Mono<Person> getPersonAndAddresses(@PathVariable("personId") Integer personId) {
        Mono<Person> personMono = personService.getPersonById(personId);
        Mono<List<Integer>> addressIdsMono = personMono.map(Person::getAddressIds);
        Mono<List<Address>> addressMono = addressIdsMono.flatMapMany(ids -> addressService.getAddressesByIds(ids));
 
        return Mono.zip(personMono, addressMono, (person, addresses) -> {
            person.setAddresses(addresses);
            return person;
        });
    }
}
```
