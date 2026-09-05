let members = JSON.parse(localStorage.getItem("members")) || [];
let meals = JSON.parse(localStorage.getItem("meals")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let payments = JSON.parse(localStorage.getItem("payments")) || [];


// ==========================
// MONTH
// ==========================

function getSelectedMonth() {

    let month = document.getElementById("selectedMonth").value;

    if (month === "") {

        let today = new Date();

        month =
            today.getFullYear() +
            "-" +
            String(today.getMonth() + 1).padStart(2, "0");

        document.getElementById("selectedMonth").value = month;
    }

    return month;
}

function isSameMonth(date) {

    return date.startsWith(getSelectedMonth());

}


// ==========================
// SAVE
// ==========================

function saveData() {

    localStorage.setItem("members", JSON.stringify(members));
    localStorage.setItem("meals", JSON.stringify(meals));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("payments", JSON.stringify(payments));

}


// ==========================
// MEMBER
// ==========================

function addMember() {

    let name =
        document.getElementById("memberName").value.trim();

    if (name === "") {
        alert("Enter member name");
        return;
    }

    members.push({
        id: Date.now(),
        name: name
    });

    document.getElementById("memberName").value = "";

    saveData();
    updateAll();
}


function deleteMember(id) {

    members = members.filter(member => member.id !== id);

    saveData();
    updateAll();
}


// ==========================
// MEAL
// ==========================

function addMeal() {

    let date =
        document.getElementById("mealDate").value;

    let member =
        document.getElementById("mealMember").value;

    let type =
        document.getElementById("mealType").value;

    let amount =
        Number(document.getElementById("mealAmount").value);

    if (date === "" || member === "") {

        alert("Select date and member");
        return;
    }

    meals.push({
        id: Date.now(),
        date: date,
        member: member,
        type: type,
        amount: amount
    });

    saveData();
    updateAll();
}


// ==========================
// EXPENSE
// ==========================

function addExpense() {

    let date =
        document.getElementById("expenseDate").value;

    let description =
        document.getElementById("expenseDescription").value.trim();

    let amount =
        Number(document.getElementById("expenseAmount").value);

    let payer =
        document.getElementById("expensePayer").value;

    if (
        date === "" ||
        description === "" ||
        amount <= 0 ||
        payer === ""
    ) {
        alert("Fill all expense information");
        return;
    }

    expenses.push({
        id: Date.now(),
        date: date,
        description: description,
        amount: amount,
        payer: payer
    });

    document.getElementById("expenseDescription").value = "";
    document.getElementById("expenseAmount").value = "";

    saveData();
    updateAll();
}


// ==========================
// PAYMENT
// ==========================

function addPayment() {

    let member =
        document.getElementById("paymentMember").value;

    let amount =
        Number(document.getElementById("paymentAmount").value);

    if (member === "" || amount <= 0) {

        alert("Select member and enter amount");
        return;
    }

    payments.push({
        id: Date.now(),
        member: member,
        amount: amount,
        date: getSelectedMonth()
    });

    document.getElementById("paymentAmount").value = "";

    saveData();
    updateAll();
}


// ==========================
// DROPDOWNS
// ==========================

function updateDropdowns() {

    let ids = [
        "mealMember",
        "expensePayer",
        "paymentMember"
    ];

    ids.forEach(id => {

        let select =
            document.getElementById(id);

        let first =
            select.options[0];

        select.innerHTML = "";

        select.appendChild(first);

        members.forEach(member => {

            let option =
                document.createElement("option");

            option.value = member.name;
            option.textContent = member.name;

            select.appendChild(option);

        });

    });
}


// ==========================
// MEMBERS DISPLAY
// ==========================

function updateMembers() {

    let list =
        document.getElementById("memberList");

    list.innerHTML = "";

    members.forEach(member => {

        let li =
            document.createElement("li");

        li.innerHTML = `
            ${member.name}
            <button class="delete-btn"
            onclick="deleteMember(${member.id})">
            Delete
            </button>
        `;

        list.appendChild(li);

    });
}


// ==========================
// MEALS DISPLAY
// ==========================

function updateMeals() {

    let list =
        document.getElementById("mealList");

    list.innerHTML = "";

    meals
        .filter(meal => isSameMonth(meal.date))
        .slice()
        .reverse()
        .forEach(meal => {

            let div =
                document.createElement("div");

            div.className = "item";

            div.textContent =
                `📅 ${meal.date} | 👤 ${meal.member} | ${meal.type} | 🍚 ${meal.amount} meal`;

            list.appendChild(div);
        });
}


// ==========================
// EXPENSE DISPLAY
// ==========================

function updateExpenses() {

    let list =
        document.getElementById("expenseList");

    list.innerHTML = "";

    expenses
        .filter(expense => isSameMonth(expense.date))
        .slice()
        .reverse()
        .forEach(expense => {

            let div =
                document.createElement("div");

            div.className = "item";

            div.textContent =
                `📅 ${expense.date} | 🛒 ${expense.description} | 💰 ৳${expense.amount} | 👤 ${expense.payer}`;

            list.appendChild(div);
        });
}


// ==========================
// PAYMENT DISPLAY
// ==========================

function updatePayments() {

    let list =
        document.getElementById("paymentList");

    list.innerHTML = "";

    let selectedMonth =
        getSelectedMonth();

    payments
        .filter(payment => payment.date === selectedMonth)
        .slice()
        .reverse()
        .forEach(payment => {

            let div =
                document.createElement("div");

            div.className = "item";

            div.textContent =
                `👤 ${payment.member} | 💰 ৳${payment.amount}`;

            list.appendChild(div);
        });
}


// ==========================
// DASHBOARD
// ==========================

function updateDashboard() {

    let selectedMonth =
        getSelectedMonth();

    let monthMeals =
        meals.filter(meal =>
            meal.date.startsWith(selectedMonth)
        );

    let monthExpenses =
        expenses.filter(expense =>
            expense.date.startsWith(selectedMonth)
        );

    let totalMeal =
        monthMeals.reduce(
            (sum, meal) =>
                sum + Number(meal.amount), 0
        );

    let totalExpense =
        monthExpenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount), 0
        );

    let mealRate =
        totalMeal > 0
            ? totalExpense / totalMeal
            : 0;

    document.getElementById("totalMembers").textContent =
        members.length;

    document.getElementById("totalMeal").textContent =
        totalMeal;

    document.getElementById("totalExpense").textContent =
        "৳" + totalExpense.toFixed(2);

    document.getElementById("mealRate").textContent =
        "৳" + mealRate.toFixed(2);
}


// ==========================
// SUMMARY
// ==========================

function updateSummary() {

    let selectedMonth =
        getSelectedMonth();

    let monthMeals =
        meals.filter(meal =>
            meal.date.startsWith(selectedMonth)
        );

    let monthExpenses =
        expenses.filter(expense =>
            expense.date.startsWith(selectedMonth)
        );

    let totalMeal =
        monthMeals.reduce(
            (sum, meal) =>
                sum + Number(meal.amount), 0
        );

    let totalExpense =
        monthExpenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount), 0
        );

    let mealRate =
        totalMeal > 0
            ? totalExpense / totalMeal
            : 0;

    let table =
        document.getElementById("summaryTable");

    table.innerHTML = "";

    members.forEach(member => {

        let memberMeal =
            monthMeals
                .filter(meal =>
                    meal.member === member.name
                )
                .reduce(
                    (sum, meal) =>
                        sum + Number(meal.amount), 0
                );

        let memberCost =
            memberMeal * mealRate;

        let memberPaid =
            payments
                .filter(payment =>
                    payment.member === member.name &&
                    payment.date === selectedMonth
                )
                .reduce(
                    (sum, payment) =>
                        sum + Number(payment.amount), 0
                );

        let balance =
            memberPaid - memberCost;

        let row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${member.name}</td>
            <td>${memberMeal}</td>
            <td>৳${memberCost.toFixed(2)}</td>
            <td>৳${memberPaid.toFixed(2)}</td>
            <td>৳${balance.toFixed(2)}</td>
        `;

        table.appendChild(row);

    });
}


// ==========================
// CLEAR DATA
// ==========================

function clearAllData() {

    if (!confirm("Delete ALL data?")) {
        return;
    }

    members = [];
    meals = [];
    expenses = [];
    payments = [];

    saveData();
    updateAll();
}


// ==========================
// UPDATE EVERYTHING
// ==========================

function updateAll() {

    updateMembers();
    updateDropdowns();
    updateMeals();
    updateExpenses();
    updatePayments();
    updateDashboard();
    updateSummary();

}


// ==========================
// START
// ==========================

updateAll();