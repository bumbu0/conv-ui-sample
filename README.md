# Conversation サンプルアプリケーション
このアプリケーションはWatson Conversationで作ったDialogを簡単に動かすためのものです。


## 事前準備

* Bluemixアカウントの準備
    * Bluemixアカウントを作るか(https://console.ng.bluemix.net/registration/?target=/catalog/%3fcategory=watson) あるいは既存のBluemixアカウントを利用します。
* 次の前提ソフトを導入します。
    *  [Node.js](https://nodejs.org/#download) runtime, including the [npm][npm_link] package manager
    *  [Cloud Foundry][cloud_foundry] command-line client

      Note: Ensure that you Cloud Foundry version is up to date

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


