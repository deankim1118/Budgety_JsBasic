// To-do list
// 1. make Module
// 2. addn event handler
// 3. get the input value
// 4. add the new item into data structure based on type 'inc' or 'exp'
// 5. Calculate the total budget and inc - exp and total percentage and each percetage
// 6. save calculated budget into data structure
// 7. display that data 'inc' and 'exp' in the List
// 9. add the click event on delete button
// 10. remove the deleted item from the data structure
// 11. remove the deleted item from the UI
// 12. Re-calculate the budget and percentage
// 13. display the budget and percentage
// 13. get and display the month and year
// 14. format the number: every 3degit have ','
// 15. improve the UX

// Local Storage
// 1. localStorage.setItem(JSON.stringify(OBJ or Array))
// 2. localStorage.getItem();
// 3. JSON.parse(OBJ or Array)
// 4. Push into original data structure again.
// 5. Display the item
// 자료 구조 잘 만들고 지우던지 저장하던지 제자리에만 잘 가져다 놓으면 된다!!! 제일 중요!! 내 생각엔~~

if (loadedInc !== null) {
  let parsedInc = JSON.parse(loadedInc);
  parsedInc.forEach((obj) => {
    budgetCtrl.addItem('inc', obj.des, obj.value);
    UIctrl.displayItem('inc', obj);
  });
}

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

const BUDGET_LS = 'budget';

const budgetController = (function () {
  function Income(ID, description, value) {
    this.ID = ID;
    this.description = description;
    this.value = value;
  }

  function Expenses(ID, description, value) {
    this.ID = ID;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }

  Expenses.prototype.calcItemPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = '-1';
    }
  };

  Expenses.prototype.getPercentage = function () {
    return this.percentage;
  };

  function calculateTotal(type) {
    let sum = 0;

    data.allItem[type].forEach((element) => {
      sum += element.value;
    });
    data.totals[type] = sum;
  }

  return {
    addItem: function (type, des, value) {
      let ID, newItem;

      // Create new ID
      if (data.allItem[type].length > 0) {
        ID = data.allItem[type].length - 1 + 1;
      } else {
        ID = 0;
      }

      // Create new Item based on Constuctor
      if (type === 'inc') {
        newItem = new Income(ID, des, value);
        data.allItem[type].push(newItem);
      } else if (type === 'exp') {
        newItem = new Expenses(ID, des, value);

        data.allItem[type].push(newItem);
      }
      return newItem;
    },

    saveLS: function (type) {
      localStorage.setItem(type, JSON.stringify(data.allItem[type]));
    },

    getIncLS: function () {
      let loadedInc = localStorage.getItem('inc');
      return loadedInc;
    },

    getExpLS: function () {
      let loadedExp = localStorage.getItem('exp');
      return loadedExp;
    },

    saveBudgetLS: function () {
      let budget = {
        budget: data.budget,
        inc: data.totals.inc,
        exp: data.totals.exp,
        percentage: data.percentage,
      };
      localStorage.setItem(BUDGET_LS, JSON.stringify(budget));
    },

    calcBudget: function () {
      calculateTotal('inc');
      calculateTotal('exp');
      data.budget = data.totals.inc - data.totals.exp;
    },
    getBudget: function () {
      return {
        inc: data.totals.inc,
        exp: data.totals.exp,
        budget: data.budget,
        percentage: data.percentage,
      };
    },

    calcPercentage: function () {
      if (data.totals.inc > 0) {
        let percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        data.percentage = percentage;
      } else {
        data.percentage = '-1';
      }
    },

    calcItemPercentage: function () {
      data.allItem.exp.forEach((element) => {
        element.calcItemPercentage(data.totals.inc);
      });
    },

    getPercentage: function () {
      let allPerc = data.allItem.exp.map((element) => element.getPercentage());

      return allPerc;
    },

    deleteItem: function (type, id) {
      let itemDeleted = data.allItem[type].filter((element) => element.ID != id);
      data.allItem[type] = itemDeleted;
    },

    testing: function () {
      return data;
    },
  };
})();

const UIcontroller = (function () {
  const DOMstring = {
    inputType: '.add__type',
    inputDes: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeList: '.income__list',
    expensesList: '.expenses__list',
    budgetValue: '.budget__value',
    incomeValue: '.budget__income--value',
    expensesValue: '.budget__expenses--value',
    percentages: '.budget__expenses--percentage',
    itemPercentage: '.item__percentage',
    month: '.budget__title--month',
    container: '.container',
  };

  const formatNumber = function (num, type) {
    num = Math.abs(num);
    num = num.toFixed(2);

    return `${type === 'exp' ? '-' : '+'} ${num}`;
  };

  return {
    getInputValue: function () {
      return {
        type: document.querySelector(DOMstring.inputType).value,
        des: document.querySelector(DOMstring.inputDes).value,
        value: parseFloat(document.querySelector(DOMstring.inputValue).value),
      };
    },

    resetInputValue: function () {
      document.querySelector(DOMstring.inputDes).value = '';
      document.querySelector(DOMstring.inputValue).value = '';
    },

    displayItem: function (type, obj) {
      let html, newHtml;

      if (type === 'inc') {
        html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

        newHtml = html.replace(`%id%`, obj.ID);
        newHtml = newHtml.replace(`%des%`, obj.description);
        newHtml = newHtml.replace(`%value%`, formatNumber(obj.value, type));

        document.querySelector(DOMstring.incomeList).insertAdjacentHTML('beforeend', newHtml);
      } else if (type === 'exp') {
        html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">#per#</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;

        newHtml = html.replace(`%id%`, obj.ID);
        newHtml = newHtml.replace(`%des%`, obj.description);
        newHtml = newHtml.replace(`%value%`, formatNumber(obj.value, type));
        if (obj.percentage > 0) {
          newHtml = newHtml.replace(`#per#`, `${obj.percentage}%`);
        } else {
          newHtml = newHtml.replace(`#per#`, '---');
        }

        document.querySelector(DOMstring.expensesList).insertAdjacentHTML('beforeend', newHtml);
      }
    },

    displayBudget: function (obj) {
      let type = obj.budget >= 0 ? 'inc' : 'exp';
      document.querySelector(DOMstring.budgetValue).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstring.incomeValue).textContent = formatNumber(obj.inc, 'inc');
      document.querySelector(DOMstring.expensesValue).textContent = formatNumber(obj.exp, 'exp');
      if (obj.percentage > 0) {
        document.querySelector(DOMstring.percentages).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMstring.percentages).textContent = '---';
      }
    },

    displayItemPercentage: function (percentage) {
      let elements = document.querySelectorAll(DOMstring.itemPercentage);

      Array.prototype.forEach.call(elements, (element, i) => {
        if (percentage[i] > 0) {
          element.textContent = `${percentage[i]}%`;
        } else {
          element.textContent = '---';
        }
      });
    },

    deleteList: function (id) {
      let element = document.getElementById(id);
      element.parentNode.removeChild(element);
    },

    handleChangeEvent: function () {
      const inputField = document.querySelectorAll(
        `${DOMstring.inputType},${DOMstring.inputDes},${DOMstring.inputValue}`
      );
      Array.prototype.forEach.call(inputField, (element) => {
        element.classList.toggle('red-focus');
      });

      document.querySelector(DOMstring.inputBtn).classList.toggle('red');
    },

    displayMonth: function () {
      let now = new Date();

      let year = now.getFullYear();

      document.querySelector(DOMstring.month).textContent = year;
    },

    getDOMstring: function () {
      return DOMstring;
    },
  };
})();

const controller = (function (budgetCtrl, UIctrl) {
  let input, newItem;

  const DOM = UIctrl.getDOMstring();

  function setupEventLister() {
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if ((event.keyCode === 13) | (event.which === 13)) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UIctrl.handleChangeEvent);
  }

  const updateBudget = function () {
    // 1. Calculate and update Budget
    budgetCtrl.calcBudget();
    // 2. Calculate and update Percentage
    budgetCtrl.calcPercentage();
    // 3. Get budget
    let totals = budgetCtrl.getBudget();
    // 4. Display Budget
    UIctrl.displayBudget(totals);
  };

  const updatePercentage = function () {
    // 1. Calculate each expenses item Percentage
    budgetCtrl.calcItemPercentage();
    // 2. Get each item percentage
    let itemPercentage = budgetCtrl.getPercentage();
    // 3. Display the budget
    UIctrl.displayItemPercentage(itemPercentage);
  };

  const loadIncLS = function () {
    let loadedInc = budgetCtrl.getIncLS();

    if (loadedInc !== null) {
      let parsedInc = JSON.parse(loadedInc);
      parsedInc.forEach((obj) => {
        budgetCtrl.addItem('inc', obj.des, obj.value);
        UIctrl.displayItem('inc', obj);
      });
    }
  };

  const loadExpLs = function () {
    let loadedExp = budgetCtrl.getExpLS();
    if (loadedExp !== null) {
      let parsedExp = JSON.parse(loadedExp);
      parsedExp.forEach((obj) => {
        budgetCtrl.addItem('exp', obj.des, obj.value);
        UIctrl.displayItem('exp', obj);
      });
    }
  };

  const loadBudget = function () {
    let loadedBudget = localStorage.getItem('budget');
    if (loadedBudget !== null) {
      let parseBudget = JSON.parse(loadedBudget);

      UIctrl.displayBudget(parseBudget);
    }
  };

  const ctrlAddItem = function () {
    // 1. Get input value
    input = UIctrl.getInputValue();
    if (input.des !== '' && input.value > 0) {
      // 2. Add into Data Structure based on type 'inc' or 'exp'
      newItem = budgetCtrl.addItem(input.type, input.des, input.value);
      UIctrl.resetInputValue();
      // 3. Display the items
      UIctrl.displayItem(input.type, newItem);
      // 4. Calculate and update Budget
      updateBudget();
      updatePercentage();
      // Local Storage
      budgetCtrl.saveLS(input.type);
      budgetCtrl.saveBudgetLS();
    }
  };

  const ctrlDeleteItem = function (event) {
    // 1. Select the target parents ID
    let targetId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    // 2. Delete from data structure
    if (targetId) {
      let splitTarget = targetId.split('-');
      let targetType = splitTarget[0];
      let targetID = splitTarget[1];

      budgetCtrl.deleteItem(targetType, targetID);
      // 3. Delte the list in UI
      UIctrl.deleteList(targetId);
      // 4. Re-calcultate and update budget
      updateBudget();
      updatePercentage();
      // Local Storage
      budgetCtrl.saveLS(targetType);
      budgetCtrl.saveBudgetLS();
    }
  };

  return {
    init: function () {
      console.log('The Sever has started');
      setupEventLister();
      UIctrl.displayMonth();
      UIctrl.displayBudget({
        budget: 0,
        inc: 0,
        exp: 0,
        percentage: -1,
      });
      loadIncLS();
      loadExpLs();
      loadBudget();
    },
  };
})(budgetController, UIcontroller);

controller.init();
