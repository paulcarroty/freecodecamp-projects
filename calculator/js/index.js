var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}
var Calc = function Calc(props) {
    var infList = props.infList;
    var listItems = infList.map(function (number) {

        var revenue = Math.floor((1 - number / 100) * props.deposit * Math.pow(1 + 0.805 * props.percent / (100 * 12), props.time));

        if (props.deposit > 0) {
            return revenue > props.deposit ?
            React.createElement("p", { key: number.toString() }, "Inflation \uD83E\uDC53", number, "%: ", React.createElement("span", { className: "Green" }, React.createElement("strong", null, revenue))) :

            revenue == 0 || revenue == undefined ?

            React.createElement("p", { key: number.toString() }, " Inflation \uD83E\uDC53", number, " % : ", React.createElement("span", { className: "Hide" }, React.createElement("strong", null, revenue)), " ") :

            React.createElement("p", { key: number.toString() }, " Inflation \uD83E\uDC53", number, "%: ", React.createElement("span", { className: "Red" }, React.createElement("strong", null, revenue)), " ");

        }

    });
    return (
        React.createElement("ul", null, listItems));


};var

App = function (_React$Component) {_inherits(App, _React$Component);
    function App(props) {_classCallCheck(this, App);var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this,
        props));
        _this.state = { deposit: '', time: '', percent: '' };
        _this.handleDepChange = _this.handleDepChange.bind(_this);
        _this.handleTimeChange = _this.handleTimeChange.bind(_this);
        _this.handlePercChange = _this.handlePercChange.bind(_this);return _this;
    }_createClass(App, [{ key: "handleDepChange", value: function handleDepChange(
        event) {
            this.setState({ deposit: event.target.value });
        } }, { key: "handleTimeChange", value: function handleTimeChange(
        event) {
            this.setState({ time: event.target.value });
        } }, { key: "handlePercChange", value: function handlePercChange(
        event) {
            this.setState({ percent: event.target.value });
        } }, { key: "render", value: function render()
        {
            return React.createElement("div", null,

                React.createElement("div", null,
                    React.createElement("header", { className: "App-header" },
                        React.createElement("p", null, "You want to calculate possible inflation risks for your deposits? Here we go!"))),






                React.createElement("div", { className: "Deposit" },
                    React.createElement("ul", null,
                        React.createElement("li", null, React.createElement("p", null, "I want to make a deposit: ", React.createElement("input", { type: "number", value: this.state.deposit, onChange: this.handleDepChange, placeholder: "1000" }))),
                        React.createElement("li", null, React.createElement("p", null, "For a time in months: ", React.createElement("input", { type: "number", value: this.state.time, onChange: this.handleTimeChange, placeholder: "6" }))),
                        React.createElement("li", null, React.createElement("p", null, "With percent: ", React.createElement("input", { type: "number", step: "0.01", value: this.state.percent, onChange: this.handlePercChange, placeholder: "14.5" }))))),



                React.createElement("div", { className: "Revenue" },
                    React.createElement("h3", null, "Revenue"),

                    React.createElement(Calc, { deposit: this.state.deposit, percent: this.state.percent, time: this.state.time, infList: [].concat(_toConsumableArray(Array(21).keys())) })));





        } }]);return App;}(React.Component);


ReactDOM.render(
React.createElement(App, null),
document.getElementById('root'));