
## A Java program can write to Databricks Delta Lake. 
### To do this, you can use the Databricks Delta Lake JDBC driver. 

The following code shows how to write a simple Java program that writes to a Databricks Delta Lake table:

```java
import org.apache.spark.sql.Dataset;
import org.apache.spark.sql.Row;
import org.apache.spark.sql.SaveMode;

public class WriteToDeltaLake {

  public static void main(String[] args) {
    // Create a SparkSession
    SparkSession spark = SparkSession.builder()
      .appName("Write to Delta Lake")
      .master("local[4]")
      .getOrCreate();

    // Read a dataset from a source
    Dataset<Row> df = spark.read.json("src/main/resources/people.json");

    // Write the dataset to a Delta Lake table
    df.write.mode(SaveMode.Overwrite)
      .format("delta")
      .save("dbfs:/path/to/delta/lake/table");
  }
}
```

`This code will write the contents of the people.json file to a Delta Lake table named table in the dbfs:/path/to/delta/lake directory.`

https://github.com/Marnoximo/spark-in-action
