const transactionForm = document.querySelector(".transaction-form");
const incomeList = document.querySelector(".income-list");
const expenseList = document.querySelector(".expense-list");
const balance = document.querySelector(".statistics .balance");
const income = document.querySelector(".statistics .income");
const expense  = document.querySelector(".statistics .expense");

let transactions = localStorage.getItem("transactions") !== null ? JSON.parse(localStorage.getItem("transactions")): [];

function updateStatistics()
{
    const updatedIncome = transactions
                          .filter(transaction => transaction.amount >0)
                          .reduce((total,transaction) => total += transaction.amount,0);
    const updateExpense = Math.abs(transactions
                                    .filter(transaction => transaction.amount < 0)
                                    .reduce((total,transaction) => total += transaction.amount,0));
    const updatedBalance = updatedIncome - updateExpense;
    balance.innerHTML = `Balance: &#x20B9; ${updatedBalance}`;
    income.innerHTML = `Income: &#x20B9; ${updatedIncome}`;
    expense.innerHTML = `Expense: &#x20B9; ${updateExpense}`
}

function generateTemplate(id, source, amount, time)
{
    return `<li class="transaction-item" data-id="${id}">
    <p><span>${source}</span>
        <span id="time">${time}</span></p>
    <span>&#x20B9;${Math.abs(amount)}</span>
    <i class="bi bi-trash-fill delete"></i>
    </li>`;
}

function addTransactionDom(id, source, amount, time)
{
    if (amount > 0)
    {  
        incomeList.innerHTML += generateTemplate(id, source, amount, time);     
    }
    else{
        expenseList.innerHTML += generateTemplate(id, source, amount, time); 
    }
}

function addTransaction(source,amount){
    const timeNow = new Date();
    const transaction = {
        id: Math.floor(Math.random()*100000),
        source,
        amount,
        time:`${timeNow.toLocaleTimeString()}  ${timeNow.toLocaleDateString()}`
    };
    transactions.push(transaction);
    localStorage.setItem("transactions",JSON.stringify(transactions));
    addTransactionDom(transaction.id,source,amount,transaction.time);
}

transactionForm.addEventListener("submit",event => {
    event.preventDefault();
    console.log(transactionForm.label.value, transactionForm.amount.value);
    if (transactionForm.label.value == "" || transactionForm.amount.value == "")
    {
        return alert("Please, enter proper values!");
    }
    addTransaction(transactionForm.label.value.trim(),Number(transactionForm.amount.value));
    transactionForm.reset();
    updateStatistics();
});

function getTransaction()
{
    transactions.forEach(transaction => {
        if (transaction.amount > 0)
        {
            incomeList.innerHTML += generateTemplate(transaction.id,transaction.source,transaction.amount,transaction.time);
        }
        else{
            expenseList.innerHTML += generateTemplate(transaction.id,transaction.source,transaction.amount,transaction.time);

        }
    });
    updateStatistics();
}

function deleteTransaction(id)
{
    transactions = transactions.filter(transaction => {
      return transaction.id !== id;
    });
    localStorage.setItem("transactions",JSON.stringify(transactions));
    updateStatistics();
}

incomeList.addEventListener("click", event => {
    if(event.target.classList.contains("delete"))
    {
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        event.target.parentElement.remove();
    }
});

expenseList.addEventListener("click", event => {
    if(event.target.classList.contains("delete"))
    {    
        deleteTransaction(Number(event.target.parentElement.dataset.id));
        event.target.parentElement.remove(); 
    }
});

getTransaction();


