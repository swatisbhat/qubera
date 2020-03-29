/** module pattern - using IIFE and the power of closures
// module - App Controller - appController
var appController = (function() {
	// add private variables and methods here
	var x = 23;

	var add = function(a) {
		return x + a;
	};

	// add publicly available methods here
	return {
		publicAddFunc: function(b) {
			console.log(add(b));
		}
	};
})();
*/

// Data Controller
var budgetController = (function() {
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	// data structure to hold all data
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};

	return {
		addItem: function(type, desc, val) {
			var newItem, ID;

			// create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// create new income/expense item
			if (type === 'exp') {
				newItem = new Expense(ID, desc, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, desc, val);
			}

			// update data structure containing app data
			data.allItems[type].push(newItem);
			return newItem;
		},

		testing: function() {
			console.log(data);
		}
	};
})();

// UI Controller
var UIController = (function() {
	var DOMstrings = {
		inputType: '.add__type',
		inputDesc: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list'
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value,
				desc: document.querySelector(DOMstrings.inputDesc).value,
				value: document.querySelector(DOMstrings.inputValue).value
			};
		},

		addListItem: function(obj, type) {
			console.log(obj, type);
			var html, newHtml, element;
			// create html string with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;

				html =
					'<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expenseContainer;

				html =
					'<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// replace placeholder text with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			// insert the html into the DOM
			document
				.querySelector(element)
				.insertAdjacentHTML('beforeend', newHtml);
		},

		clearFields: function() {
			var fields, fieldsArr;

			fields = document.querySelectorAll(
				DOMstrings.inputDesc + ', ' + DOMstrings.inputValue
			);

			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current, index, array) {
				current.value = '';
			});

			fieldsArr[0].focus();
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
		document
			.querySelector(DOM.inputBtn)
			.addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function(event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	};

	var ctrlAddItem = function() {
		var input, newItem;

		// 1. Get input data
		input = UIController.getInput();

		// 2. Add item to budget controller
		newItem = budgetController.addItem(input.type, input.desc, input.value);

		// 3. Add item to UI
		UIController.addListItem(newItem, input.type);
		UIController.clearFields();

		// 4. Calculate budget

		// 5. Display budget on UI
	};

	return {
		init: function() {
			console.log('Application has started.');
			setupEventListeners();
		}
	};
})(budgetController, UIController);

appController.init();
