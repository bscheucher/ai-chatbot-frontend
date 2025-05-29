import useChatStore from '../store/chatStore'

export const useChat = () => {
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    isSending,
    selectedModel,
    setSelectedModel,
    loadConversations,
    loadConversation,
    sendMessage,
    startNewConversation,
    deleteConversation,
    clearMessages
  } = useChatStore()

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    isSending,
    selectedModel,
    setSelectedModel,
    loadConversations,
    loadConversation,
    sendMessage,
    startNewConversation,
    deleteConversation,
    clearMessages
  }
}