let currentPage = 0;
const pageSize = 2;
const apiUrl = 'http://127.0.0.1:8080/api/customers';
const apiPageUrl = 'http://localhost:8080/api/customers/page';

// Generic API fetch function
async function apiFetch(method, url, data = null) {
    try {
        const config = {
            method: method,
            url: url,
            data: data,
        };
        const response = await axios(config);
        return response.data; // Return the response data
    } catch (error) {
        console.error(`Error during API call: ${error}`);
        throw error; // Rethrow the error for further handling
    }
}

async function loadCustomers(page = 0) {
    try {
        const response = await axios.get(`${apiPageUrl}?page=${page}&size=${pageSize}`);
        const data = response.data;

        const customers = data.content || []; // Access the content array
        const totalRecords = data.totalElements; // Get the total number of records
        const totalPages = data.totalPages; // Get the total number of pages

        const customerList = document.getElementById('customer-list');
        customerList.innerHTML = ''; // Clear the existing customer list

        // Create a table for displaying customers
        const table = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                        <th>Date of Birth</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${customers.map(customer => `
                        <tr>
                            <td>${customer.name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.age}</td>
                            <td>${customer.dateOfBirth || 'N/A'}</td>
                            <td>
                                <button class="btn btn-warning" onclick="editCustomer('${customer.id}')">Edit</button>
                                <button class="btn btn-danger" onclick="deleteCustomer('${customer.id}')">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        customerList.innerHTML += table; // Insert the table into the customer list

        // Calculate start and end record indices
        const startRecordIndex = page * pageSize + 1;
        const endRecordIndex = Math.min((page + 1) * pageSize, totalRecords);

        // Display pagination information
        const recordCount = `Showing page: ${page + 1}, records index: [${startRecordIndex} to ${endRecordIndex}], total records: ${totalRecords}, total pages: ${totalPages}`;
        customerList.innerHTML += `<div class="alert alert-info">${recordCount}</div>`;

        // Update current page
        currentPage = page;

        // Enable/disable pagination buttons
        document.getElementById('prev-button').disabled = currentPage === 0; // Disable if on the first page
        document.getElementById('next-button').disabled = currentPage >= totalPages - 1; // Disable if on the last page
    } catch (error) {
        console.error("Error loading customers:", error);
    }
}

function changePage(newPage) {
    loadCustomers(newPage); // Load customers for the new page
}

async function submitForm(event) {
    event.preventDefault();
    const customer = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        email: document.getElementById('email').value,
        dateOfBirth: document.getElementById('date_of_birth').value, // This will be in yyyy-mm-dd format
    };

    const method = document.getElementById('form-method').value; // Get the form method
    const id = document.getElementById('customer-id').value; // Get the customer ID

    try {
        if (method === 'POST') {
            await apiFetch('POST', apiUrl, customer); // Create new customer
        } else if (method === 'PUT') {
            await apiFetch('PUT', `${apiUrl}/${id}`, customer); // Update existing customer
        }
        resetForm(); // Reset the form after submission
        loadCustomers(currentPage); // Reload customers
    } catch (error) {
        console.error("Error submitting form:", error);
    }
}

async function editCustomer(id) {
    try {
        const customer = await apiFetch('GET', `${apiUrl}/${id}`);
        document.getElementById('name').value = customer.name;
        document.getElementById('age').value = customer.age;
        document.getElementById('email').value = customer.email;

        // Set the date of birth in yyyy-mm-dd format for the input field
        const date = new Date(customer.dateOfBirth);
        const formattedDate = date.toISOString().split('T')[0]; // Get yyyy-mm-dd format
        document.getElementById('date_of_birth').value = formattedDate; // Set the input value

        document.getElementById('form-method').value = 'PUT'; // Set method to PUT for update
        document.getElementById('customer-id').value = id; // Set the customer ID for the update

        // Change the submit button text to "Update Customer"
        document.getElementById('submit-button').innerText = 'Update Customer';
    } catch (error) {
        console.error("Error editing customer:", error);
    }
}

async function deleteCustomer(id) {
    try {
        await apiFetch('DELETE', `${apiUrl}/${id}`);
        loadCustomers(currentPage);
    } catch (error) {
        console.error("Error deleting customer:", error);
    }
}

function resetForm() {
    document.getElementById('customer-form').reset();
    document.getElementById('form-method').value = 'POST';
    document.getElementById('customer-id').value = '';
    document.getElementById('submit-button').innerText = 'Create Customer'; // Reset button text
}