// BUDGET CONTROLLER
const budgetController = (function () {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = function (type) {
    let sum = 0;
    data.allItem[type].forEach((element) => {
      sum += element.value;
    });
    data.totals[type] = sum;
  };

  let data = {
    allItem: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, des, val) {
      let newItem;

      // Create new ID
      if (data.allItem[type].length > 0) {
        ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Create newItem instance based on input.type of 'exp' and 'inc'
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      // Push the newItem into the data structure
      data.allItem[type].push(newItem);

      // Return the new element
      return newItem;
    },
    calculateBudget: function () {
      // Calculate the total
      calculateTotal('inc');
      calculateTotal('exp');
      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
    deleteItem: function (type, id) {
      // let newDeletedItem = data.allItem[type].filter(
      //   (element) => element.id !== id
      // );
      // data.allItem[type] = newDeletedItem;
      const ids = data.allItem[type].map((element) => element.id);
      const index = ids.indexOf(id);

      if (index !== -1) {
        data.allItem[type].splice(index, 1);
      }
    },
    testing: function () {
      return data;
    },
  };
})();

// UI CONTROLLER
const UIController = (function () {
  const DOMstring = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputBtn: '.add__value',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
  };
  // 1. Get the field input value
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstring.inputType).value,
        description: document.querySelector(DOMstring.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstring.inputBtn).value),
      };
    },

    addListItem: function (obj, type) {
      let html, newHtml, element;

      if (type === 'inc') {
        element = DOMstring.incomeContainer;
        // Create HTML string with placeholder text(%%)
        html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === 'exp') {
        element = DOMstring.expensesContainer;
        // Create HTML string with placeholder text(%%)
        html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      }
      // Replace the placeholder with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      // Insert the HTML into the DOM
      document
        .querySelector(element)
        .insertAdjacentHTML('beforebegin', newHtml);
    },

    clearFields: function () {
      const inputFields = document.querySelectorAll(
        `${DOMstring.inputDescription},${DOMstring.inputBtn}`
      );

      const fieldsArr = Array.prototype.slice.call(inputFields);
      fieldsArr.forEach((element) => {
        element.value = '';
      });
      fieldsArr[0].focus();
    },
    displayBudget: function (obj) {
      document.querySelector(DOMstring.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstring.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstring.expensesLabel).textContent =
        obj.totalExp;
      if (obj.percentage > 0) {
        document.querySelector(
          DOMstring.percentageLabel
        ).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMstring.percentageLabel).textContent = '---';
      }
    },
    getDOMstring: function () {
      return DOMstring;
    },
  };
})();

// GLOBAL CONTROLLER
const controller = (function (butgetCtrl, UICtrl) {
  const setupEventListeners = function () {
    const DOM = UICtrl.getDOMstring();

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener('click', ctrlDeleteItem);
  };

  let updateBudget = function () {
    // 1. Calculate the budget
    butgetCtrl.calculateBudget();
    // 2. Return the budget
    let budget = butgetCtrl.getBudget();
    // 3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  let ctrlAddItem = function () {
    let input, newItem;

    // 1. Get the field input value
    input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the butget controller
      newItem = butgetCtrl.addItem(input.type, input.description, input.value);
      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      // 4. Clear the input field
      UICtrl.clearFields();
      // 5. Calculate and Update Budget
      updateBudget();
    }
  };

  let ctrlDeleteItem = function (event) {
    let itemID, splitID, type, ID;

    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      // inc-1 or exp-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // 1. delete the item from the data structure
      butgetCtrl.deleteItem(type, ID);
      // 2. Delete the item from the UI

      // 3. Update and show the new budget
    }
  };

  return {
    init: function () {
      console.log('init has started');
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });
    },
  };
})(budgetController, UIController);

controller.init();
