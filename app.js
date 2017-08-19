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
require('dotenv').config({silent: true});

const express = require('express'); // app server
const bodyParser = require('body-parser'); // parser for post requests
const Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk

const app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the service wrapper
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

// CLOUDANT_DBNAMEがセットされている場合、Cloudantにログデータを保存する
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

var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;

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
    var student_id;
    var student;
    var student_name;
    var context = response.context;
// student_idはダイアログで設定される。
    if ( context && context.student_id && ! context.student_name ) {    
        student_id = context.student_id;
// スタブによるダミー検索。実際は検索用API呼出しとなる。
        student = student_list[student_id];                             
        if ( student ) {
            student_name = student.name;
            console.log( "student_name: " + student_name);
// 検索で取得したstudent_nameをcontext変数に設定する。
            response.context.student_name = student_name;               
// 検索結果が得られなかった場合ダミーデータを設定する。        
        } else { 
            response.context.student_name = '該当なし'; 
        }
    }
    if (!response.output) { response.output = {}; }
// Cloudantにログの保存    
    if ( record_log ) {
        cloudant.record_log( response, function( err, msg ) {
            if ( err ) { console.log(err); }
            else { console.log(msg); }
        });
    }
    return response;
}
