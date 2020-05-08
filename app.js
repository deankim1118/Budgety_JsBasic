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
        ID = data.allItem[type][allItem[type].length - 1].id + 1;
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
      console.log(data.allItem);
    },
  };
})();

// UI CONTROLLER
const UIController = (function () {
  const DOMstring = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputBtn: '.add__value',
  };
  // 1. Get the field input value
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstring.inputType).value,
        description: document.querySelector(DOMstring.inputDescription).value,
        value: document.querySelector(DOMstring.inputBtn).value,
      };
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

  let ctrlAddItem = function () {
    let input, newItem;

    // 1. Get the field input value
    input = UICtrl.getInput();
    // 2. Add the item to the butget controller
    newItem = butgetCtrl.addItem(input.type, input.description, input.value);
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  return {
    init: function () {
      console.log('init has started');
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
