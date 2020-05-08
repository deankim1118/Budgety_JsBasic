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

  let data = {
    allItem: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
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
        html = `<div class="item clearfix" id="income-$%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === 'exp') {
        element = DOMstring.expensesContainer;
        // Create HTML string with placeholder text(%%)
        html = `<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
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
  };

  let updateBudget = function () {
    // 1. Calculate the budget
    // 2. Return the budget
    // 3. Display the budget on the UI
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

  return {
    init: function () {
      console.log('init has started');
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
