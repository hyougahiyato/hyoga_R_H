
let data = [];

// 表示要素の取得
const outputText = document.getElementById("outputText");
const genreCounter = document.getElementById("genreCounter"); // ジャンルと文字数を囲む要素
const genreTag = document.getElementById("genreTag");
const counter = document.getElementById("counter");
const copyMsg = document.getElementById("copyMsg");

// 初期表示のセリフ
const initialText = "▼ セリフがここに表示されます ▼";

// ページ読み込み時の処理
document.addEventListener('DOMContentLoaded', () => {
    // 初回はセリフ表示エリアに初期テキストを設定
    outputText.textContent = initialText;
    // ジャンルと文字数表示は初期非表示のまま
    genreCounter.classList.remove("visible"); // 念のためvisibleクラスがあれば削除
});


fetch("serifR.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(json => {
    data = json;
    // データ読み込み後、初回表示は行わない（ランダムボタンが押されるまで待つ）
  })
  .catch(error => {
    console.error("JSONファイルの読み込みエラー:", error);
    outputText.textContent = "セリフデータの読み込みに失敗しました。JSONファイルを確認してください。";
    genreCounter.classList.remove("visible"); // エラー時も非表示にする
  });

function showRandom() {
  if (data.length === 0) {
    outputText.textContent = "表示するセリフがありません。";
    genreCounter.classList.remove("visible"); // データがない場合も非表示に
    return;
  }

  const rand = data[Math.floor(Math.random() * data.length)];
  outputText.innerHTML = rand.text.replace(/\n/g, "<br>"); // 改行コードを<br>に変換

  genreTag.textContent = `[ジャンル：${rand.genre}]`;
  counter.textContent = `[文字数：${rand.text.length}文字]`;

  // ジャンル＆文字数表示を出す
  genreCounter.classList.add("visible");
}

function copyText() {
  // 初期表示テキストの場合はコピーしない
  if (outputText.textContent === initialText || outputText.textContent === "表示するセリフがありません。" || outputText.textContent.includes("JSONファイルの読み込みに失敗しました")) {
    return; 
  }

  const textToCopy = outputText.textContent; // innerTextではなくtextContentを使用
  navigator.clipboard.writeText(textToCopy).then(() => {
    copyMsg.style.opacity = 1;
    setTimeout(() => { copyMsg.style.opacity = 0 }, 1500);
  }).catch(err => {
    console.error('テキストのコピーに失敗しました', err);
    // エラーメッセージを表示するなど、ユーザーへのフィードバックを追加することもできます
  });
}
