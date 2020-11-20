# Google Apps Script開発コンテナ
Visual Studio CodeのDevContainer内でTypeScriptを使って快適にGAS開発をしたい。

## 使用方法

1. build container

    プロジェクトルートフォルダをVisual Studio Code開き、画面左下の><ボタンかコマンドパレットから`Remote-Containers: Open Folder in container`を選択してビルド開始する。

1. login

    ビルドが終わったら新しくターミナルを開き以下のコマンドを実行する。
    ```
    clasp login --no-localhost
    ```
    画面の指示に従ってGoogleにログインする。

1. create project

    新しくGoogle Apps Scriptプロジェクトを作成する場合は以下のコマンドを実行する。
    ```
    clasp create --title <Project Title> --type <standalone | sheets | froms | ...> --rootDir ./src
    ```
    - Project Title: GASプロジェクト名とSheetsを使う場合のSheetsファイル名になる。




- update project

    Google Apps Scriptに反映するには、以下のコマンドを実行する。
    ```
    clasp push
    ```

## おまけ

- node.jsからの移植ライブラリを使用する。

    ex.cheerioの場合
    1. src/appsscript.jsonのdependenciesにGASライブラリを追加する。
        ```
        "dependencies": {
            "libraries": [{
            "userSymbol": "Cheerio",
            "libraryId": "1ReeQ6WO8kKNxoaA_O0XEQ589cIrRvEBA9qcWpNqdOP17i47u6N9M5Xh0",
            "version": "12"
            }]
        },
        ```
    1. yarnで型定義ファイルのみを追加する。
        ```
        yarn add --dev @types/cheerio
        ```

    1. src/index.d.tsを作成し、型ファイルへの参照を設定する。
        ```
        /// <reference path="../node_modules/@types/cheerio/index.d.ts" />
        ```
        ※ ローカルで開いている時はnode_modules内が空の為、エラーになっているが気にしない。

    1. 使用するファイル内でimportする
        ```
        import * as Cheerio from "cheerio"
        ```
        ※ ローカルで開いている時はnode_modules内が空の為、エラーになっているが気にしない。
        
        ※ GASライブラリの名前と合わせる必要がある。

    ※ 型定義ファイルとimportはgsファイルへの変換時に無視される。
    
    ※ 残ったライブラリ使用箇所はGASライブラリへの参照として実行される。
    
    ※ index.d.tsファイルが残ってしまうので.claspignoreに指定して除外する。
    
    ※ interfaceが異なったり、Promiseを使用しているライブラリは動かない
