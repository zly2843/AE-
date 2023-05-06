(function(thisObj) {
  var scriptName = "图层圆形排列";
  var windowName = "图层圆形排列";              //这段代码通过一个自执行函数开始，并定义了两个变量scriptName和windowName，分别表示脚本的名称和窗口的名称。
  

  // 创建UI布局
  var window = (thisObj instanceof Panel) ? thisObj : new Window("palette", windowName, undefined, { resizeable: true });
  window.alignChildren = "left";            //这段代码创建一个窗口对象window。如果脚本被作为可停靠面板加载，则将window设置为当前可停靠面板（thisObj）。否则，创建一个新的可调整大小的面板窗口。
  

  var radiusGroup = window.add("group");
  radiusGroup.add("statictext", undefined, "半径：");
  var radiusInput = radiusGroup.add("edittext", undefined, "200");
  radiusInput.characters = 10;              //这段代码在窗口中创建了一个名为radiusGroup的组，并在组中添加了一个静态文本和一个编辑文本框。静态文本显示"半径："，编辑文本框默认值为"200"。

  var button = window.add("button", undefined, "应用");
  button.onClick = function() {
    var selectedLayers = app.project.activeItem.selectedLayers;
    var radius = parseInt(radiusInput.text, 10);
    var centerX = app.project.activeItem.width / 2;
    var centerY = app.project.activeItem.height / 2;
    var angleStep = (2 * Math.PI) / selectedLayers.length;

    app.beginUndoGroup("Circle Arrange");

    for (var i = 0; i < selectedLayers.length; i++) {
      var layer = selectedLayers[i];
      var angle = i * angleStep;
      var positionX = centerX + radius * Math.cos(angle);
      var positionY = centerY + radius * Math.sin(angle);
      layer.property("Position").setValue([positionX, positionY]);
    }

    app.endUndoGroup();
  };                                      //这段代码在窗口中创建了一个名为button的按钮，并为其添加了一个onClick事件处理程序。当按钮被点击时，会执行定义在函数内部的处理逻辑。

  // 将UI布局添加到可停靠面板
  if (window instanceof Panel) {
    window.layout.layout(true);
    window.layout.resize();
    window.onResizing = window.onResize = function() {
      this.layout.resize();
    };
  }                                      //这段代码检查window是否是一个可停靠面板。如果是，调整面板布局并添加了一个onResizing和onResize事件处理程序，以确保面板的布局在调整大小时保持一致。

  // 将可停靠面板添加到AE
  if ((thisObj instanceof Panel) == false) {
    window.center();
    window.show();
  }

})(this);                               //这段代码检查脚本是否作为可停靠面板加载。如果脚本不是作为可停靠面板加载，则将窗口居中并显示。
