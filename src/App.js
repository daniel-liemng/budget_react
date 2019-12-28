import React, { useState, useEffect } from "react";
import "./App.css";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Alert from "./components/Alert";
import uuid from "uuid";

// data
// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1600 },
//   { id: uuid(), charge: "buy car", amount: 400 },
//   { id: uuid(), charge: "watch TV", amount: 1200 }
// ];

// Use localStorage instead
// check if expenses exists in localStorage
const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

function App() {
  // BASIC OF useState
  // console.log(useState());
  // const result = useState(initialExpenses);
  // const expenses = result[0];
  // const setExpenses = result[1];
  // console.log(expenses, setExpenses);

  // ***** state values *****
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  // single expense
  const [charge, setCharge] = useState("");
  // single amount
  const [amount, setAmount] = useState("");
  // alert
  const [alert, setAlert] = useState({ show: false });
  // edit
  const [edit, setEdit] = useState(false);
  // id
  const [id, setId] = useState(0);

  // ***** useEffect *****
  useEffect(() => {
    console.log("useEffect");
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ***** functionality *****
  const handleCharge = e => {
    // console.log(`charge : ${e.target.value}`);
    setCharge(e.target.value);
  };

  const handleAmount = e => {
    // console.log(`amount : ${e.target.value}`);
    setAmount(e.target.value);
  };

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 3000);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // console.log(charge, amount);

    //check valid input for charge and amount
    if (charge !== "" && amount > 0) {
      if (edit) {
        // handle edit - EDIT
        // set temp arr with checking the id
        // if id: copy item, override charge and amount
        // if not id: keep same item
        let tempExpenses = expenses.map(item => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        // setEdit to false -> btn text to Submit
        setEdit(false);
        // alert
        handleAlert({ type: "success", text: "Item edited" });
      } else {
        // handle submit - ADD
        const newExpense = { id: uuid(), charge, amount };
        setExpenses([...expenses, newExpense]);
        // show alert after submit OK
        handleAlert({ type: "success", text: "item added" });
      }
      // set FORM to null
      setCharge("");
      setAmount("");
    } else {
      // handle alert called when invalid input
      handleAlert({
        type: "danger",
        text:
          "charge can't be empty value and amount value has to be bigger than 0barhop"
      });
    }
  };

  // clear all items
  const clearItems = () => {
    // console.log("clear all items");
    setExpenses([]);
    // alert
    handleAlert({ type: "danger", text: " all items deleted" });
  };

  // handle Delete
  const handleDelete = id => {
    // console.log("delete item", id);
    const tempExpenses = expenses.filter(item => item.id !== id);
    setExpenses(tempExpenses);
    // alert
    handleAlert({ type: "danger", text: "item deleted" });
  };

  // handle Edit
  const handleEdit = id => {
    // console.log("Edit item", id);
    let expenseToEdit = expenses.find(item => item.id === id);
    // console.log(expenseToEdit);
    let { charge, amount } = expenseToEdit;
    // set values
    setCharge(charge);
    setAmount(amount);
    // change text in Btn to true
    setEdit(true);
    // set id = id in params
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <h1>budget calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleCharge={handleCharge}
          handleAmount={handleAmount}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          clearItems={clearItems}
        />
      </main>
      <h1>
        total spending:{" "}
        <span className="total">
          ${" "}
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
