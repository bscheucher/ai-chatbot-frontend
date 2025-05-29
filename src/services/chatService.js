import api from './api'

export const chatService = {
  // Send a message
  sendMessage: (messageData) => {
    return api.post('/chat/message', messageData)
  },

  // Get all conversations
  getConversations: () => {
    return api.get('/chat/conversations')
  },

  // Get a specific conversation
  getConversation: (conversationId) => {
    return api.get(`/chat/conversations/${conversationId}`)
  },

  // Delete a conversation
  deleteConversation: (conversationId) => {
    return api.delete(`/chat/conversations/${conversationId}`)
  }
}