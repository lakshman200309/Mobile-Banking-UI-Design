// Store currently logged-in user email
let currentUserEmail = null;

// Show/hide screens with animation
function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");
  screens.forEach(screen => {
    screen.classList.add("hidden");
    screen.classList.remove("fade-in");
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.remove("hidden");
    target.classList.add("fade-in");
  }
}

// Load users from localStorage
function loadUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// Login
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const users = loadUsers();

  if (email in users && users[email].password === password) {
    currentUserEmail = email;
    document.getElementById("userName").textContent = users[email].name;
    updateBalanceDisplay();
    updateTransactionList();
    showScreen("dashboardScreen");
  } else {
    alert("Invalid email or password.");
  }
}

// Signup
function signup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const users = loadUsers();

  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }
  if (email in users) {
    alert("Account already exists. Please log in.");
    return;
  }

  users[email] = {
    name,
    password,
    balance: 5200.00,
    transactions: []
  };

  saveUsers(users);
  currentUserEmail = email;
  document.getElementById("userName").textContent = name;
  updateBalanceDisplay();
  updateTransactionList();
  showScreen("dashboardScreen");
}

// Update displayed balance
function updateBalanceDisplay() {
  const users = loadUsers();
  const user = users[currentUserEmail];
  document.getElementById("balanceAmount").textContent = `$${user.balance.toFixed(2)}`;
}

// Update transaction list
// Update transaction list
function updateTransactionList() {
  const users = loadUsers();
  const user = users[currentUserEmail];
  const list = document.getElementById("transactionList");
  list.innerHTML = "";

  user.transactions.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = entry;
    li.style.animation = "fadeUp 0.4s ease-in-out";
    list.prepend(li);
  });

  // Auto-scroll to top smoothly
  list.scrollTo({ top: 0, behavior: 'smooth' });
}


// Transfer money
function transfer() {
  const recipient = document.getElementById("recipient").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  if (!recipient || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid recipient and amount.");
    return;
  }

  const users = loadUsers();
  const user = users[currentUserEmail];

  if (amount > user.balance) {
    alert("Insufficient balance.");
    return;
  }

  user.balance -= amount;
  const entry = `$${amount.toFixed(2)} sent to ${recipient} - ${new Date().toLocaleDateString()}`;
  user.transactions.push(entry);
  saveUsers(users);

  updateBalanceDisplay();
  updateTransactionList();
  alert(`$${amount.toFixed(2)} sent to ${recipient}`);
  showScreen("dashboardScreen");

  // Clear form fields
  document.getElementById("recipient").value = "";
  document.getElementById("amount").value = "";
}

// Pay bill
function payBill() {
  const billType = document.getElementById("billType").value;
  const amount = parseFloat(document.getElementById("billAmount").value);
  if (!billType || isNaN(amount) || amount <= 0) {
    alert("Please select a valid bill type and amount.");
    return;
  }

  const users = loadUsers();
  const user = users[currentUserEmail];

  if (amount > user.balance) {
    alert("Insufficient balance.");
    return;
  }

  user.balance -= amount;
  const entry = `$${amount.toFixed(2)} paid for ${billType} bill - ${new Date().toLocaleDateString()}`;
  user.transactions.push(entry);
  saveUsers(users);

  updateBalanceDisplay();
  updateTransactionList();
  alert(`$${amount.toFixed(2)} paid for ${billType} bill`);
  showScreen("dashboardScreen");

  // Clear form fields
  document.getElementById("billType").value = "";
  document.getElementById("billAmount").value = "";
}

// Dark/Light Mode Toggle with localStorage
window.addEventListener("DOMContentLoaded", () => {
  const switcher = document.getElementById("themeSwitcher");

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    if (switcher) switcher.checked = true;
  }

  // Listen to toggle switch
  if (switcher) {
    switcher.addEventListener("change", () => {
      const isDark = switcher.checked;
      document.body.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
});
