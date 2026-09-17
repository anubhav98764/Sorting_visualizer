// AIBox/Aibox.js
let synth = window.speechSynthesis;

export const speakText = (text,onEndCallback) => {
  if (!synth) {
    if(onEndCallback) onEndCallback();

    return;
  }

  // Agar browser ka speech engine pause state mein hai toh use resume karo
  if (synth.paused) {
    synth.resume();
  }

  // Pehle ki sabhi pending aawazein cancel karo taaki queue clean rahe
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  utterance.onend = () =>{
    if(onEndCallback) onEndCallback();
  };
  utterance.onerror = () =>{
    if(onEndCallback) onEndCallback();
  };

  // Voices load hone ka wait karke english voice assign karna
  const setVoiceAndSpeak = () => {
    const voices = synth.getVoices();
    if (voices && voices.length > 0) {
      const englishVoice = voices.find(v => v.lang && v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }
    synth.speak(utterance);
  };

  // Kuch browsers mein voices asynchronous load hoti hain
  if (synth.getVoices().length === 0) {
    synth.onvoiceschanged = () => {
      setVoiceAndSpeak();
      synth.onvoiceschanged = null; // cleanup
    };
  } else {
    setVoiceAndSpeak();
  }
};