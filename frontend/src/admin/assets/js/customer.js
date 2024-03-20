// customer.js
const API_URL = 'http://localhost:3000/api';
document.addEventListener('DOMContentLoaded', () => {
    fetchCustomers();
  });
  
  const fetchCustomers = async () => {
    try {
      const response = await fetch(API_URL + '/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');
      }
      const data = await response.json();
      displayCustomers(data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  
  const displayCustomers = (customers) => {
    const customerTableBody = document.getElementById('customerTableBody');
    customerTableBody.innerHTML = '';
    customers.forEach(customer => {
      const row = `
        <tr>
          <td>${customer.customer_id}</td>
          <td>${customer.email}</td>
          <td>${customer.full_name}</td>
          <td>${customer.phone_number}</td>
          <td>${customer.address}</td>
          <td>${customer.city}</td>
        </tr>
      `;
      customerTableBody.innerHTML += row;
    });
  };
  