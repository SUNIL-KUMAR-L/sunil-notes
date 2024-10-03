function convertJsonToTable() {
    const jsonInput = document.getElementById('jsonInput').value;
    let jsonObject;

    try {
        jsonObject = JSON.parse(jsonInput);
    } catch (e) {
        alert("Invalid JSON input!");
        return;
    }

    const tableContainer = document.getElementById('tableContainer');
    tableContainer.innerHTML = ''; // Clear previous table

    const table = document.createElement('table');
    const headerRow = document.createElement('tr');

    // Create table headers
    const headers = getHeaders(jsonObject);
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Create table rows
    jsonObject.forEach(item => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            const value = getNestedValue(item, header);
            td.textContent = typeof value === 'object' ? JSON.stringify(value) : value; // Display nested object as JSON string
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    tableContainer.appendChild(table);
}

function getHeaders(jsonObject) {
    const headers = new Set();
    jsonObject.forEach(item => {
        flattenObject(item, headers, '');
    });
    return Array.from(headers);
}

function flattenObject(obj, headers, prefix) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof value === 'object' && value !== null) {
                headers.add(newKey); // Add the key for the nested object
                // Do not flatten further, just keep the key
            } else {
                headers.add(newKey); // Add the flattened key to the headers
            }
        }
    }
}

function getNestedValue(obj, key) {
    const keys = key.split('.');
    return keys.reduce((acc, curr) => acc && acc[curr], obj) || '';
}

function convertTableToJson() {
    const table = document.querySelector('#tableContainer table');
    if (!table) {
        alert("No table to convert!");
        return;
    }

    const jsonOutput = [];
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);

    table.querySelectorAll('tr').forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const rowData = {};
        row.querySelectorAll('td').forEach((td, i) => {
            const cellValue = td.textContent;
            try {
                // Attempt to parse the cell value as JSON
                rowData[headers[i]] = JSON.parse(cellValue);
            } catch (e) {
                // If parsing fails, keep it as a string
                rowData[headers[i]] = cellValue;
            }
        });
        jsonOutput.push(rowData);
    });

    document.getElementById('jsonOutput').textContent = JSON.stringify(jsonOutput, null, 2);
}