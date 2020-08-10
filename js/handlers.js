
exports.chToEn = function(e,selectVal,data){
  e.edit( function (edit) {
    edit.replace(selectVal[0], data);
  });
}