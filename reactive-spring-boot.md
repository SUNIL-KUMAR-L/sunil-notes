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
