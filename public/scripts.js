let totalIncome = 0;
let totalExpenses = 0;

// Load the transaction history and summary on page load
window.addEventListener('load', function () {
    loadTransactionHistory();
    loadSummary();
});

// Event listener for form submission
document.getElementById('transaction-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get current date
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;

    // Get form values
    const description = document.getElementById('description').value;
    const categorySelect = document.getElementById('category');
    const category = categorySelect.value === 'Custom'
        ? document.getElementById('custom-category').value
        : categorySelect.value;
    const amount = parseFloat(document.getElementById('amount').value);
    const recurring = document.getElementById('recurring').checked;

    if (!description || !category || isNaN(amount)) {
        alert("Please fill all the fields!");
        return;
    }

    // Add transaction to table
    addTransactionToTable(formattedDate, description, category, amount);

    // Update Profit & Loss summary
    updateSummary(amount, category);

    // Clear form fields
    document.getElementById('transaction-form').reset();
    document.getElementById('custom-category-group').style.display = 'none';

    // Save the transaction to localStorage
    saveTransactionHistory();
});

// Show custom category input if "Custom" is selected
document.getElementById('category').addEventListener('change', function () {
    if (this.value === 'Custom') {
        document.getElementById('custom-category-group').style.display = 'block';
    } else {
        document.getElementById('custom-category-group').style.display = 'none';
    }
});

// Add transaction to table
function addTransactionToTable(date, description, category, amount) {
    const table = document.getElementById('transaction-history');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${date}</td>
        <td>${description}</td>
        <td>${category}</td>
        <td>${formatCurrency(amount)}</td>
    `;

    table.appendChild(newRow);
}

// Update the profit & loss summary
function updateSummary(amount, category) {
    if (category === 'Income') {
        totalIncome += amount;
    } else {
        totalExpenses += amount;
    }

    const netProfit = totalIncome - totalExpenses;

    document.getElementById('total-income').innerText = formatCurrency(totalIncome);
    document.getElementById('total-expenses').innerText = formatCurrency(totalExpenses);
    document.getElementById('net-profit').innerText = formatCurrency(netProfit);

    // Save updated totals to localStorage
    saveSummary();
}

// Format currency based on the selected currency
function formatCurrency(amount) {
    const currency = document.getElementById('currency').value;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Search transactions by description
function searchTransactions() {
    const input = document.getElementById('search-bar').value.toLowerCase();
    const rows = document.querySelectorAll('#transaction-history tr');

    rows.forEach(row => {
        const description = row.children[1].innerText.toLowerCase();
        if (description.includes(input)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Export transaction history to CSV
function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Description,Category,Amount\n";

    const rows = document.querySelectorAll('#transaction-history tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        let rowContent = Array.from(cells).map(cell => cell.innerText.replace(/,/g, '')).join(',');
        csvContent += rowContent + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'financial_ledger.csv');
    document.body.appendChild(link);

    link.click();
}

// Save the transaction history to localStorage
function saveTransactionHistory() {
    const table = document.getElementById('transaction-history');
    localStorage.setItem('transactionHistory', table.innerHTML);
}

// Load the transaction history from localStorage
function loadTransactionHistory() {
    const storedHistory = localStorage.getItem('transactionHistory');
    if (storedHistory) {
        document.getElementById('transaction-history').innerHTML = storedHistory;
    }
}

// Save the total income and expenses to localStorage
function saveSummary() {
    localStorage.setItem('totalIncome', totalIncome);
    localStorage.setItem('totalExpenses', totalExpenses);
}

// Load the total income and expenses from localStorage
function loadSummary() {
    totalIncome = parseFloat(localStorage.getItem('totalIncome')) || 0;
    totalExpenses = parseFloat(localStorage.getItem('totalExpenses')) || 0;

    const netProfit = totalIncome - totalExpenses;

    document.getElementById('total-income').innerText = formatCurrency(totalIncome);
    document.getElementById('total-expenses').innerText = formatCurrency(totalExpenses);
    document.getElementById('net-profit').innerText = formatCurrency(netProfit);
}
