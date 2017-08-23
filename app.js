/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// ローカル実行の場合、"local.env"ファイルから環境変数を読み取る
const fs = require('fs');
if (fs.existsSync('local.env')) {
  console.log('構成情報をlocal.envから取得中');
  require('dotenv').config({ path: 'local.env' });
} else {
  console.log('local.envがないので、環境変数から構成情報を取得します');
}

// Conversation用wrapperの初期化
const Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
const conversation = new Conversation({
    username: process.env.CONVERSATION_USERNAME,
    password: process.env.CONVERSATION_PASSWORD,
    url: 'https://gateway.watsonplatform.net/conversation/api',
    version_date: Conversation.VERSION_DATE_2017_04_21
});
var workspace_id = process.env.WORKSPACE_ID;
if (!workspace_id) {
    console.log('workspace_id is not defined.');
    return;
} 

// CLOUDANT_DBNAMEがセットされている場合、Cloudant用wrapperを初期化する
var record_log = false;
if ( process.env.CLOUDANT_DBNAME ) {
    record_log = true;
    const Cloudant_lib = require('./cloudant_lib');
    var cloudant = new Cloudant_lib({
        cloudantUrl: process.env.CLOUDANT_URL,
        cloudantDbName: process.env.CLOUDANT_DBNAME,
        initializeDatabase: true
    });
}

const express = require('express'); // app server
const bodyParser = require('body-parser'); // parser for post requests
const path = require('path');
const app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Endpoint to be call from the client side
app.post('/api/message', function(req, res) {
  var payload = {
    workspace_id: workspace_id,
    context: req.body.context || {},
    input: req.body.input || {}
  };
  // Send the input to the conversation service
  conversation.message(payload, function(err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    return res.json(updateMessage(payload, data));
  });
});

// default pathの設定
var debug_mode = process.env.DEBUG_MODE;
var default_path = path.join(__dirname, 'public');
if ( debug_mode && debug_mode === 'true' ) {
    default_path = path.join(default_path, 'index_debug.html');
} else {
    default_path = path.join(default_path, 'index_prod.html');
}
console.log( "debug_mode: " + debug_mode );
console.log( default_path );
app.get('/', function(req, res) {
    res.sendFile(default_path);
});

// VCAP_APP_PORTが設定されている場合はこのポートでlistenする (Bluemixのお作法)
var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port, function() {
  // eslint-disable-next-line
  console.log('Server running on port: %d', port);
});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Conversation service
 * @param  {Object} response The response from the Conversation service
 * @return {Object}          The response with the updated message
 */

// 検索用ダミーデータ
const student_list = {
    '12345': {name: '山田太郎', age: 20}, 
    '54321': {name: '鈴木一郎', age: 18},
    '11111': {name: '佐藤花子', age: 19}
};

function updateMessage(input, response) {
    var output = response.output;
// 外部連携リクエスト有無をoutput.actionで判断
    if ( output && output.action && output.action.command ) {
// 外部連携リクエストが"query_student_name_by_id"の場合の処理
        if ( output.action.command === "query_student_name_by_id" ) {
// student_idをoutputパラメータから取得
            var student_id = output.action.student_id;
// スタブによるダミー検索。実際は検索用API呼出しとなる。
            var student = student_list[student_id];                             
// 正常終了の場合、検索で取得したstudent.nameをcontext変数に保存
            if ( student ) {
                response.context.student_name = student.name;               
                console.log( "OK student_name: " + student.name);
// 検索結果が得られなかった場合
            } else {
                console.log( "NG student_id: " + student_id);
            }
        }
    }        
// Cloudantにログの保存    
    if ( record_log ) {
        cloudant.record_log( response, function( err, msg ) {
            if ( err ) { console.log(err); }
            else { console.log(msg); }
        });
    }
    return response;
}
