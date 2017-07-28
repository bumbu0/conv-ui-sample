# Conversation サンプルアプリケーション
このアプリケーションはWatson Conversationで作ったDialogを簡単に動かすためのものです。


## 事前準備

* Bluemixアカウントの準備
    * [Sign up](https://console.ng.bluemix.net/registration/?target=/catalog/%3fcategory=watson) in Bluemix, or use an existing account. Your account must have available space for at least 1 app and 1 service.
* Make sure that you have the following prerequisites installed:
    * The [Node.js](https://nodejs.org/#download) runtime, including the [npm][npm_link] package manager
    * The [Cloud Foundry][cloud_foundry] command-line client

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


