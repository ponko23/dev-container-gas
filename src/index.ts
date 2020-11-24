/**
 * 外部からのリクエスト対してjsonでデータを返す。
 * queryparameterにsは必須。
 * @param e
 */
function doGet(e: GoogleAppsScript.Events.AppsScriptHttpRequestEvent) {
  try {
    const sheetKey = e.parameter['s']
    if (!sheetKey) throw new Error('parameter "s" is required.')
    const propertyKey = `${sheetKey}_json`
    // Propertyにhoge_jsonなkeyで登録されているjsonデータを返す。
    // Propertyへの登録は各シートで更新処理を使って登録すること。
    const properties = PropertiesService.getScriptProperties()
    let json = properties.getProperty(propertyKey)
    if (!json) {
      json = getDataFromEditedSheet_(sheetKey)
      properties.setProperty(propertyKey, json)
    }
    return ContentService.createTextOutput(json).setMimeType(
      ContentService.MimeType.JSON
    )
  } catch (err) {
    throw err
  }
}

/**
 * 現在アクティブなシート名が*_editedの時、対応するjsonDataのキャッシュを更新する
 */
function upadtePropertyJsonData() {
  const sheet = SpreadsheetApp.getActive().getActiveSheet()
  const sheetName = sheet.getSheetName()
  if (!sheetName.indexOf('_edited')) return
  const values = sheet.getDataRange().getValues()
  const propertyNames = values[0]
  const jsonObject = values.slice(1).map((row) => {
    let obj = {}
    row.map((item, index) => {
      const property = propertyNames[index]
      // 先頭行にプロパティ名が指定されている列のみjsonに出力する
      if (property) {
        obj[property] = item
      }
    })
    return obj
  })
  const json = JSON.stringify(jsonObject)
  const sheetKey = sheetName.replace('_edited', '_json')
  const properties = PropertiesService.getScriptProperties()
  properties.setProperty(sheetKey, json)
}

/**
 * シートから余分な行列を削除する
 * @param sheetName
 */
function fixDataRage(sheetName: string) {
  const sheet = sheetName
    ? SpreadsheetApp.getActive().getSheetByName(sheetName)
    : SpreadsheetApp.getActive().getActiveSheet()
  const targetRange = sheet.getDataRange()
  const lastRow = targetRange.getLastRow()
  const maxRows = sheet.getMaxRows()
  const lastColumn = targetRange.getLastColumn()
  const maxColumns = sheet.getMaxColumns()
  if (lastRow < maxRows) {
    sheet.deleteRows(lastRow + 1, maxRows - lastRow)
  }
  if (lastColumn < maxColumns) {
    sheet.deleteColumns(lastColumn + 1, maxColumns - lastColumn)
  }
}

// private member

/**
 * 指定した「シート名+_edited」の編集済みシートを元にJSON文字列を組み立てて返す。
 * @param sheetKey
 */
function getDataFromEditedSheet_(sheetKey: string): string {
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(
      `${sheetKey}_edited`
    )
    const values = sheet.getDataRange().getValues()
    const propertyNames = values[0]
    const jsonObject = values.slice(1).map((row) => {
      let obj = {}
      row.map((item, index) => {
        const property = propertyNames[index]
        // 先頭行にプロパティ名が指定されている列のみjsonに出力する
        if (property) {
          obj[property] = item
        }
      })
      return obj
    })
    return JSON.stringify(jsonObject)
  } catch (err) {
    throw err
  }
}

/**
 * シートのデータを全て入れ替える
 * @param sheetKey
 * @param data
 */
function updateAllRows_<T>(sheetKey: string, data: T[]) {
  const propertyNames = Object.getOwnPropertyNames(data[0])
  let setItems = [propertyNames].concat(
    data.map((item) => {
      return propertyNames.map((property) => {
        return item[property].toString()
      })
    })
  )
  const sheetName = `${sheetKey}_scraped`
  let sheet = SpreadsheetApp.getActive().getSheetByName(sheetName)
  if (!sheet) {
    sheet = SpreadsheetApp.getActive().insertSheet(sheetName)
  }
  sheet.clear()
  const targetRange = sheet.getRange(
    1,
    1,
    setItems.length,
    propertyNames.length
  )
  targetRange.setNumberFormat('@')
  targetRange.setValues(setItems)
  fixDataRage(sheetName)
}

/**
 * データをシートに追加する
 * @param sheetKey
 * @param data
 */
function addRows_<T>(sheetKey: string, data: T[] | T) {
  const sourceArray = Array.isArray(data) ? data : [data]
  const sheet = SpreadsheetApp.getActive().getSheetByName(`${sheetKey}_scraped`)
  const values = sheet.getDataRange().getValues()
  const propertyNames =
    values.length >= 1 ? values[0] : Object.getOwnPropertyNames(sourceArray[0])
  const setItems = sourceArray.map((item) => {
    return propertyNames.map((property) => {
      return item[property].toString()
    })
  })
  // 既存データと突き合わせて重複データを除外するか、sheetsの関数で何かあればそっちを使うかする？
  sheet
    .getRange(
      sheet.getLastRow() + 1,
      1,
      sourceArray.length,
      propertyNames.length
    )
    .setValues(setItems)
}
