function convertJson() {
    const jsonInput = document.getElementById('jsonInput').value;
    const jsonObject = JSON.parse(jsonInput);
    
    // Display Input JSON
    document.getElementById('inputJsonOutput').textContent = JSON.stringify(jsonObject, null, 2);
    document.getElementById('inputJsonSection').style.display = 'block';

    // Display Java Project Structure
    const projectStructure = `
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
    `;
    document.getElementById('projectStructureOutput').textContent = projectStructure;
    document.getElementById('projectStructureSection').style.display = 'block';

    // Display pom.xml
    const pomXml = `
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
    `;
    document.getElementById('pomXmlOutput').textContent = pomXml;
    document.getElementById('pomXmlSection').style.display = 'block';

    // Generate Java Classes
    const javaClasses = generateJavaClasses(jsonObject, "Example");
    document.getElementById('javaOutput').textContent = javaClasses;
    document.getElementById('javaClassesSection').style.display = 'block';

    // Generate Example Usage
    const exampleUsage = generateExampleUsage(jsonObject, "example");
    document.getElementById('exampleOutput').textContent = exampleUsage;
    document.getElementById('exampleOutputSection').style.display = 'block';
}

function generateJavaClasses(jsonObject, className) {
    let javaClass = `import com.google.gson.Gson;\n\n` +
                    `class ${className} {\n`;

    for (const [key, value] of Object.entries(jsonObject)) {
        let type;
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                // Handle arrays
                const itemType = value.length > 0 ? getJavaType(value[0]) : "Object";
                type = `List<${itemType}>`;
            } else {
                // Handle nested objects
                type = capitalizeFirstLetter(key);
                javaClass += generateJavaClasses(value, type); // Recursively generate class for nested object
            }
        } else {
            type = getJavaType(value);
        }
        javaClass += `    private ${type} ${key};\n`;
    }

    javaClass += `\n    // Getters and Setters\n`;
    for (const key of Object.keys(jsonObject)) {
        let capitalizedKey = capitalizeFirstLetter(key);
        javaClass += `    public ${getJavaType(jsonObject[key])} get${capitalizedKey}() { return ${key}; }\n`;
        javaClass += `    public void set${capitalizedKey}(${getJavaType(jsonObject[key])} ${key}) { this.${key} = ${key}; }\n`;
    }
    javaClass += `}\n\n`; // Close class

    return javaClass;
}

function getJavaType(value) {
    const type = typeof value;
    if (type === 'object') {
        return Array.isArray(value) ? "List<Object>" : "Object"; // Handle arrays and objects
    } else if (type === 'string') {
        return "String";
    } else if (type === 'number') {
        return "int"; // Simplified for demonstration
    } else if (type === 'boolean') {
        return "boolean";
    }
    return "Object"; // Default case
}

function generateExampleUsage(jsonObject, exampleName) {
    let exampleUsage = `import com.google.gson.Gson;\n\n` +
                       `public class ExampleUsage {\n` +
                       `    public static void main(String[] args) {\n` +
                       `        ${capitalizeFirstLetter(exampleName)} example = new ${capitalizeFirstLetter(exampleName)}();\n`;

    for (const [key, value] of Object.entries(jsonObject)) {
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                exampleUsage += `        // Handle array for ${key}\n`;
                exampleUsage += `        List<Object> ${key}List = new ArrayList<>();\n`;
                value.forEach((item, index) => {
                    exampleUsage += `        ${key}List.add(${JSON.stringify(item)});\n`;
                });
                exampleUsage += `        example.set${capitalizeFirstLetter(key)}(${key}List);\n`;
            } else {
                exampleUsage += `        ${capitalizeFirstLetter(key)} nested${capitalizeFirstLetter(key)} = new ${capitalizeFirstLetter(key)}();\n`;
                for (const [nestedKey, nestedValue] of Object.entries(value)) {
                    exampleUsage += `        nested${capitalizeFirstLetter(key)}.set${capitalizeFirstLetter(nestedKey)}(${JSON.stringify(nestedValue)});\n`;
                }
                exampleUsage += `        example.set${capitalizeFirstLetter(key)}(nested${capitalizeFirstLetter(key)});\n`;
            }
        } else {
            exampleUsage += `        example.set${capitalizeFirstLetter(key)}(${JSON.stringify(value)});\n`;
        }
    }

    exampleUsage += `        String jsonString = new Gson().toJson(example);\n` +
                    `        System.out.println(jsonString); // Output: ${JSON.stringify(jsonObject)}\n` +
                    `    }\n` +
                    `}`; // Close class

    return exampleUsage;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}