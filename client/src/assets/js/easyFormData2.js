/**
 * 簡單轉formData
 * @param {[Any]} data 資料，第一次須為物件
 * @param {[String]} property 屬性
 * @param {[number]} depth 深度
 * @returns 
 */
export default function easyFormData(data = {}, property = "", depth = 0) {
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
    // 如果是第一次進來，型態必須為物件
    if (realType !== "object" && depth === 0) throw new Error("only object!!");
    const nextDepth = depth + 1;
    let newData = {};
    switch (realType) {
      case "array":
        newData = dataIsArray(data,property,nextDepth);
        break;
      case "object":
        newData = dataIsObject(data,property,nextDepth);
        break;
      default:
        newData = {
          value: data, // 值
          formDataProperty: depth === 1 ? property : `[${property}]` // formdata屬性
        };
    }
    if (depth === 0) {
      const formData = new FormData();
      if(!Array.isArray(newData)) return
      newData.forEach(item=>{
        formData.append(item.formDataProperty, item.value);
      })
      // newData.forEach(item => {
      //   let check = item.formDataProperty.indexOf("[") === 0;
      //   if (check) {
      //     const newFormDataProperty = item.formDataProperty.replace("[", "").replace("]", "");
      //     formData.append(newFormDataProperty, item.value);
      //   } else {
      //     formData.append(item.formDataProperty, item.value);
      //   }
      // });
      return formData;
    } else {
      return newData;
    }
}

// 資料是陣列
function dataIsArray(array = [], parentProperty, depth) {
  const newData = []
    array.forEach((item, itemIndex) => {
        const result = easyFormData(item, itemIndex, depth);
        if(Array.isArray(result)){
          result.forEach(resultItem=>{
            newData.push({
              value:resultItem.value,
              formDataProperty:`[${parentProperty}]${resultItem.formDataProperty}`
            })
          })
        }else{
          newData.push({
            value:result.value,
            formDataProperty:`[${parentProperty}]${result.formDataProperty}`
          })
        }
    });
    return newData
}

// 資料是物件
function dataIsObject(object = {}, parentProperty = "", depth) {
    const newData = []
    Object.keys(object).map(property => {
        const value = object[property]; // 值
        const result = easyFormData(value, property, depth);
        if(Array.isArray(result)){
          result.forEach(resultItem=>{
            let formDataProperty = depth === 1  ? `${resultItem.formDataProperty}` : `[${parentProperty}]${resultItem.formDataProperty}`
            let check = resultItem.formDataProperty.indexOf("[") === 0;
            if(check&& depth === 1) formDataProperty = formDataProperty.replace("[", "").replace("]", "");

            newData.push({
              ...resultItem,
              formDataProperty: formDataProperty
            })
          })
        }else{
          // newData = newData.concat(result); // 合併陣列
          newData.push({
            value:result.value,
            formDataProperty: depth === 1 ? `${result.formDataProperty}` : `[${parentProperty}]${result.formDataProperty}`
          }) 
        }
    });
    return newData
}
