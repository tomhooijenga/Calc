(function () {
    "use strict";
    var Calculator = function (element) {
        var self = this;

        this.element = element;
        this.screen = element.getElementsByClassName('screen')[0];

        this.isAnswer = false;

        this.calculation = "0";
        this.calculations = [];
        this.index = null;

        var buttons = this.element.querySelectorAll("button"),
            i,
            length = buttons.length;

        // Add click handler to each button in calc.
        for (i = 0; i < length; i++) {
            buttons[i].addEventListener("click", function () {
                self.buttonPress(this);
            });
        }

        // Add keypress handler to window.
        window.addEventListener("keydown", function (e) {
            var key = e.which || e.keyCode;

            // We shouldn't go back on backspace;
            if (key === 8) {
                e.preventDefault();
            }

            if (e.shiftKey) {
                key = 's' + key;
            }

            self.keyPress(key);
        });
    };

    // Handles buttonpress events.
    Calculator.prototype.buttonPress = function (button) {
        // Checks if button.value is a function of Calculator.
        if (typeof this[button.value] === "function") {
            this[button.value]();
        } else {
            var text = button.innerHTML;

            this.print(text, text, true);
        }
    };

    // Handles keyboard events.
    Calculator.prototype.keyPress = function (key) {
        if (typeof this[this.keyCodes[key]] === "function") {
            this[this.keyCodes[key]]();
        } else if (typeof this.keyCodes[key] === "string") {
            var text = this.keyCodes[key];

            this.print(text, text, true);
        }
    };

    Calculator.prototype.calculate = function () {
        var prev = this.element.getElementsByClassName("prev")[0],
            next = this.element.getElementsByClassName("next")[0];

        // Push to history.
        this.calculations.push({
            screen: this.screen.innerHTML,
            calculation: this.calculation
        });
        // Set index to latest calculation.
        this.index = this.calculations.length;
        prev.disabled = false;
        next.disabled = true;

        // Calc result.
        var result = eval(this.calculation);
        // Round to 12 digits, parseFloat removes trailing 0's.
        result = parseFloat(result.toFixed(12), 10);
        // Add empty string, to make it string.
        this.calculation = this.screen.innerHTML = result + "";

        this.isAnswer = true;
    };

    // Go to previous entry in history.
    Calculator.prototype.prev = function () {
        var prev = this.element.getElementsByClassName("prev")[0],
            next = this.element.getElementsByClassName("next")[0];

        if (prev.disabled === false) {
            // Set index to previous entry.
            if (this.index > 0) {
                this.index--;
            }
            this.screen.innerHTML = this.calculations[this.index].screen;
            this.calculation = this.calculations[this.index].calculation;

            // No previous before this, disable button.
            if (!this.calculations[this.index - 1]) {
                prev.disabled = true;
            }

            // Enable next if theres another entry.
            if (this.calculations[this.index + 1]) {
                next.disabled = false;
            }
        }
    };

    // Go to next entry in history.
    Calculator.prototype.next = function () {
        var prev = this.element.getElementsByClassName("prev")[0],
            next = this.element.getElementsByClassName("next")[0];

        if (next.disabled === false) {
            // Set index to next entry.
            if (this.index <= this.calculations.length - 1) {
                this.index++;
            }

            this.screen.innerHTML = this.calculations[this.index].screen;
            this.calculation = this.calculations[this.index].calculation;


            if (this.calculations[this.index - 1]) {
                prev.disabled = false;
            }
            if (!this.calculations[this.index + 1]) {
                next.disabled = true;
            }

        }
    };

    Calculator.prototype.print = function (display, calculation, clear)
    {
        if (clear && (this.screen.innerHTML === "0" || this.isAnswer)) {
            this.screen.innerHTML = display;
            this.calculation = calculation;
        } else {
            this.screen.innerHTML += display;
            this.calculation += calculation;
        }

        this.isAnswer = false;
    };

    // Reset display.
    Calculator.prototype.clear = function () {
        this.screen.innerHTML = "0";
        this.calculation = "0";
    };

    // Remove last char from display/calculation.
    Calculator.prototype.backspace = function () {
        this.screen.innerHTML = this.screen.innerHTML.slice(0, -1) || "0";
        this.calculation = this.calculation.slice(0, -1) || "0";
    };

    Calculator.prototype.dot = function () {
        var last = this.calculation.match(/([-+]?[0-9]+\.?[0-9]*[eE]?[0-9]*)/g).pop();

        if (last.indexOf('.') === -1)
        {
            this.print('.', '.', false);
        }
    };

    Calculator.prototype.exponent = function () {
        var last = this.calculation.match(/([-+]?[0-9]+\.?[0-9]*[eE]?[0-9]*)/g).pop();

        if (last.indexOf('e') === -1)
        {
            this.print('e', 'e', false);
        }
    };

    Calculator.prototype.pi = function () {
        this.print('&pi;', Math.PI);
    };

    // Various operations.
    Calculator.prototype.plus = function () {
        this.print('+', '+', false);
    };

    Calculator.prototype.minus = function () {
        this.print('-', '-', false);
    };

    Calculator.prototype.divide = function () {
        this.print('&divide;', '/', false);
    };

    Calculator.prototype.multiple = function () {
        this.print('&times;', '*', false);
    };

    // Map keycode to function.
    Calculator.prototype.keyCodes = {
        8: "backspace",
        13: "calculate",
        27: "clear",
        37: "prev",
        39: "next",
        69: "exponent",
        106: "multiple",
        s56: "multiple",
        107: "plus",
        s187: "plus",
        109: "minus",
        189: "minus",
        110: "dot",
        190: "dot",
        111: "divide",
        191: "divide",
        s57: "(",
        s48: ")",
        48: "0", 49: "1", 50: "2", 51: "3", 52: "4", 53: "5", 54: "6", 55: "7", 56: "8", 57: "9",
        96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7", 104: "8", 105: "9"
    };

    window.Calculator = Calculator;
})();