// BUDGET CONTROLLER
const budgetController = (function () {
  // Some code
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
  const DOM = UICtrl.getDOMstring();

  let ctrlAddItem = function () {
    // 1. Get the field input value
    let input = UICtrl.getInput();
    console.log(input);
    // 2. Add the item to the butget controller
    // 3. Add the item to the UI
    // 4. Calculate the budget
    // 5. Display the budget on the UI
  };

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
  document.addEventListener('keypress', function (event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
