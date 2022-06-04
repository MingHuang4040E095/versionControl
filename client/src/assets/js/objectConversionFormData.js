/**
 * [objectConversionFormData description]
 * 處理formData格式的function
 * @param   {[any]]}  data  要轉的資料         [data description]
 * @param   {[String]}  parentProperty 父層屬性  [parentProperty description]
 * @param   {[Number]}  depth  目前在哪一層    [depth description]
 *
 * @return  {[Array] or [formData]}    depth為0時回傳 formData ， 其餘回傳 Array    [return description]
 */
 export default function objectConversionFormData (data, parentProperty = '', depth = 0) {
    const mainType = typeof data
    if (depth === 0 && (mainType !== 'object' || Array.isArray(data))) throw new Error('錯誤: 請丟物件!!')
    // 情境
    if (mainType === 'object' && data === null) {
        const obj = {
            key: parentProperty,
            value: data
        }
        return [obj]
    } else if (mainType === 'object' && !Array.isArray(data)) {
        const isFile = data instanceof Blob // 判斷是否為檔案
        // --1.物件&不是陣列
        // --1.1 要回傳的資料
        const propertyValueArray = []
        // --1.2 取得底下屬性
        const propertyList = Object.keys(data)
        if (isFile) {
            // 如果是檔案
            const obj = {
                key: parentProperty,
                value: data
            }
            return [obj]
        } else if (propertyList.length) {
            // --1.3 跑回圈
            propertyList.forEach(property => {
                const value = data[property] // 取得該屬性的值
                const depthNext = depth + 1

                let childProperty = ''
                if (depth === 0) childProperty = property
                else childProperty = `${parentProperty}[${property}]`

                const result = objectConversionFormData(value, childProperty, depthNext)
                propertyValueArray.push(...result)
            })

            if (depth === 0) {
                const formData = new FormData()
                propertyValueArray.forEach(formItem => {
                    formData.append(formItem.key, formItem.value)
                })
                return formData
            } else {
                return propertyValueArray
            }
        }
    } else if (mainType === 'object' && Array.isArray(data)) {
        // --2.物件&是陣列
        const propertyValueArray = []
        // 要有屬性名稱+索引 [property][index]
        data.forEach((item, itemIndex) => {
            const secondaryType = typeof item
            if (secondaryType === 'object') {
                const depthNext = depth + 1
                const childProperty = `${parentProperty}[${itemIndex}]`
                const result = objectConversionFormData(item, childProperty, depthNext)
                propertyValueArray.push(...result)
            } else {
                propertyValueArray.push({
                    key: `${parentProperty}[${itemIndex}]`,
                    value: item
                })
            }
        })
        return propertyValueArray
    } else {
        // --3.都不是
        // [property]
        const obj = {
            key: parentProperty,
            value: data
        }
        return [obj]
    }
}