import { create } from 'zustand';
import { type ChatMessage, generateId, getCurrentTime } from '../utils/assistantHelpers';

interface ChatState {
  messages: ChatMessage[];
  setMessages: (updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
}

const initialMessage: ChatMessage = {
  id: generateId(),
  type: "bot",
  message: "Hello! I'm your AI Cash Intelligence assistant. How can I help you log your expenses today?",
  time: getCurrentTime(),
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [initialMessage],
  setMessages: (updater) => set((state) => ({
    messages: typeof updater === 'function' ? updater(state.messages) : updater
  })),
}));
