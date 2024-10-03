# Json to Java convertor utility ( Json2JavaConvertor Utility)

site to try out : [JSON2JAVA convertor] (https://sites.google.com/view/json2java/home)

## Input JSON (Pretty JSON):
```JSON
{
  "name": "aaa",
  "age": 33,
  "city": "New york",
  "state": "NY",
  "country": "USA",
  "address": {
    "addr_1": "aaa",
    "zip_code": 33
  }
}
```
## Java Project Structure:
```
json-to-java-converter/
│
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           ├── Example.java
│       │           └── ExampleUsage.java
│       └── resources/
│           └── (any resources if needed)
│
├── pom.xml
└── README.md
```

## pom.xml:
```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>json-to-java-converter</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.8.9</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```
    
## Generated Java Classes:
```java
import com.google.gson.Gson;

class Example {
    private String name;
    private int age;
    private String city;
    private String state;
    private String country;
import com.google.gson.Gson;

class Address {
    private String addr_1;
    private int zip_code;

    // Getters and Setters
    public String getAddr_1() { return addr_1; }
    public void setAddr_1(String addr_1) { this.addr_1 = addr_1; }
    public int getZip_code() { return zip_code; }
    public void setZip_code(int zip_code) { this.zip_code = zip_code; }
}

    private Address address;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public Object getAddress() { return address; }
    public void setAddress(Object address) { this.address = address; }
}
```


## Output Sample Example:
```java
import com.google.gson.Gson;

public class ExampleUsage {
    public static void main(String[] args) {
        Example example = new Example();
        example.setName("aaa");
        example.setAge(33);
        example.setCity("New york");
        example.setState("NY");
        example.setCountry("USA");
        Address nestedAddress = new Address();
        nestedAddress.setAddr_1("aaa");
        nestedAddress.setZip_code(33);
        example.setAddress(nestedAddress);
        String jsonString = new Gson().toJson(example);
        System.out.println(jsonString); // Output: {"name":"aaa","age":33,"city":"New york","state":"NY","country":"USA","address":{"addr_1":"aaa","zip_code":33}}
    }
}
```
