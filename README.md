# Conversation サンプルアプリケーション
このアプリケーションはWatson Conversationで作ったDialogを簡単に動かすためのものです。


## 事前準備

* Bluemixアカウントの準備
    * [Bluemixアカウントを作る][sign_up] か、あるいは既存のBluemixアカウントを利用します。
* 次の前提ソフトを導入します。
    *  [Node.js][node_js] 実行環境 ( [npm][npm_link] パッケージマネージャーを含む )
    *  [Cloud Foundry][cloud_foundry] コマンドラインツール

      注意: Cloud Foundaryのバージョンは最新として下さい。

### ソースのダウンロード

    git clone https://git.ng.bluemix.net/akaishi/conv-ui-sample.git

### Bluemix環境へのデプロイ

    cd conv-ui-sample
    cf login
    cf push <your_appl_name>

### 環境変数のセット
以下の3つの環境変数の値を事前に調べて、Cloud Foundary管理画面から「ランタイム」「環境変数」を選んで設定します。

 WORKSPACE_ID
 CONVERSATION_USERNAME
 CONVERSATION_PASSWORD

![setting](readme_images/env-settings.png)

[node_js]: https://nodejs.org/#download
[cloud_foundry]: https://github.com/cloudfoundry/cli#downloads
[npm_link]: https://www.npmjs.com/
[sign_up]: https://bluemix.net/registration