let currentPage = 0;
const pageSize = 2;
const apiUrl = 'http://localhost:8080/api/customers/page';

async function loadCustomers(page = 0) {
    try {
        // Fetch customers from the API
        const response = await axios.get(`${apiUrl}?page=${page}&size=${pageSize}`);
        console.log("API Response:", response);
        const data = response.data;

        // Log the entire response to check its structure
        console.log("API Response data:", data);

        const customers = data.content || []; // Access the content array
        const totalRecords = data.totalElements; // Get the total number of records
        const totalPages = data.totalPages; // Get the total number of pages

        // Calculate the record index range
        const startRecordIndex = (data.number * pageSize) + 1; // Start index (1-based)
        const endRecordIndex = Math.min(startRecordIndex + customers.length - 1, totalRecords); // End index (1-based)

        const customerList = document.getElementById('customer-list');
        customerList.innerHTML = ''; // Clear the existing customer list

        // Display the record count
        const recordCount = `Showing page: ${data.number + 1}, records index: [${startRecordIndex} to ${endRecordIndex}], total records: ${totalRecords}, total pages: ${totalPages}`;
        customerList.innerHTML += `<div class="alert alert-info">${recordCount}</div>`;

        // Create a table for displaying customers
        const table = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Date of Birth</th>
                    </tr>
                </thead>
                <tbody>
                    ${customers.map(customer => `
                        <tr>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.age}</td>
                            <td>${customer.dateOfBirth || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        customerList.innerHTML += table; // Insert the table into the customer list

        // Update pagination if needed
        updatePagination(data);
    } catch (error) {
        console.error("Error loading customers:", error);
    }
}

function updatePagination(data) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing pagination

    if (data.first === false) {
        pagination.innerHTML += `<button class="btn btn-secondary" onclick="loadCustomers(${data.number - 1})">Previous</button>`;
    }
    if (data.last === false) {
        pagination.innerHTML += `<button class="btn btn-secondary" onclick="loadCustomers(${data.number + 1})">Next</button>`;
    }
}

// Load initial customers on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCustomers(currentPage);
});