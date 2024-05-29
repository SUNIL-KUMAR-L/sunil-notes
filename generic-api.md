generic CRUD service in Spring Boot. Here's a basic example:

1. Generic Repository:

```java
package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface GenericRepository<T, ID> extends JpaRepository<T, ID> {
}
```

2. Generic Service:

```java
package com.example.demo.service;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public abstract class GenericService<T, ID> {

    private final JpaRepository<T, ID> repository;

    protected GenericService(JpaRepository<T, ID> repository) {
        this.repository = repository;
    }

    public List<T> findAll() {
        return repository.findAll();
    }

    public T findById(ID id) {
        return repository.findById(id).orElse(null);
    }

    public T save(T entity) {
        return repository.save(entity);
    }

    public void deleteById(ID id) {
        repository.deleteById(id);
    }
}
```

3. Generic Controller:

```java
package com.example.demo.controller;

import com.example.demo.service.GenericService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public abstract class GenericController<T, ID> {

    private final GenericService<T, ID> service;

    protected GenericController(GenericService<T, ID> service) {
        this.service = service;
    }

    @GetMapping
    public List<T> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public T getById(@PathVariable ID id) {
        return service.findById(id);
    }

    @PostMapping
    public T create(@RequestBody T entity) {
        return service.save(entity);
    }

    @PutMapping("/{id}")
    public T update(@PathVariable ID id, @RequestBody T entity) {
        // handle update logic
        return service.save(entity);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable ID id) {
        service.deleteById(id);
    }
}
```

Now, you can extend these generic classes to create specific services and controllers for your domain objects. For example:

```java
package com.example.demo.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class MyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    // other fields, getters and setters
}
```

```java
package com.example.demo.repository;

import com.example.demo.domain.MyEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface MyEntityRepository extends GenericRepository<MyEntity, Long> {
}
```

```java
package com.example.demo.service;

import com.example.demo.domain.MyEntity;
import com.example.demo.repository.MyEntityRepository;
import org.springframework.stereotype.Service;

@Service
public class MyEntityService extends GenericService<MyEntity, Long> {

    public MyEntityService(MyEntityRepository repository) {
        super(repository);
    }
}
```

```java
package com.example.demo.controller;

import com.example.demo.domain.MyEntity;
import com.example.demo.service.MyEntityService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/entities")
public class MyEntityController extends GenericController<MyEntity, Long> {

    public MyEntityController(MyEntityService service) {
        super(service);
    }
}
```

This is a very basic example and does not include error handling, validation, or other important aspects of a production-ready application. You would need to expand upon this to suit your specific needs.