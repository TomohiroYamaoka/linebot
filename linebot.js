var CHANNEL_ACCESS_TOKEN = 'LINE Developersで取得したアクセストークンを入力';
var line_endpoint = 'https://api.line.me/v2/bot/message/reply';
var spreadsheet_id = '作成したスプレッドシートのIDを入力';
var targetSheet = SpreadsheetApp.openById(spreadsheet_id).getSheetByName('アンケート回答');

function doPost(e) {
 var json = e.postData.contents
 var events = JSON.parse(json).events;
 
 events.forEach(function(event) {
   if(event.type == "message") {
     var userMessage = event.message.text;
     var userColumn = 1;
     var userRow = findUser(event, userColumn);


     //質問の回答
     var nameCell = targetSheet.getRange(userRow, 3);
     var nameYomiCell = targetSheet.getRange(userRow, 4)
     var addressCell = targetSheet.getRange(userRow, 5);
     var addressCityCell = targetSheet.getRange(userRow, 6);
     var ageCell = targetSheet.getRange(userRow, 7);
     var sexCell = targetSheet.getRange(userRow, 8);
     var exCell = targetSheet.getRange(userRow, 9);
     var exSpanCell = targetSheet.getRange(userRow, 10);
     var lastExCell = targetSheet.getRange(userRow, 11);
     var jobCell = targetSheet.getRange(userRow, 12);
     var workStyleCell = targetSheet.getRange(userRow, 13);
     var workDaysPerWeekCell = targetSheet.getRange(userRow, 14);
     var startWorkCell = targetSheet.getRange(userRow, 15);
     var workPlaceCell = targetSheet.getRange(userRow, 16);
     var conditionCell = targetSheet.getRange(userRow, 17);

     
     if(userMessage == "スタート") {
       if (nameCell.isBlank()) {
         var message = "お名前をお答えください" + "\uDBC0\uDC01";
         reply(event, message);
       } else {
         var message = "あなたは既にユーザー登録をしています。\n\n登録情報を変更したい場合は、相談用アカウントへご連絡ください。" + "\uDBC0\uDC01" + "\n\nhttp://nav.cx/amNt1VK";
         reply(event, message);
       }
     }
     else if (nameCell.isBlank()) {
       var message = "お名前（フリガナ）をお答えください" + "\uDBC0\uDC01";
       nameCell.setValue(userMessage);
       reply(event, message);
     }
     else if (nameYomiCell.isBlank()) {
       var message = "現在お住まいの都道府県をお答えください" + "\uDBC0\uDC01";
       nameYomiCell.setValue(userMessage);
       reply(event, message);
     }
     else if (addressCell.isBlank()) {
       var message = "現在お住まいの市区町村をお答えください" + "\uDBC0\uDC01";
       addressCell.setValue(userMessage);
       reply(event, message);
     }
     else if (addressCityCell.isBlank()) {
       var message = "年齢をお答えください" + "\uDBC0\uDC01";
       addressCityCell.setValue(userMessage);
       reply(event, message);
     }
     else if (ageCell.isBlank()) {
       ageCell.setValue(userMessage);
       questionForSex(event, message);
     }
     else if (sexCell.isBlank()) {
       sexCell.setValue(userMessage);
       questionForEx(event, message);
     }
     else if (exCell.isBlank()) {
       exCell.setValue(userMessage);
       if (userMessage === "ある") {
         var message = "エンジニアの経験年数をお答えください" + "\uDBC0\uDC01";
         reply(event, message);
       } else {
         exSpanCell.setValue("null");
         lastExCell.setValue("null");
         var message = "前職をお答えください" + "\uDBC0\uDC01";
         reply(event, message);
       }
     }
     else if (exSpanCell.isBlank()) {
       var message = "最後にエンジニアをしていた時期をお答えください" + "\uDBC0\uDC01";
       exSpanCell.setValue(userMessage);
       reply(event, message);
     }
     else if (lastExCell.isBlank()) {
       var message = "前職をお答えください" + "\uDBC0\uDC01";
       lastExCell.setValue(userMessage);
       reply(event, message);
     }
     else if (jobCell.isBlank()) {
       jobCell.setValue(userMessage);
       questionForWorkstyle(event, message);
     }
     else if (workStyleCell.isBlank()) {
       workStyleCell.setValue(userMessage);
       if (userMessage !== "正社員") {
         var message = "ご希望の勤務頻度（1週間あたり）をお答えください" + "\uDBC0\uDC01";
         reply(event, message);
       } else {
         workDaysPerWeekCell.setValue("null");
         var message = "ご希望の就職時期をお答えください" + "\uDBC0\uDC01";
         reply(event, message);
       }
     }
     else if (workDaysPerWeekCell.isBlank()) {
       var message = "ご希望の就職時期をお答えください" + "\uDBC0\uDC01";
       workDaysPerWeekCell.setValue(userMessage);
       reply(event, message);
     }
     else if (startWorkCell.isBlank()) {
       var message = "ご希望の勤務地域をお答えください" + "\uDBC0\uDC01";
       startWorkCell.setValue(userMessage);
       reply(event, message);
     }
     else if (workPlaceCell.isBlank()) {
       var message = "その他、ご希望の条件やご相談事項があればお答えください" + "\uDBC0\uDC01" + "\nない場合は「ない」とお答えください。";
       workPlaceCell.setValue(userMessage);
       reply(event, message);
     }
     else if (conditionCell.isBlank()) {
       var message = "質問は以上となります！ご回答ありがとうございました" + "\uDBC0\uDC01" + "\n\n担当者より3営業日以内にご連絡いたしますので、「相談用アカウント」を友達追加してお待ちください" + "\uDBC0\uDC01" + "\n（下記URLをクリックすると友達追加画面に切り替わります）" + "任意のURL" + "\n\n※なお、登録情報の修正などがある場合は、相談用アカウントへご連絡ください。\n\n履歴書や職務経歴書などがある場合は、こちらのアカウントにお送りください！";
       conditionCell.setValue(userMessage);
       reply(event, message);
     }
   }
   else if(event.type == "follow") {
     var displayName = follow(event);
   } 
   else if(event.type == "unfollow") {unfollow(event);} 
 });
}

function follow(e) {
 var userId = e.source.userId;
 var options = {"headers" : {"Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN}};
 var json = UrlFetchApp.fetch("https://api.line.me/v2/bot/profile/" + userId , options);
 var displayName = JSON.parse(json).displayName;
 targetSheet.appendRow([userId, displayName]); 
}
function unfollow(e) {
 var userId = e.source.userId;
 var dat = targetSheet.getDataRange().getValues();
 var flg = -1;
 
 for(var i=0;i<dat.length;i++){
   if(dat[i][0] === userId){//[行][列]
     targetSheet.deleteRow(i+1);
   }
 }
}

function reply(e,message) {
 var message = {
   "replyToken" : e.replyToken,
   "messages" : [{"type": "text","text" : message}]
 };
 var options = {
   "method" : "post",
   "headers" : {
     "Content-Type" : "application/json",
     "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
   },
   "payload" : JSON.stringify(message)
 };
 UrlFetchApp.fetch(line_endpoint, options);
}

function findUser(e, col) {
 var userId = e.source.userId;
 var dat = targetSheet.getDataRange().getValues();
 
 for (var i=0;i<dat.length;i++) {
   if (dat[i][col-1] === userId) {
     return i+1;
   }
 }
}

function questionForSex(e, message) {
 var message = {
   "replyToken" : e.replyToken,
   "messages" : [{
     "type": "text",
     "text": "性別をお答えください" + "\uDBC0\uDC01",
     "quickReply": {
       "items": [
         {
           "type": "action",
           "action": {
             "type": "message",
             "label": "男",
             "text": "男"
           }
         },
         {
           "type": "action",
           "action": {
             "type": "message",
             "label": "女",
             "text": "女"
           }
         },
         {
           "type": "action",
           "action": {
             "type": "message",
             "label": "その他",
             "text": "その他"
           }
         },
       ]
     }
   }]
 };
 var options = {
   "method" : "post",
   "headers" : {
     "Content-Type" : "application/json",
     "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
   },
   "payload" : JSON.stringify(message)
 };
 UrlFetchApp.fetch(line_endpoint, options);
}
                 
function questionForEx(e, message) {
 var message = {
   "replyToken" : e.replyToken,
   "messages" : [{
     "type": "text",
     "text": "エンジニアの経験の有無をお答えください" + "\uDBC0\uDC01",
     "quickReply": {
       "items": [
         {
           "type": "action",
           "action": {
             "type": "message",
             "label": "ある",
             "text": "ある"
           }
         },
         {
           "type": "action",
           "action": {
             "type": "message",
             "label": "ない",
             "text": "ない"
           }
         },
       ]
     }
   }]
 };
 var options = {
   "method" : "post",
   "headers" : {
     "Content-Type" : "application/json",
     "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
   },
   "payload" : JSON.stringify(message)
 };
 UrlFetchApp.fetch(line_endpoint, options);
}

function questionForWorkstyle(e, message) {
 var message = {
   "replyToken" : e.replyToken,
   "messages" : [{
     "type": "text",
     "text": "ご希望の雇用形態をお答えください" + "\uDBC0\uDC01",
     "quickReply": {
       "items": [
         {
           "type": "action",
           "action": {
             "type": "message",
             "label": "アルバイト・パート",
             "text": "アルバイト・パート"
           }
         },
         {
           "type": "action",
           "action": {
             "type": "message",
             "label": "正社員",
             "text": "正社員"
           }
         },
         {
           "type": "action",
           "action": {
             "type": "message",
             "label": "契約社員",
             "text": "契約社員"
           }
         },
         {
           "type": "action",
           "action": {
             "type": "message",
             "label": "業務委託",
             "text": "業務委託"
           }
         },
       ]
     }
   }]
 };
 var options = {
   "method" : "post",
   "headers" : {
     "Content-Type" : "application/json",
     "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
   },
   "payload" : JSON.stringify(message)
 };
 UrlFetchApp.fetch(line_endpoint, options);
}