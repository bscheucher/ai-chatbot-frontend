import { create } from 'zustand'
import { chatService } from '../services/chatService'
import toast from 'react-hot-toast'

const useChatStore = create((set, get) => ({
  // State
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isSending: false,
  selectedModel: {
    provider: 'openai',
    name: 'gpt-3.5-turbo'
  },

  // Actions
  setSelectedModel: (model) => {
    set({ selectedModel: model })
  },

  loadConversations: async () => {
    set({ isLoading: true })
    try {
      const response = await chatService.getConversations()
      set({ 
        conversations: response.data.data,
        isLoading: false 
      })
    } catch (error) {
      set({ isLoading: false })
      toast.error('Failed to load conversations')
    }
  },

  loadConversation: async (conversationId) => {
    set({ isLoading: true })
    try {
      const response = await chatService.getConversation(conversationId)
      const conversation = response.data.data
      
      set({
        currentConversation: conversation,
        messages: conversation.messages,
        selectedModel: {
          provider: conversation.modelProvider,
          name: conversation.modelName
        },
        isLoading: false
      })
    } catch (error) {
      set({ isLoading: false })
      toast.error('Failed to load conversation')
    }
  },

  sendMessage: async (messageContent) => {
    const { currentConversation, selectedModel } = get()
    
    // Add user message to UI immediately
    const userMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date()
    }
    
    set(state => ({
      messages: [...state.messages, userMessage],
      isSending: true
    }))

    try {
      const response = await chatService.sendMessage({
        conversationId: currentConversation?._id,
        message: messageContent,
        modelProvider: selectedModel.provider,
        modelName: selectedModel.name
      })

      const { conversation, message: aiMessage } = response.data.data
      
      set(state => ({
        currentConversation: conversation,
        messages: [...state.messages, {
          ...aiMessage,
          timestamp: new Date()
        }],
        isSending: false
      }))

      // Update conversations list if this was a new conversation
      if (!currentConversation) {
        get().loadConversations()
      }

    } catch (error) {
      set(state => ({
        // Remove the user message on error
        messages: state.messages.slice(0, -1),
        isSending: false
      }))
      
      const message = error.response?.data?.error || 'Failed to send message'
      toast.error(message)
    }
  },

  startNewConversation: () => {
    set({
      currentConversation: null,
      messages: []
    })
  },

  deleteConversation: async (conversationId) => {
    try {
      await chatService.deleteConversation(conversationId)
      
      set(state => ({
        conversations: state.conversations.filter(conv => conv._id !== conversationId),
        currentConversation: state.currentConversation?._id === conversationId 
          ? null 
          : state.currentConversation,
        messages: state.currentConversation?._id === conversationId 
          ? [] 
          : state.messages
      }))
      
      toast.success('Conversation deleted')
    } catch (error) {
      toast.error('Failed to delete conversation')
    }
  },

  clearMessages: () => {
    set({ messages: [] })
  }
}))

export default useChatStore