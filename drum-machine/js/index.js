var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}
function Square(props) {
  return React.createElement(
    "button",
    { className: "Square", id: props.value, onClick: props.onClick },
    props.value
  );
}

function Controls(props) {
  return React.createElement(
    "div",
    { id: "keys" },
    React.createElement("p", null, props.keys)
  );
}
var Surface = (function(_React$Component) {
  _inherits(Surface, _React$Component);
  function Surface(props) {
    _classCallCheck(this, Surface);
    var _this = _possibleConstructorReturn(
      this,
      (Surface.__proto__ || Object.getPrototypeOf(Surface)).call(this, props)
    );
    _this.state = {
      keys: [],
      volume: 100
    };

    _this.handleRealKeyPress = _this.handleRealKeyPress.bind(_this);
    return _this;
  }
  _createClass(Surface, [
    {
      key: "componentDidMount",
      value: function componentDidMount() {
        document.addEventListener("keydown", this.handleRealKeyPress);
      }
    },
    {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        document.removeEventListener("keydown", this.handleRealKeyPress);
      }
    },
    {
      key: "handleRealKeyPress",
      value: function handleRealKeyPress(e) {
        if ([81, 87, 69, 65, 83, 68, 90, 88, 67].includes(e.keyCode)) {
          var idName = this.props.keymap.find(function(el) {
            return el.keycode === e.keyCode;
          }).letter;
          var button = document.getElementById(idName);
          button.click();
        }
      }
    },
    {
      key: "handleChange",
      value: function handleChange(event) {
        this.setState({ volume: event.target.value });
      }
    },
    {
      key: "handleClick",
      value: function handleClick(i) {
        var elementData = this.props.keymap.find(function(e) {
          return e.letter === i;
        });
        var id = elementData.id,
          url = elementData.url;
        this.setState({ keys: id });
        var sound = new Audio(url);
        sound.volume = this.state.volume / 100;
        sound.play();
      }
    },
    {
      key: "renderSquare",
      value: function renderSquare(i) {
        var _this2 = this;
        return React.createElement(Square, {
          onClick: function onClick() {
            return _this2.handleClick(i);
          },
          value: i
        });
      }
    },
    {
      key: "render",
      value: function render() {
        return React.createElement(
          "div",
          { className: "App" },
          React.createElement(
            "div",
            { className: "App-root" },
            React.createElement("h2", { id: "title" }, "DRUM MACHINE"),

            React.createElement(
              "div",
              { className: "row-buttons" },
              this.renderSquare("q"),
              this.renderSquare("w"),
              this.renderSquare("e")
            ),

            React.createElement(
              "div",
              { className: "row-buttons" },
              this.renderSquare("a"),
              this.renderSquare("s"),
              this.renderSquare("d")
            ),

            React.createElement(
              "div",
              { className: "row-buttons" },
              this.renderSquare("z"),
              this.renderSquare("x"),
              this.renderSquare("c")
            ),

            React.createElement(
              "div",
              { id: "controls" },
              React.createElement(Controls, { keys: this.state.keys }),
              React.createElement(
                "div",
                { id: "keys" },
                React.createElement("input", {
                  value: this.state.volume,
                  type: "range",
                  min: "1",
                  max: "100",
                  onChange: this.handleChange.bind(this)
                })
              )
            )
          )
        );
      }
    }
  ]);
  return Surface;
})(React.Component);

var keymap = [
  {
    letter: "q",
    keycode: 81,
    id: "Open-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
  },

  {
    letter: "w",
    keycode: 87,
    id: "Closed-HH",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
  },

  {
    letter: "e",
    keycode: 69,
    id: "Kick-and-Hat",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"
  },

  {
    letter: "a",
    keycode: 65,
    id: "Punchy-Kick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3"
  },

  {
    letter: "s",
    keycode: 83,
    id: "Kick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
  },

  {
    letter: "d",
    keycode: 68,
    id: "Snare",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"
  },

  {
    letter: "z",
    keycode: 90,
    id: "Side-Stick",
    url: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3"
  },

  {
    letter: "x",
    keycode: 88,
    id: "Clap",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
  },

  {
    letter: "c",
    keycode: 67,
    id: "Shaker",
    url: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3"
  }
];

ReactDOM.render(
  React.createElement(Surface, { keymap: keymap }),
  document.getElementById("root")
);
