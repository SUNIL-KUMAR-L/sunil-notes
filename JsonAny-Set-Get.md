## JsonAnySetter and JsonAnyGetter

```java
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.databind.ObjectMapper;

public class JsonAnySetterGetterTest {


    private String name;
    private Integer age;
    private final Map<String, Object> keyValueMap = new HashMap<>();


    @JsonAnySetter
    public void add(final String key, final Object value) {
        keyValueMap.put(key, value);
    }

    @JsonAnyGetter
    public Map <String, Object> getKeyValueMap() {
        return keyValueMap;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    //@JsonIgnore
    public Integer getAge() {
        return age;
    }


    public void setAge(Integer age) {
        this.age = age;
    }

    public static void main(String[] args) throws IOException {

        String jsonString = """
                {
                "name" : "Json Setter Test",
                "Key1" : "Value-1",
                "Key2" : "value-2",
                "age" : 22
                }
                """;


        // convert jsonString to object
        ObjectMapper mapper = new ObjectMapper();
        JsonAnySetterGetterTest jsonObject = mapper.readValue(jsonString, JsonAnySetterGetterTest.class);
        System.out.println("JsonAnySetterGetterTest : "+jsonObject);


        // convert object to json
        String result = new ObjectMapper().writeValueAsString(jsonObject);
        System.out.println("convert JsonAnySetterGetterTest object to json String : " + result);
        
    }

    @Override
    public String toString() {
        return "JsonAnySetterGetterTest{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", keyValueMap=" + keyValueMap +
                '}';
    }
    
}
```

## output
```shell
JsonAnySetterGetterTest : JsonAnySetterGetterTest{name='Json Setter Test', age=22, keyValueMap={Key2=value-2, Key1=Value-1}}
convert JsonAnySetterGetterTest object to json String : {"name":"Json Setter Test","age":22,"Key2":"value-2","Key1":"Value-1"}
```
