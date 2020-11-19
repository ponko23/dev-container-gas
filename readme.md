1. login
```
clasp login --no-localhost
```

1. create project
```
clasp create --title <Project Title> --type <standalone | sheets | froms | ...> --rootDir ./src
```

node.jsからの移植ライブラリは、appsscript.jsonに追加後、yarnで@types/~を追加、src/index.d.tsにreferenceでd.tsファイルを指定する。使うファイルでimportするとgasへの変換時にimport部分は無視されるのでgasライブラリの方を向く。interfaceが異なったり、Promiseを使用しているライブラリは動かない