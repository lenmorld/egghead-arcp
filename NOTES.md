# Toggle vs Toggle.On when transpiled

//Toggle
ƒ Toggle() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, Toggle);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_ke…
//Toggle.On
ƒ (_ref3) {
  var on = _ref3.on,
      children = _ref3.children;
  return on ? children : null;
}
//Toggle.Off
ƒ (_ref4) {
  var on = _ref4.on,
      children = _ref4.children;
  return on ? null : children;
}
//Toggle.Button
ƒ (_ref5) {
  var on = _ref5.on,
      toggle = _ref5.toggle,
      props = _objectWithoutProperties(_ref5, ["on", "toggle"]);

  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_Swit…