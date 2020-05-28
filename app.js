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
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalInc) {
		if (totalInc > 0) {
			this.percentage = Math.round((this.value / totalInc) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(curr) {
			sum = sum + curr.value;
		});
		data.totals[type] = sum;
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
		},
		budget: 0,
		percentage: -1
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

		deleteItem: function(type, id) {
			var ids, index;

			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		calculateBudget: function() {
			calculateTotal('inc');
			calculateTotal('exp');

			data.budget = data.totals.inc - data.totals.exp;

			if (data.totals.inc > 0) {
				data.percentage = Math.round(
					(data.totals.exp / data.totals.inc) * 100
				);
			} else {
				data.percentage = -1;
			}
		},

		calculatePercentages: function() {
			data.allItems.exp.forEach(function(curr) {
				curr.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function() {
			var allPerc = data.allItems.exp.map(function(curr) {
				return curr.getPercentage();
			});
			return allPerc;
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
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
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expPercentageLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};

	var formatNumber = function(num, type) {
		var numSplit, int, dec;
		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');
		int = numSplit[0];
		dec = numSplit[1];
		if (int.length > 3) {
			int =
				int.substr(0, int.length - 3) +
				',' +
				int.substr(int.length - 3, 3);
		}
		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
	};

	// function definition
	var nodeListForEach = function(list, callback) {
		for (var i = 0; i < list.length; i++) {
			callback(list[i], i);
		}
	};

	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMstrings.inputType).value,
				desc: document.querySelector(DOMstrings.inputDesc).value,
				value: parseFloat(
					document.querySelector(DOMstrings.inputValue).value
				)
			};
		},

		addListItem: function(obj, type) {
			var html, newHtml, element;
			// create html string with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;

				html =
					'<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expenseContainer;

				html =
					'<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// replace placeholder text with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			// insert the html into the DOM
			document
				.querySelector(element)
				.insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function(selectorID) {
			var el;
			el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
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

		displayBudget: function(obj) {
			var type;
			obj.budget >= 0 ? (type = 'inc') : (type = 'exp');
			document.querySelector(
				DOMstrings.budgetLabel
			).textContent = formatNumber(obj.budget, type);
			document.querySelector(
				DOMstrings.incomeLabel
			).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(
				DOMstrings.expensesLabel
			).textContent = formatNumber(obj.totalExp, 'exp');

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent =
					obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent =
					'---';
			}
		},

		displayPercentages: function(percentages) {
			var fields = document.querySelectorAll(
				DOMstrings.expPercentageLabel
			);

			// custom forEach function
			// passing a function as callback function argument
			nodeListForEach(fields, function(current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}
			});
		},

		displayMonth: function() {
			var now, year, month, months;
			now = new Date();
			year = now.getFullYear();
			months = [
				'January',
				'February',
				'March',
				'April',
				'May',
				'June',
				'July',
				'August',
				'September',
				'October',
				'November',
				'December'
			];
			month = now.getMonth();
			document.querySelector(DOMstrings.dateLabel).textContent =
				months[month] + ' ' + year;
		},

		changeType: function() {
			var fields = document.querySelectorAll(
				DOMstrings.inputType +
					',' +
					DOMstrings.inputDesc +
					',' +
					DOMstrings.inputValue
			);
			nodeListForEach(fields, function(curr) {
				curr.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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

		document
			.querySelector(DOM.container)
			.addEventListener('click', ctrlDeleteItem);

		document
			.querySelector(DOM.inputType)
			.addEventListener('change', UIController.changeType);
	};

	var updateBudget = function() {
		// 1. Calculate budget
		budgetController.calculateBudget();

		// 2. Return the budget
		var budget = budgetController.getBudget();

		// 3. Display budget on UI
		UIController.displayBudget(budget);
	};

	var updatePercentages = function() {
		// 1. Calculate percentage
		budgetController.calculatePercentages();

		// 2. Read percentages from the budget controller
		var percentages = budgetController.getPercentages();

		// 3. Update UI with new percentages
		UIController.displayPercentages(percentages);
	};

	var ctrlAddItem = function() {
		var input, newItem;

		// 1. Get input data
		input = UIController.getInput();

		if (input.desc !== '' && !isNaN(input.value) && input.value > 0) {
			// 2. Add item to budget controller
			newItem = budgetController.addItem(
				input.type,
				input.desc,
				input.value
			);

			// 3. Add item to UI
			UIController.addListItem(newItem, input.type);

			// 4. Clear the fields
			UIController.clearFields();

			// 5. Calculate and update budget
			updateBudget();

			// 6. Calculate and update percentages
			updatePercentages();
		}
	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			// 1. Delete item from data structure
			budgetController.deleteItem(type, ID);

			// 2. Delete item from UI
			UIController.deleteListItem(itemID);

			// 3. Update and show the new budget
			updateBudget();

			// 4. Calculate and update percentages
			updatePercentages();
		}
	};

	return {
		init: function() {
			console.log('Application has started.');
			UIController.displayMonth();
			UIController.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};
})(budgetController, UIController);

appController.init();
