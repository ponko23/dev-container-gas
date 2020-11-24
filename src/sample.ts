import * as Cheerio from 'cheerio'

const sampleKey = 'sample'

interface Sample {
  id: string
  name: string
}

// scrapingデータをそのまま書き込むシート「sample_scraped」
// 「scample_scraped」をsheets関数を使って加工したり、追加データを入れたりするシート「sample_edited」
// 各データ毎にこの2つのシートを用意し、APIが返すのは「sample_edited」シートの先頭行にプロパティ名が入っている列のみ

// scrape~~という関数はデータの種類毎に必ず用意する
function scrapeSapmle() {
  //const sampleUrl = "https://"
  //const html = UrlFetchApp.fetch(sampleUrl).getContentText('UTF-8');
  const html = `
    <html>
        <body>
            <ul>
                <li>hoge</li>
                <li>fuga</li>
                <li>piyo</li>
            </ul>
        </body>
    </html>`
  const $ = Cheerio.load(html)
  const results = $('ul li')
    .toArray()
    .map((element, i) => {
      const value = $(element).text()
      return {
        id: ('000' + (i + 1)).slice(-3),
        name: value,
      }
    })

  updateAllRows_(sampleKey, results)
}
