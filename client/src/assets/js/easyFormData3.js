/**
 * 簡單轉formData
 * @param {[Any]} data 資料，第一次須為物件
 * @param {[Object]} options 細部設定
 * @param {[String]} property 屬性
 * @param {[Array]} newData 新的資料
 * @param {[Number]} depth 深度
 * @returns 
 */
export default function easyFormData(data = {},options = {}, property = "",newData = [],depth = 0) {
    // 判斷型態
    const typeData = getDataType(data)
    const typeOptions = getDataType(options)

    // 如果是第一次進來，型態必須為物件
    if (typeData !== "object" && depth === 0) throw new Error("only object!!");
    if (typeOptions !== "object") throw new Error("options only object!!");
    const nextDepth = depth + 1;
    switch (typeData) {
      case "array":
        dataIsArray(data,options,property,newData,nextDepth);
        break;
      case "object":
        dataIsObject(data,options,property,newData,nextDepth);
        break;
      default:
        newData.push({
          value: data, // 值
          formDataProperty: `${property}` // formdata屬性
        })
    }
    if(depth === 0){
      const formData = new FormData();
      newData.forEach(function(item){
        formData.append(item.formDataProperty, item.value);
      })
      return formData
    }
}

// 取得型態
function getDataType(data){
  // 判斷型態
  const type = typeof data;
  let realType = ""; // 真正的型態
  if (type === "object") {
    //如果是物件，就要判斷事物件、陣列，還是檔案
    // 是陣列
    if (Array.isArray(data)) realType = "array";
    // 是檔案
    else if (data instanceof Blob) realType = "file";
    // 是物件
    else realType = "object";
  } else {
    // 其他型態
    realType = type;
  }
  return realType
}

// 資料是陣列
function dataIsArray(array = [],options, parentProperty, newData,depth) {
  array.forEach(function(item,index){
    const newProperty = `${parentProperty}[${index}]`
    easyFormData(item,options,newProperty,newData,depth)
  })
}

// 資料是物件
function dataIsObject(object = {},options, parentProperty = "", newData,depth) {
  Object.keys(object).forEach(function(property){
    const isIgnore = options.ignore ? options.ignore.includes(property) : false
    if(isIgnore) return
    const value = object[property] // 值
    const newValue = options.convert ? convertData(value,property,options.convert) : value
    const newProperty = parentProperty ? `${parentProperty}[${property}]` : property
    easyFormData(newValue,options,newProperty,newData,depth)
  })
}

// 資料轉換
function convertData(value,property,convert = []){
  if(convert.length === 0) return value
  const target = convert.find(function(item){
    return item.targetProperty === property && item.currentValue === value
  })
  return target ? target.convertValue : value
}
