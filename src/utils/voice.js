/**
 * TinySprouts 语音引擎
 * 利用 Web Speech API 实现指令播报
 */

export const speak = (text) => {
  if (!('speechSynthesis' in window)) return;

  // 停止之前的播放
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.9; // 稍微慢一点，方便孩子听清
  utterance.pitch = 1.2; // 音调稍高，听起来更亲切可爱

  window.speechSynthesis.speak(utterance);
};
