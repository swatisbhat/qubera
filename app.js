/** module pattern - using IIFE and the power of closures
// module - App Controller - appController
var appController = (function() {
  var x = 23;

  var add = function(a) {
    return x + a;
  };

  return {
    publicAddFunc: function(b) {
      console.log(add(b));
    }
  };
})();
*/

// Data Controller
var budgetController = (function() {
  // TODO
})();

// UI Controller
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        desc: document.querySelector(DOMstrings.inputDesc).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

// App Controller
var appController = (function(budgetController, UIController) {
  var setupEventListeners = function() {
    var DOM = UIController.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {
    // 1. Get input data
    var input = UIController.getInput();

    // 2. Add item to budget controller
    // 3. Add item to UI
    // 4. Calculate budget
    // 5. Display budget on UI
  };

  return {
    init: function() {
      console.log("Application has started.");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

appController.init();
