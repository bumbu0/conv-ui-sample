# Conversation サンプルアプリケーション
このアプリケーションはWatson Conversationで作ったDialogを簡単に動かすためのものです。


## 事前準備

* Bluemixアカウントの準備
    * Bluemixアカウントを作るか[sign_up] あるいは既存のBluemixアカウントを利用します。
* 次の前提ソフトを導入します。
    *  [Node.js][node_js] Node.js 実行環境 ( [npm][npm_link] パッケージマネージャーを含む )
    *  [Cloud Foundry][cloud_foundry] コマンドラインツール

      注意: Cloud Foundaryのバージョンは最新として下さい。

### ソースのダウンロード

    git clone https://git.ng.bluemix.net/akaishi/conv-ui-sample.git

### Bluemix環境へのデプロイ

    cd conv-ui-sample
    cf login
    cf push <your_appl_name>

### 環境変数のセット

WORKSPACE_ID
CONVERSATION_USERNAME
CONVERSATION_PASSWORD

[node_js]: https://nodejs.org/#download
[cloud_foundry]: https://github.com/cloudfoundry/cli#downloads
[npm_link]: https://www.npmjs.com/
[sign_up]: bluemix.net/registration