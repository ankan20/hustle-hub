class AudioProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input[0]) {
      const float32Array = input[0];
      const int16Array = new Int16Array(float32Array.length);

      for (let i = 0; i < float32Array.length; i++) {
        int16Array[i] = Math.min(1, float32Array[i]) * 0x7fff;
      }

      this.port.postMessage({ audioBuffer: int16Array.buffer }); // Send as ArrayBuffer
    }
    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
