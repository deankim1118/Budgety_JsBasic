let budgetController = (function () {
  let b = 5;
})();

let UIController = (function () {
  let a = 10;
})();

let controller = (function (butgetCtrl, UICtrl) {
  let a = 10 + b;
})(budgetController, UIController);
