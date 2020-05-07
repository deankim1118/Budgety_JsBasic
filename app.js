// BUDGET CONTROLLER
const budgetController = (function () {
  // Some code
})();

// UI CONTROLLER
const UIController = (function () {
  // Some code
})();

// GLOBAL CONTROLLER
const controller = (function (butgetCtrl, UICtrl) {
  let ctrlAddItem = function () {
    // 1. Get the field input value
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
