/**
 * Web Speech API Voice Search Input Integration
 */

export function setupVoiceSearch(triggerButtonEl, inputTargetEl, onSearchCompleted) {
  if (!triggerButtonEl || !inputTargetEl) return;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    triggerButtonEl.style.display = 'none'; // Speech API not supported in browser
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'de-DE';
  recognition.interimResults = false;

  triggerButtonEl.addEventListener('click', () => {
    triggerButtonEl.classList.add('pulse-recording');
    recognition.start();
  });

  recognition.onresult = (event) => {
    triggerButtonEl.classList.remove('pulse-recording');
    const transcript = event.results[0][0].transcript;
    inputTargetEl.value = transcript;
    if (onSearchCompleted) onSearchCompleted(transcript);
  };

  recognition.onerror = () => {
    triggerButtonEl.classList.remove('pulse-recording');
  };

  recognition.onend = () => {
    triggerButtonEl.classList.remove('pulse-recording');
  };
}
