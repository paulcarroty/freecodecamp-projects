var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var App = function (_React$Component) {_inherits(App, _React$Component);
  function App(props) {_classCallCheck(this, App);var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this,
    props));

    _this.state = {
      markdown: '' };


    _this.changeText = _this.changeText.bind(_this);return _this;
  }_createClass(App, [{ key: "componentDidMount", value: function componentDidMount()

    {
      this.setState({
        markdown: "# Welcome!\n\n## Markdown is funny!\n\nYou can easily create **bold** and *italic* words!\n\n### Want a list? No problemo!\n\n1. One\n2. Two\n* Three\n\n![Image](https://media.giphy.com/media/uos5sW7pBy5W0/giphy.gif)\n\nCoded with \u2764 & \u2615 by [@ paulcarroty](https://github.com/paulcarroty)" });
















    } }, { key: "changeText", value: function changeText(

    event) {
      this.setState({
        markdown: event.target.value });


    } }, { key: "render", value: function render()

    {

      return (
        React.createElement("div", { className: "container" },
          React.createElement("div", { id: "markdown" },
            React.createElement("textarea", { name: "", id: "textarea", cols: "30", rows: "10", onChange: this.changeText, value: this.state.markdown })),


          React.createElement("div", { id: "middle" }),




          React.createElement("div", { id: "render", dangerouslySetInnerHTML: { __html: marked(this.state.markdown) } })));




    } }]);return App;}(React.Component);


ReactDOM.render(
React.createElement(App, null),
document.getElementById('root'));