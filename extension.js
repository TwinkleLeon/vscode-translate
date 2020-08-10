// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode')
var handlers = require('./js/handlers.js')
var translate = require('google-translate-open-api').default
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "translate" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('translate.variable', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
    vscode.window.showInformationMessage('翻译中...');
    textFunctions()
	});

	context.subscriptions.push(disposable);
}

async function textFunctions() {
  var Window = vscode.window
  if (!vscode.window.activeTextEditor) {
      vscode.window.showInformationMessage('Open a file first to manipulate text selections');
      return;
  }
  // var items = [];
  // items.push({ label: "ch to en", description: "Convert [你好] to [hello]" });
  // Window.showQuickPick(items).then(async function (selection) {
  //     if (!selection) {
  //         return;
  //     }
  var edit = Window.activeTextEditor;
  var selectVal = edit.selections;
  var documentData = edit._documentData._lines
  var strResult = []
  selectVal.forEach(selectItem => {
    var start = selectItem.start
    var end = selectItem.end
    var startLineStr = documentData[start.line]
    var endLineStr = documentData[end.line]
    var totalStr = startLineStr
    var totalStartIndex = start.character
    var totalEndIndex = end.character
    if(start.line !== end.line){
      documentData.forEach((lineItem,lineIndex) => {
        (lineIndex > start.line && lineIndex <= end.line) && ( totalStr += lineItem )
      });
      totalEndIndex = totalStr.length - endLineStr.length + end.character + 1
    }
    console.log('totalStr',totalStr)
    console.log('totalStartIndex',totalStartIndex)
    console.log('totalEndIndex',totalEndIndex)
    strResult.push(totalStr.substr(totalStartIndex,totalEndIndex))
  });
  for(var i = 0; i <= strResult.length -1; i++){
    var resItem = strResult[i]
    var result = await translate(resItem, {
      tld: "com",
      to: "en",
    });
    var data = result.data[0];
    console.log('data',data)
    //转成驼峰
    data = data.replace(/(\s([a-zA-Z]{1}))/g,function(){
        return arguments[2].toUpperCase()
    })
    //首字母小写
    data = data.replace(/([a-zA-Z]{1})/,function(){
      return arguments[0].toLowerCase()
  })
  }
  handlers.chToEn(edit, selectVal, data)
  vscode.window.showInformationMessage('翻译完成...');
      // switch (selection.label) {
      //     case "ch to en":
      //         handlers.chToEn(edit, selectVal, data);
      //         break;
      //     default:
      //         console.log("hum this should not have happend - no selection");
      //         break;
      // }
  // });
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports =  {
	activate,
	deactivate
}
