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
