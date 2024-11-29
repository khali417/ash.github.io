// Register form submission
document.getElementById('registerForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const user = { username, email, password, balance: 1000, transactionHistory: [] };
    localStorage.setItem(username, JSON.stringify(user));

    alert("Registration successful! You can now log in.");
    window.location.href = 'login.html';  // Redirect to login page
});

// Login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = JSON.parse(localStorage.getItem(username));

    if (user && user.password === password) {
        localStorage.setItem('loggedInUser', username);
        window.location.href = 'transactions.html';  // Redirect to transaction page
    } else {
        alert("Invalid credentials. Try again.");
    }
});

// Transaction page logic
if (document.getElementById('balance')) {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        alert("Please log in first.");
        window.location.href = 'login.html';
    }

    const user = JSON.parse(localStorage.getItem(loggedInUser));
    document.getElementById('balance').innerText = user.balance;

    // Display transaction history
    const transactionHistoryElement = document.getElementById('transactionHistory');
    user.transactionHistory.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = `Sent $${transaction.amount} to ${transaction.recipient}`;
        transactionHistoryElement.appendChild(li);
    });

    // Handle transaction form submission
    document.getElementById('transactionForm')?.addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('amount').value);
        const recipient = document.getElementById('recipient').value;

        if (amount <= 0 || !recipient) {
            alert("Invalid amount or recipient.");
            return;
        }

        if (user.balance >= amount) {
            user.balance -= amount;
            user.transactionHistory.push({ amount, recipient });
            localStorage.setItem(loggedInUser, JSON.stringify(user));

            document.getElementById('balance').innerText = user.balance;

            // Update transaction history
            const li = document.createElement('li');
            li.textContent = `Sent $${amount} to ${recipient}`;
            transactionHistoryElement.appendChild(li);
        } else {
            alert("Insufficient balance.");
        }
    });
}
