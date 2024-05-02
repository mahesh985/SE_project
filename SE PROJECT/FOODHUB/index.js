import { menuArray } from "./data.js";

// Elements
const loginForm = document.getElementById("loginForm");
const loginPage = document.getElementById("loginPage");
const header = document.getElementById("header0");
const main = document.getElementById("main");
const footer = document.getElementById("footer0");
const usernameInput = document.getElementById("username");

// Hide main content initially
header.classList.add("hide");
main.classList.add("hide");
footer.classList.add("hide");

// Event listener for login form submission
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = usernameInput.value.trim();

    // Check if username ends with .stu or .stf
    if (username.endsWith(".stu")) {
        // Redirect to main content for students
        showMainContent();
    } else if (username.endsWith(".stf")) {
        // Redirect to menu management for staff
        showMenuManagement();
    } else {
        alert("Invalid username. Please enter a username ending with .stu or .stf.");
    }
});

function showMainContent() {
    // Show main content
    header.classList.remove("hide");
    main.classList.remove("hide");
    footer.classList.remove("hide");

    // Hide login page
    loginPage.classList.add("hide");

    // Render menu items
    renderMenu();
}

function showMenuManagement() {
    // Show menu management form
    const addItemForm = document.getElementById("addItemForm");
    addItemForm.classList.remove("hide");
}

function renderMenu() {
    main.innerHTML = ""; // Clear previous menu items
    menuArray.forEach((item, index) => {
        main.innerHTML +=
            `
        <section class="section1">
            <div class="div1">${item.emoji}</div>
            <div class="div2">
                <header class="header1">${item.name}</header>
                <section class="section2">
                    ${item.ingredients.map(ingredient => `
                        <label>
                            <input type="checkbox" name="${ingredient.name}" value="${ingredient.name}">
                            ${ingredient.name}
                        </label>
                    `).join('')}
                </section>
                <footer class="footer1">${item.price}</footer>
            </div>
            <div class="div3">
                ➕
            </div>
        </section>
        `
    });

    // Add event listener for ordering items using event delegation
    main.addEventListener("click", (event) => {
        if (event.target.classList.contains("div3")) {
            const itemIndex = Array.from(event.target.parentElement.parentElement.children).indexOf(event.target.parentElement);
            orderItem(itemIndex);
        }
    });
}

function orderItem(index) {
    const selectedItem = menuArray[index];
    const selectedIngredients = [];
    const checkboxes = document.querySelectorAll(`.section1:nth-child(${index + 1}) input[type="checkbox"]:checked`);

    checkboxes.forEach(checkbox => {
        selectedIngredients.push(checkbox.value);
    });

    // Check if the item is already in the order
    const existingOrderItem = document.querySelector(`#footerdiv .orderItem[data-index="${index}"]`);
    if (existingOrderItem) {
        // If the item already exists, update its quantity
        const quantityElement = existingOrderItem.querySelector(".quantity");
        const quantity = parseInt(quantityElement.textContent) + 1;
        quantityElement.textContent = quantity;
    } else {
        // Create a new section element for the ordered item
        const newOrderItem = document.createElement('section');
        newOrderItem.classList.add("orderItem");
        newOrderItem.setAttribute("data-index", index);
        newOrderItem.innerHTML =
            `
        <div>
            <div class="big">${selectedItem.name}</div>
            <div class="small">remove</div>
            <div class="quantity">1</div>
        </div>
        <div class="medium">
        ${"$" + selectedItem.price}
        </div>
        <div>
            <span>Ingredients: ${selectedIngredients.join(', ')}</span>
        </div>
        `;

        // Add event listener for removing item
        const removeButton = newOrderItem.querySelector(".small");
        removeButton.addEventListener("click", () => {
            newOrderItem.remove();
            updateTotalCost();
        });

        // Insert the new ordered item into the #footerdiv element
        const footerDiv = document.getElementById("footerdiv");
        footerDiv.appendChild(newOrderItem);
    }

    // Update total cost
    updateTotalCost();
}

function updateTotalCost() {
    let total = 0;
    const costs = footer.querySelectorAll(".orderItem .medium");
    costs.forEach((item) => {
        const quantity = parseInt(item.parentElement.querySelector(".quantity").textContent);
        total += parseFloat(item.innerHTML.replace("$", "")) * quantity;
    });
    document.getElementById("totalCost").innerHTML = "$" + total.toFixed(2);
}

// Event listener for completing order
const orderButton = document.getElementById("button");
orderButton.addEventListener("click", () => {
    showPaymentBar();
});

// Show payment bar
function showPaymentBar() {
    const paymentBar = document.getElementById("paymentBar");
    paymentBar.classList.toggle("hide");
}

// Event listener for payment form submission
const paymentForm = document.querySelector("#paymentBar form");
paymentForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form data
    const formData = new FormData(paymentForm);
    const cardName = formData.get("cardName");
    const cardNumber = formData.get("cardNumber");
    const cvv = formData.get("cvv");

    // Simulate payment processing (replace with actual payment processing logic)
    const paymentResult = await processPayment(cardName, cardNumber, cvv);
    if (paymentResult === "success") {
        // Hide payment bar
        document.getElementById("paymentBar").classList.add("hide");
        // Show order confirmation
        showOrderConfirmation();
    } else {
        alert("Payment failed. Please try again.");
    }
});

// Simulated payment processing function (replace with actual logic)
async function processPayment(cardName, cardNumber, cvv) {
    // Simulate API call to process payment (e.g., using fetch)
    return new Promise(resolve => {
        setTimeout(() => {
            // Simulate successful payment for demonstration purposes
            resolve("success");
        }, 2000); // Simulate 2 seconds delay
    });
}

// Show order confirmation
function showOrderConfirmation() {
    // Show order confirmation message
    const first = document.getElementById("first");
    const last = document.getElementById("last");
    first.classList.toggle("hide");
    last.classList.toggle("hide");
    // Reset total cost
    document.getElementById("totalCost").innerHTML = "$0";
}

// Initialize the menu
renderMenu();
