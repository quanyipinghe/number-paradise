class AudioService {
  private static instance: AudioService;
  private synth: SpeechSynthesis | null = null;

  private constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    } else {
      console.warn('语音合成功能在当前环境中不受支持。');
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public playNumber(num: number, lang: string = 'zh-CN'): void {
    if (!this.synth) {
      console.warn('无法播放声音，语音合成未初始化。');
      return;
    }

    // 如果正在朗读，先取消，避免语音重叠
    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(num.toString());
    utterance.lang = lang;
    utterance.pitch = 1.2; // 稍高的音调，听起来更活泼
    utterance.rate = 0.9;  // 稍慢的语速，让儿童听得更清楚
    utterance.volume = 1;  // 最大音量

    this.synth.speak(utterance);
  }

  // 可以轻松扩展以朗读任何文本
  public speakText(text: string, lang: string = 'zh-CN'): void {
    if (!this.synth) {
      console.warn('无法播放声音，语音合成未初始化。');
      return;
    }

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.pitch = 1.2;
    utterance.rate = 0.9;
    utterance.volume = 1;

    this.synth.speak(utterance);
  }
}

export const audioService = AudioService.getInstance();
