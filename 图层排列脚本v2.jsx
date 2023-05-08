(function (thisObj) {
  var scriptName = "图层排列";
  var windowName = "图层排列";

  var window = (thisObj instanceof Panel) ? thisObj : new Window("palette", windowName, undefined, { resizeable: true });
  window.alignChildren = "left";
  var creditText = window.add("statictext", undefined, "张珑耀制作");
  creditText.alignment = "center";

  var shapeGroup = window.add("group");
  shapeGroup.add("statictext", undefined, "排列形状：");
  var shapeDropdown = shapeGroup.add("dropdownlist", undefined, ["圆形", "椭圆", "正方形"]);
  shapeDropdown.selection = 0;

  var radiusGroup = window.add("group");
  radiusGroup.add("statictext", undefined, "边长/半径：");
  var radiusInput = radiusGroup.add("edittext", undefined, "200");
  radiusInput.characters = 10;

  var parentGroup = window.add("group");
  parentGroup.add("statictext", undefined, "父级名称：");
  var parentNameInput = parentGroup.add("edittext", undefined, "空对象");
  parentNameInput.characters = 20;

  var button = window.add("button", undefined, "应用");
  button.onClick = function () {
    var selectedLayers = app.project.activeItem.selectedLayers;
    var shape = shapeDropdown.selection.index;
    var length = parseFloat(radiusInput.text);
    var centerX = app.project.activeItem.width / 2;
    var centerY = app.project.activeItem.height / 2;
    var parentName = parentNameInput.text;

    app.beginUndoGroup("Layer Arrange");

    var parentLayer = app.project.activeItem.layers.addNull();
    parentLayer.name = parentName;
    parentLayer.position.setValue([centerX, centerY]);

    for (var i = 0; i < selectedLayers.length; i++) {
      var layer = selectedLayers[i];
      var positionX, positionY;

      if (shape === 0) {
        var angle = (i / selectedLayers.length) * (2 * Math.PI);
        positionX = length * Math.cos(angle);
        positionY = length * Math.sin(angle);
      } else if (shape === 1) {
        var angle = (i / selectedLayers.length) * (2 * Math.PI);
        positionX = length * Math.cos(angle);
        positionY = (length / 2) * Math.sin(angle);
      } else if (shape === 2) {
        var sideLength = Math.ceil(Math.sqrt(selectedLayers.length));
        var rowIndex = Math.floor(i / sideLength);
        var colIndex = i % sideLength;
        positionX = (colIndex - (sideLength - 1) / 2) * length;
        positionY = (rowIndex - (sideLength - 1) / 2) * length;
      }

      layer.property("Position").setValue([positionX, -positionY]);
      layer.setParentWithJump(parentLayer);
    }

    app.endUndoGroup();
  };

  window.onResizing = window.onResize = function () {
    this.layout.resize();
  };

  if (thisObj instanceof Panel) {
    window.layout.layout(true);
    window.layout.resize();
  } else {
    window.center();
    window.show();
  }

})(this);
