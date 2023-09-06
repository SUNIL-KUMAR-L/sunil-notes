If the configuration files are bundled within the JAR file and you want to read them from the classpath, 
you can modify the code to load the properties using `ClassLoader.getResourceAsStream()`. 
Here's an updated version of the code:

```java
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigLoader {

    public static void main(String[] args) {
        // Define the file names of the configuration files
        String[] fileNames = {"config1.properties", "config2.properties", "config3.properties"};

        // Load properties from all configuration files
        Properties allProperties = loadProperties(fileNames);

        // Print the content of all configuration files
        System.out.println("Content of configuration files:");
        allProperties.forEach((key, value) -> System.out.println(key + " = " + value));
    }

    private static Properties loadProperties(String[] fileNames) {
        Properties allProperties = new Properties();
        ClassLoader classLoader = ConfigLoader.class.getClassLoader();

        for (String fileName : fileNames) {
            try (InputStream inputStream = classLoader.getResourceAsStream(fileName)) {
                if (inputStream != null) {
                    Properties properties = new Properties();
                    properties.load(inputStream);
                    allProperties.putAll(properties);
                } else {
                    System.out.println("Unable to load properties from file: " + fileName);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return allProperties;
    }
}
```

In this updated code, we define an array `fileNames` that contains the names of the configuration files bundled within the JAR file. The `loadProperties` method is modified to load the properties using `ClassLoader.getResourceAsStream()`. It uses the `ClassLoader` of the `ConfigLoader` class to retrieve a `InputStream` for each file.

The method iterates over each file name, opens an `InputStream` using `getResourceAsStream()`, and loads the properties if the input stream is not null. The properties are then added to the `allProperties` object using the `putAll` method.

In the `main` method, we call the `loadProperties` method with the array of file names. The method returns a `Properties` object containing all the properties from the configuration files. We then print the content of all the configuration files by iterating over the properties and printing each key-value pair.

Ensure that the configuration files are bundled within the JAR file in the same directory as the `ConfigLoader.class` file.

# If you want to read all files under a `config` folder bundled within the JAR file, 

you can modify the code to search for files within that folder using `ClassLoader.getResources()`. Here's an updated version of the code:

```java
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class ConfigLoader {

    public static void main(String[] args) {
        // Define the folder path of the configuration files
        String folderPath = "config";

        // Load properties from all configuration files
        Properties allProperties = loadPropertiesFromFolder(folderPath);

        // Print the content of all configuration files
        System.out.println("Content of configuration files:");
        allProperties.forEach((key, value) -> System.out.println(key + " = " + value));
    }

    private static Properties loadPropertiesFromFolder(String folderPath) {
        Properties allProperties = new Properties();
        ClassLoader classLoader = ConfigLoader.class.getClassLoader();

        try {
            // Get all resources within the folder
            Enumeration<URL> resources = classLoader.getResources(folderPath);

            while (resources.hasMoreElements()) {
                URL resource = resources.nextElement();
                List<Properties> propertiesList = loadPropertiesFromResource(resource);
                for (Properties properties : propertiesList) {
                    allProperties.putAll(properties);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return allProperties;
    }

    private static List<Properties> loadPropertiesFromResource(URL resource) {
        List<Properties> propertiesList = new ArrayList<>();
        try (InputStream inputStream = resource.openStream()) {
            // Read all files within the resource folder
            java.nio.file.Path resourcePath = java.nio.file.Paths.get(resource.toURI());
            java.nio.file.Files.walk(resourcePath, 1)
                    .filter(java.nio.file.Files::isRegularFile)
                    .forEach(file -> {
                        Properties properties = new Properties();
                        try (InputStream fileInputStream = file.toUri().toURL().openStream()) {
                            properties.load(fileInputStream);
                            propertiesList.add(properties);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
        }
        return propertiesList;
    }
}
```

In this updated code, we define a `folderPath` variable that represents the folder path of the configuration files bundled within the JAR file. The `loadPropertiesFromFolder` method is modified to load properties from all files within the specified folder.

The method uses `ClassLoader.getResources()` to get all resources within the folder. It then iterates over each resource, calling the `loadPropertiesFromResource` method to load properties from each file within the resource.

The `loadPropertiesFromResource` method uses `java.nio.file.Files.walk()` to traverse the files within the resource folder. It filters for regular files and loads properties from each file using `Properties.load()`.

In the `main` method, we call the `loadPropertiesFromFolder` method with the folder path. The method returns a `Properties` object containing all the properties from the configuration files within the folder. We then print the content of all the configuration files by iterating over the properties and printing each key-value pair.

Ensure that the configuration files are bundled within the JAR file under the specified folder structure (`config` folder in this case).

