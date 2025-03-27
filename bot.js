const TELEGRAM_BOT_TOKEN = '7939053612:AAGUCDR1sJu_TadhQDtL6PW4_3KszN0AOHQ';  // 使用你的 Bot Token
const LIBRETRANSLATE_API = 'https://libretranslate.de/translate';  // 使用 LibreTranslate API

// 設定翻譯函數
function _translate(text, targetLang) {
  const response = UrlFetchApp.fetch(LIBRETRANSLATE_API, {
    method: 'post',
    payload: {
      q: text,
      source: 'auto',
      target: targetLang,
    }
  });
  const jsonResponse = JSON.parse(response.getContentText());
  return jsonResponse.translatedText;
}

// 解析指令
function _handleCommand(command, message) {
  let response = '';

  switch (command) {
    case '?':
      response = '功能選單：\n\n' +
                 '1 翻譯上一句為中文\n' +
                 '2 翻譯上一句為英文\n' +
                 '11 翻譯上一句為中文\n';
      break;

    case '11':
      if (message.previousText) {
        response = _translate(message.previousText, 'zh');
      } else {
        response = '沒有上一句訊息可翻譯。';
      }
      break;

    case '2':
      if (message.previousText) {
        response = _translate(message.previousText, 'en');
      } else {
        response = '沒有上一句訊息可翻譯。';
      }
      break;

    default:
      response = '無效的指令，請輸入「?」查看功能選單。';
      break;
  }

  return response;
}

// 接收訊息並回應
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const chatId = data.message.chat.id;
  const text = data.message.text;
  const message = {
    text: text,
    previousText: '', // 保存上一句的訊息
  };

  // 保存上一句訊息
  if (text !== '?') {
    message.previousText = text;
  }

  const command = text.trim();

  // 判斷是否為指令
  let reply = _handleCommand(command, message);

  // 回應訊息
  _sendReply(chatId, reply);
}

// 發送回應訊息
function _sendReply(chatId, text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: text,
  };
  
  const options = {
    method: 'post',
    payload: payload,
  };

  UrlFetchApp.fetch(url, options);
}
