import { useState, useRef, useEffect, useCallback } from "react";
import { Capacitor } from "@capacitor/core";
import { SpeechRecognition as CapSpeech } from "@capacitor-community/speech-recognition";

const WebSpeechRecognition =
  (globalThis as any).SpeechRecognition || (globalThis as any).webkitSpeechRecognition;

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const webRecognitionRef = useRef<any>(null);

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      let listenerHandle: any;

      const setupNativeListener = async () => {
        return await CapSpeech.addListener("partialResults", (data: any) => {
          if (data.matches?.length > 0) {
            setTranscript(data.matches[0]);
          }
        });
      };

      setupNativeListener().then((handle) => (listenerHandle = handle));

      return () => {
        listenerHandle?.remove();
        CapSpeech.stop().catch(() => {});
      };
    } else if (WebSpeechRecognition) {
      const recognition = new WebSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "id-ID";

      recognition.onresult = (event: any) => {
        let result = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          result += event.results[i][0].transcript;
        }
        setTranscript(result);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      webRecognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = useCallback(async () => {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
      try {
        if (isListening) {
          await CapSpeech.stop();
          setIsListening(false);
        } else {
          const permStatus = await CapSpeech.checkPermissions();
          if (permStatus.speechRecognition !== "granted") {
            const request = await CapSpeech.requestPermissions();
            if (request.speechRecognition !== "granted") {
              alert("Microphone permission denied.");
              return;
            }
          }
          setTranscript("");
          await CapSpeech.start({ language: "id-ID", partialResults: true, popup: false });
          setIsListening(true);
        }
      } catch (error) {
        console.error("Native Speech Error:", error);
        setIsListening(false);
      }
    } else {
      if (!WebSpeechRecognition) {
        alert("Speech recognition is not supported in this browser/device.");
        return;
      }

      if (isListening) {
        webRecognitionRef.current?.stop();
      } else {
        setTranscript("");
        webRecognitionRef.current?.start();
        setIsListening(true);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (Capacitor.isNativePlatform()) {
      CapSpeech.stop().catch(() => {});
    } else {
      webRecognitionRef.current?.stop();
    }
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => setTranscript(""), []);

  return {
    isListening,
    transcript,
    setTranscript,
    toggleListening,
    stopListening,
    clearTranscript,
  };
}
