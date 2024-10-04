# JSON to Table Converter

This project provides a simple web-based tool to convert JSON data into a tabular format and vice versa. You can input JSON data, view it in a table, and convert the table back to JSON format.

## Features

- Convert JSON data to a table view.
- Convert the table back to JSON format.
- Handle nested JSON objects and boolean values.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, etc.)

### Installation

1. Clone the repository or download the files.
   ```bash
      cd json-to-table
   ```

2. Open the `index.html` file in your web browser.

### Usage

1. **Input JSON**: In the text area provided, enter your JSON data. The JSON should be in a valid format. For example:
   ```json
   [
       {
           "name": "John Doe",
           "age": 30,
           "isActive": false,
           "address": {
               "street": "123 Main St",
               "city": "New York"
           }
       },
       {
           "name": "Jane Smith",
           "age": 25,
           "isActive": true,
           "address": {
               "street": "456 Elm St",
               "city": "Los Angeles"
           }
       }
   ]
   ```

2. **Convert to Table**: Click the "Convert to Table" button. The JSON data will be displayed in a tabular format.

3. **View Table**: The table will show each attribute of the JSON objects. Boolean values will be displayed as `true` or `false`, and nested objects will be shown as JSON strings.

4. **Convert to JSON**: If you modify the table data, you can click the "Convert to JSON" button to see the updated JSON output. The output will reflect any changes made in the table.

### Example

#### Input JSON
```JSON
[
{
"name": "John Doe",
"age": 30,
"isActive": false,
"address": {
"street": "123 Main St",
"city": "New York"
}
},
{
"name": "Jane Smith",
"age": 25,
"isActive": true,
"address": {
"street": "456 Elm St",
"city": "Los Angeles"
}
}
]
```

#### Resulting Table
| name       | age | isActive | address                          |
|------------|-----|----------|----------------------------------|
| John Doe  | 30  | false    | {"street":"123 Main St","city":"New York"} |
| Jane Smith | 25  | true     | {"street":"456 Elm St","city":"Los Angeles"} |

#### Resulting JSON Output
```JSON
[
{
"name": "John Doe",
"age": 30,
"isActive": false,
"address": {"street":"123 Main St","city":"New York"}
},
{
"name": "Jane Smith",
"age": 25,
"isActive": true,
"address": {"street":"456 Elm St","city":"Los Angeles"}
}
]
```

