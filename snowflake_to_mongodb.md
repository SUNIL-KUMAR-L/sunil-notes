###  MongoDB Spark Connector
- [Getting Started](https://www.mongodb.com/docs/spark-connector/current/getting-started/)
- [Write Configuration Options](https://www.mongodb.com/docs/spark-connector/current/configuration/write/)
- [Read Configuration Options](https://www.mongodb.com/docs/spark-connector/current/configuration/read/)

- [Spark savemode](https://spark.apache.org/docs/3.2.0/sql-data-sources-load-save-functions.html#save-modes)
- [MongoSpark](https://www.javadoc.io/doc/org.mongodb.spark/mongo-spark-connector_2.11/2.3.2/com/mongodb/spark/MongoSpark$.html)

## write scala code to pick up data from snowflake table and then persist to mongoDB collection as batch size of 100 in upsert mode
### also, show me the project strcuture and pom.xml of the above


Here's an example of Scala code that retrieves data from a Snowflake table and persists it in a MongoDB collection in batch size of 100, using the upsert mode:

# 1

```scala
import org.apache.spark.sql.{SparkSession, DataFrame}
import org.apache.spark.sql.functions._
import com.mongodb.spark.MongoSpark

object MyApp {
  def main(args: Array[String]): Unit = {
    // Create Spark session
    val spark = SparkSession.builder()
      .appName("Snowflake to MongoDB")
      .config("spark.mongodb.output.uri", "mongodb://localhost/mydatabase.my_collection")
      .getOrCreate()

    // Read data from Snowflake table
    val snowflakeDF: DataFrame = spark.read
      .format("net.snowflake.spark.snowflake")
      .option("sfURL", "snowflake_url")
      .option("sfAccount", "snowflake_account")
      .option("sfWarehouse", "snowflake_warehouse")
      .option("sfDatabase", "snowflake_database")
      .option("sfSchema", "snowflake_schema")
      .option("sfRole", "snowflake_role")
      .option("sfUser", "snowflake_user")
      .option("sfPassword", "snowflake_password")
      .option("dbtable", "my_table")
      .load()

    // Filter and select only the required columns for upsert
    val filteredDF: DataFrame = snowflakeDF.select(col("person_id"), col("name"), col("age"))
      .filter(col("person_id").isNotNull)

    // Count the number of records
    val numRecords = filteredDF.count()

    // Log the number of records
    println(s"Number of records: $numRecords")

    // Set the batch size for upsert
    val batchSize = 1000

    // Calculate the number of batches
    val numBatches = math.ceil(numRecords.toDouble / batchSize.toDouble).toInt

    // Write data to MongoDB collection with upsert operation in batches
    var batchCount = 0

    filteredDF.foreachPartition(iter => {
      val partitionId = TaskContext.getPartitionId()
      val batchId = TaskContext.get().stageId()
      val batchProgress = batchCount * batchSize
      val totalProgress = batchId * batchSize + batchProgress
      val count = iter.length

      println(s"Partition $partitionId - Processing Batch $batchId: $batchProgress / $numRecords records processed")

      // Prepare the batch of data for upsert
      val batchData = iter.map { row =>
        val personId = row.getAs[Int]("person_id")
        val name = row.getAs[String]("name")
        val age = row.getAs[Int]("age")

        // Create a document with _id and the fields to update
        val document = org.bson.Document.parse(s"""{ "_id": $personId, "name": "$name", "age": $age }""")
        document
      }.toList

      // Perform upsert operation for the current batch
      batchDF.mode("append")
        .options(Map("collection" -> "my_collection", "updateDocument" -> "true"))
        .save()

/*
      // Perform upsert operation for the current batch
      val mongoConnector = MongoSpark.writeConfig(spark.sparkContext.getConf)
      mongoConnector.withOptions(Map("collection" -> "my_collection", "updateDocument" -> "true"))
        .append(batchData)
*/

/*
//other approach is 
      // Perform upsert operation for the current batch
      val writeConfig = WriteConfig(Map("collection" -> "my_collection", , "updateDocument" -> "true"))
      val mongoConnector = MongoSpark.writeConfig(writeConfig)
      mongoConnector.mode("append").mongoDF(spark.createDataFrame(batchData, classOf[org.bson.Document]))
*/
/* another appoach is 
// Perform upsert operation for the current batch
      val writeConfig = WriteConfig(Map("collection" -> "my_collection", "updateDocument" -> "false"))
      //MongoSpark.write(batchDF, writeConfig).mode("append").save()
//batchDF.write.format("mongodb").mode("append").save()
batchDF.mode("append")
.options(Map("collection" -> "my_collection", "updateDocument" -> "true"))
.save()

*/
      batchCount += 1
    })

    // Stop the Spark session
    spark.stop()
  }
}
```

# 2
```scala
import com.mongodb.MongoClientURI
import com.mongodb.spark.MongoSpark
import org.apache.spark.sql.{DataFrame, SparkSession}
import net.snowflake.spark.snowflake._

object SnowflakeToMongoDB {

  def main(args: Array[String]): Unit = {
    // Snowflake connection parameters
    val sfOptions = Map(
      "sfURL" -> "<snowflake_url>",
      "sfDatabase" -> "<snowflake_database>",
      "sfWarehouse" -> "<snowflake_warehouse>",
      "sfRole" -> "<snowflake_role>",
      "sfUser" -> "<snowflake_username>",
      "sfPassword" -> "<snowflake_password>"
    )

    // MongoDB connection parameters
    val mongoUri = "<mongodb_uri>"
    val database = "<mongodb_database>"
    val collection = "<mongodb_collection>"

    // Spark configuration
    val sparkSession = SparkSession.builder()
      .appName("SnowflakeToMongoDB")
      .config("spark.mongodb.output.uri", mongoUri)
      .getOrCreate()

    // Read data from Snowflake table
    val snowflakeConfig = sparkSession
      .read
      .format("net.snowflake.spark.snowflake")
      .options(sfOptions)
      .option("query", "SELECT * FROM snowflake_table")
      .load()

    // Upsert data to MongoDB in batches of 100
    writeDataToMongoDB(snowflakeConfig, database, collection, 100)

    // Stop Spark session
    sparkSession.stop()
  }

  def writeDataToMongoDB(dataFrame: DataFrame, database: String, collection: String, batchSize: Int): Unit = {
    val writeConfig = Map(
      "uri" -> s"mongodb://localhost/$database.$collection",
      "database" -> database,
      "collection" -> collection,
      "replaceDocument" -> "false",
      "maxBatchSize" -> batchSize.toString
    )

    MongoSpark.save(dataFrame.write
      .format("com.mongodb.spark.sql.DefaultSource")
      .mode("append")
      .options(writeConfig)
    )
  }
}
```

To use this code, you'll need to have the following dependencies in your `pom.xml` file:

```xml
<dependencies>
    <!-- Spark -->
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-core_2.12</artifactId>
        <version>3.1.2</version>
    </dependency>
    <dependency>
        <groupId>org.apache.spark</groupId>
        <artifactId>spark-sql_2.12</artifactId>
        <version>3.1.2</version>
    </dependency>

    <!-- Snowflake Spark Connector -->
    <dependency>
        <groupId>net.snowflake</groupId>
        <artifactId>spark-snowflake_2.12</artifactId>
        <version>2.10.4</version>
    </dependency>

    <!-- MongoDB Spark Connector -->
    <dependency>
        <groupId>org.mongodb.spark</groupId>
        <artifactId>mongo-spark-connector_2.12</artifactId>
        <version>3.0.1</version>
    </dependency>
</dependencies>
```

Make sure to replace the `<snowflake_*>` and `<mongodb_*>` placeholders with your actual Snowflake and MongoDB connection details. Also, update the Snowflake table name in the query (`SELECT * FROM snowflake_table`) to the desired table name.

Regarding the project structure, it should follow the standard Maven project structure. Here's an example:

```
project-root
├── src
│   └── main
│       ├── scala
│       │   └── SnowflakeToMongoDB.scala
│       └── resources
│           └── <empty>
└── pom.xml
```

The Scala code should be placed under the `src/main/scala` directory, and the `pom.xml` file should be at the project root.

Remember to configure the necessary Snowflake and MongoDB connection details in the code before running the application.


`Here's an example of how you can provide the Snowflake and MongoDB connection configurations within the `resources` folder of your project.`

Assuming you have the following structure:

```
project-root
├── src
│   └── main
│       ├── scala
│       │   └── SnowflakeToMongoDB.scala
│       └── resources
│           ├── snowflake.conf
│           └── mongodb.conf
└── pom.xml
```

You can create separate configuration files for Snowflake and MongoDB within the `resources` folder.

1. `snowflake.conf`:
```properties
sfURL=<snowflake_url>
sfDatabase=<snowflake_database>
sfWarehouse=<snowflake_warehouse>
sfRole=<snowflake_role>
sfUser=<snowflake_username>
sfPassword=<snowflake_password>
```

2. `mongodb.conf`:
```properties
mongoUri=<mongodb_uri>
database=<mongodb_database>
collection=<mongodb_collection>
```

In your `SnowflakeToMongoDB.scala` code, you can read these configuration files using the `ConfigFactory` from the Typesafe Config library. Here's an updated version of the code:

```scala
import com.mongodb.spark.MongoSpark
import com.typesafe.config.{Config, ConfigFactory}
import org.apache.spark.sql.{DataFrame, SparkSession}
import net.snowflake.spark.snowflake._

object SnowflakeToMongoDB {

  def main(args: Array[String]): Unit = {
    val sparkSession = SparkSession.builder()
      .appName("SnowflakeToMongoDB")
      .getOrCreate()

    val snowflakeConfig = loadSnowflakeConfig()
    val mongoConfig = loadMongoConfig()

    val dataFrame = readDataFromSnowflake(sparkSession, snowflakeConfig)
    writeDataToMongoDB(dataFrame, mongoConfig)

    sparkSession.stop()
  }

  def loadSnowflakeConfig(): Config = {
    ConfigFactory.load("snowflake.conf")
  }

  def loadMongoConfig(): Config = {
    ConfigFactory.load("mongodb.conf")
  }

  def readDataFromSnowflake(sparkSession: SparkSession, config: Config): DataFrame = {
    val options = config.entrySet().toArray.map { entry =>
      entry.getKey -> entry.getValue.unwrapped().toString
    }.toMap

    sparkSession
      .read
      .format("net.snowflake.spark.snowflake")
      .options(options)
      .option("query", "SELECT * FROM snowflake_table")
      .load()
  }

  def writeDataToMongoDB(dataFrame: DataFrame, config: Config): Unit = {
    val writeConfig = config.entrySet().toArray.map { entry =>
      entry.getKey -> entry.getValue.unwrapped().toString
    }.toMap

    MongoSpark.save(dataFrame.write
      .format("com.mongodb.spark.sql.DefaultSource")
      .mode("append")
      .options(writeConfig)
    )
  }
}
```

In this updated code, the `loadSnowflakeConfig()` and `loadMongoConfig()` methods load the respective configuration files using the Typesafe Config library. The configuration properties are then passed to the Snowflake and MongoDB connection methods.

Ensure that you have the Typesafe Config library as a dependency in your `pom.xml` file:

```xml
<dependency>
    <groupId>com.typesafe</groupId>
    <artifactId>config</artifactId>
    <version>1.4.1</version>
</dependency>
```

By using separate configuration files, you can easily modify the connection details without modifying the code itself. It provides better flexibility and separation of configuration from code.

Make sure to replace the `<snowflake_*>` and `<mongodb_*>` placeholders in the configuration files with your actual Snowflake and MongoDB connection details.



`how do you specify upsert is true with batch size update?`
To specify that the MongoDB write operation should perform upserts (update or insert) and set the batch size for updates, you can modify the `writeConfig` as follows:

```scala
def writeDataToMongoDB(dataFrame: DataFrame, config: Config): Unit = {
  val writeConfig = config.entrySet().toArray.map { entry =>
    entry.getKey -> entry.getValue.unwrapped().toString
  }.toMap + ("replaceDocument" -> "true", "maxBatchSize" -> "100")

  MongoSpark.save(dataFrame.write
    .format("com.mongodb.spark.sql.DefaultSource")
    .mode("append")
    .options(writeConfig)
  )
}
```

In the `writeConfig` map, we add two additional entries: `"replaceDocument" -> "true"` and `"maxBatchSize" -> "100"`. These entries configure the MongoDB write operation to perform upserts and set the batch size for updates to 100.

By setting `"replaceDocument" -> "true"`, MongoDB will attempt to update existing documents and insert new documents if they don't already exist.

By setting `"maxBatchSize" -> "100"`, the write operation will process the data in batches of 100 documents at a time.

Feel free to adjust the batch size value (`100` in this example) as per your requirements.

Remember to update your `mongodb.conf` file accordingly:

```properties
mongoUri=<mongodb_uri>
database=<mongodb_database>
collection=<mongodb_collection>
```

Make sure to replace `<mongodb_uri>`, `<mongodb_database>`, and `<mongodb_collection>` with your actual MongoDB connection details.

With these modifications, the code will perform upserts and use a batch size of 100 for updating data into the MongoDB collection.


### full code of SnowflakeToMongoDB

Here's the full code for the `SnowflakeToMongoDB` Scala application that retrieves data from a Snowflake table and persists it to a MongoDB collection with upsert mode and a batch size of 100:

```scala
import com.mongodb.spark.MongoSpark
import com.typesafe.config.{Config, ConfigFactory}
import org.apache.spark.sql.{DataFrame, SparkSession}
import net.snowflake.spark.snowflake._

object SnowflakeToMongoDB {

  def main(args: Array[String]): Unit = {
    val sparkSession = SparkSession.builder()
      .appName("SnowflakeToMongoDB")
      .getOrCreate()

    val snowflakeConfig = loadSnowflakeConfig()
    val mongoConfig = loadMongoConfig()

    val dataFrame = readDataFromSnowflake(sparkSession, snowflakeConfig)
    writeDataToMongoDB(dataFrame, mongoConfig)

    sparkSession.stop()
  }

  def loadSnowflakeConfig(): Config = {
    ConfigFactory.load("snowflake.conf")
  }

  def loadMongoConfig(): Config = {
    ConfigFactory.load("mongodb.conf")
  }

  def readDataFromSnowflake(sparkSession: SparkSession, config: Config): DataFrame = {
    val options = config.entrySet().toArray.map { entry =>
      entry.getKey -> entry.getValue.unwrapped().toString
    }.toMap

    sparkSession
      .read
      .format("net.snowflake.spark.snowflake")
      .options(options)
      .option("query", "SELECT * FROM snowflake_table")
      .load()
  }

  def writeDataToMongoDB(dataFrame: DataFrame, config: Config): Unit = {
    val writeConfig = config.entrySet().toArray.map { entry =>
      entry.getKey -> entry.getValue.unwrapped().toString
    }.toMap + ("replaceDocument" -> "true", "maxBatchSize" -> "100")

    MongoSpark.save(dataFrame.write
      .format("com.mongodb.spark.sql.DefaultSource")
      .mode("append")
      .options(writeConfig)
    )
  }
}
```

Make sure you have the necessary dependencies in your `pom.xml` file, including Spark, Snowflake Spark Connector, MongoDB Spark Connector, and Typesafe Config.

Additionally, create the `snowflake.conf` and `mongodb.conf` files in the `resources` folder of your project and provide the respective configuration details.

Remember to replace `<snowflake_*>` and `<mongodb_*>` placeholders in the configuration files with your actual Snowflake and MongoDB connection details.

### snowflake.conf and mongodb.conf details

Here's an example of the contents for `snowflake.conf` and `mongodb.conf` configuration files:

1. `snowflake.conf`:
```properties
sfURL=<snowflake_url>
sfDatabase=<snowflake_database>
sfWarehouse=<snowflake_warehouse>
sfRole=<snowflake_role>
sfUser=<snowflake_username>
sfPassword=<snowflake_password>
```
Replace `<snowflake_url>`, `<snowflake_database>`, `<snowflake_warehouse>`, `<snowflake_role>`, `<snowflake_username>`, and `<snowflake_password>` with your actual Snowflake connection details.

2. `mongodb.conf`:
```properties
mongoUri=<mongodb_uri>
database=<mongodb_database>
collection=<mongodb_collection>
```
Replace `<mongodb_uri>`, `<mongodb_database>`, and `<mongodb_collection>` with your actual MongoDB connection details.

Ensure that you have these configuration files (`snowflake.conf` and `mongodb.conf`) present in the `resources` folder of your project and that the placeholders are replaced with the appropriate values.





### write scala code to pick up data from snowflake table and then persist to mongoDB collection as batch size of 100 in upsert mode

```
import com.mongodb.spark._
import org.apache.spark.sql._

// Create a SparkSession
val spark = SparkSession.builder()
  .appName("Snowflake to MongoDB")
  .getOrCreate()

// Read data from Snowflake
val snowflakeDF = spark.read.format("snowflake")
  .option("account", "ACCOUNT_NAME")
  .option("user", "USER_NAME")
  .option("password", "PASSWORD")
  .option("database", "DATABASE_NAME")
  .option("schema", "SCHEMA_NAME")
  .option("table", "TABLE_NAME")
  .load()

// Write data to MongoDB
snowflakeDF.write
  .format("mongo")
  .option("uri", "mongodb://localhost:27017/DATABASE_NAME.COLLECTION_NAME")
  .option("batchSize", 100)
  .option("upsert", true)
  .save()
```

### How can I specify the MongoDB connection details in the Scala code?

You can specify the MongoDB connection details in the Scala code by using the `uri` option. The `uri` option takes a string that specifies the MongoDB connection URL. For example, the following code specifies the connection URL for a MongoDB database that is running on localhost on port 27017:

```
.option("uri", "mongodb://localhost:27017/DATABASE_NAME")
```
