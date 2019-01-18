var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var

App = function (_React$Component) {_inherits(App, _React$Component);
  function App(props) {_classCallCheck(this, App);var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this,
    props));_this.









    handlePlay = function () {
      _this.setState({ isRunning: true });
      document.getElementById("timecount").style.visibility = "visible";
      document.getElementById("timeLeftText").textContent =
      "Start your tasks now!";
      document.getElementById("timeLeftText").style.color = "#f3f3f3";

      // ternary operator detects runned timers vs restored from pause
      var time =
      _this.state.timeLeft < _this.state.work ?
      _extends({}, _this.state).timeLeft :
      _extends({}, _this.state).timeLeft + _extends({}, _this.state).pause;

      //there's two iterators -time and tv
      // time iterate over whole interval include pause, tV shows only work time
      var timer = setInterval(function () {
        time--;
        var pausetime = _extends({}, _this.state).pause;
        var sec = void 0,min = void 0,tV = void 0;
        if (time > pausetime) {
          sec = (time - pausetime) % 60;
          min = 0;
          // alert(min);
          tV = min > 0 ? min + "m" + sec + "s" : sec + "s";
        } else if (time <= pausetime) {
          sec = time % 60;
          min = 0;
          tV = min > 0 ? min + "m" + sec + "s" : sec + "s";
        }

        _this.setState({ timeLeft: time, timeLeftView: tV });
        console.log(_this.state);

        if (time === _extends({}, _this.state).pause) {
          document.getElementById("timeLeftText").textContent = "Relaxing time!";
          document.getElementById("timeLeftText").style.color = "rgb(50,215,75)";
        } else if (_this.state.isRunning === false) {
          clearInterval(timer);
          // document.getElementById("reset").click()
        } else if (time <= 0) {
          clearInterval(timer);
          document.getElementById("reset").click();
        }
      }, 1000);
    };_this.





    handleReset = function () {
      document.getElementById("timecount").style.visibility = "hidden";
      _this.setState({
        work: 25,
        pause: 5,
        timeLeft: 25,
        timeLeftView: "",
        isRunning: false });

    };_this.state = { work: 25, pause: 5, timeLeft: 25, timeLeftView: "", isRunning: false };return _this;}_createClass(App, [{ key: "handlePause", value: function handlePause() {this.setState({ isRunning: false });} }, { key: "render", value: function render()

    {var _this2 = this;
      return (
        React.createElement("div", { className: "App" },
          React.createElement("header", { className: "App-header", id: "appheader" },
            React.createElement("p", null,
              React.createElement("button", {
                  id: "leftWork",
                  onClick: function onClick() {
                    var nW = _this2.state.work;
                    nW--;
                    if (nW > 0) {
                      _this2.setState({ work: nW, timeLeft: nW });
                    }
                  } }, "\u2B05"), "\xA0Work interval ",



              React.createElement("span", { id: "work" }, this.state.work), "m \xA0",
              React.createElement("button", {
                  id: "rightWork",
                  onClick: function onClick() {
                    var nW = _this2.state.work;
                    nW++;
                    _this2.setState({ work: nW });
                    _this2.setState({ timeLeft: nW });
                  } }, "\u27A1")),




            React.createElement("p", { style: { visibility: "hidden" }, id: "timecount" },
              " ",
              React.createElement("span", { id: "timeLeftText" }, "Start your tasks now!"), " ",
              React.createElement("span", { id: "timeLeft" }, this.state.timeLeftView), " left"),

            React.createElement("h2", null, "POMODORO"),

            React.createElement("p", null,
              React.createElement("button", { id: "play", onClick: function onClick() {return _this2.handlePlay();} }, "\u25B6"), "\xA0",



              React.createElement("button", { id: "pauseButton", onClick: function onClick() {return _this2.handlePause();} }, "\u23F8"), "\xA0",



              React.createElement("button", { id: "reset", onClick: function onClick() {return _this2.handleReset();} }, "\u23F9")),




            React.createElement("p", null,
              React.createElement("button", {
                  id: "leftPause",
                  onClick: function onClick() {
                    var nW = _this2.state.pause;
                    if (nW > 0) {
                      _this2.setState({ pause: --nW });
                    }
                  } }, "\u2B05"), "\xA0Pause time ",



              React.createElement("span", { id: "pause" }, this.state.pause), "m\xA0",
              React.createElement("button", {
                  id: "rightPause",
                  onClick: function onClick() {
                    var nW = _this2.state.pause;
                    _this2.setState({ pause: ++nW });
                  } }, "\u27A1")))));







    } }]);return App;}(React.Component);




ReactDOM.render(React.createElement(App, null), document.getElementById("root"));