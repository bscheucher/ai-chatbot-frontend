import { useEffect, useRef } from 'react'
import { useChat } from '../../hooks/useChat'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import ModelSelector from './ModelSelector'
import Loading from '../ui/Loading'
import { MessageSquare } from 'lucide-react'

const ChatContainer = () => {
  const { messages, isLoading, isSending, currentConversation } = useChat()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Model Selector */}
      <div className="border-b border-gray-200 p-4">
        <ModelSelector />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Start a new conversation
              </h3>
              <p className="text-gray-500 max-w-sm">
                Choose an AI model and send a message to begin chatting.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4">
        <ChatInput />
      </div>
    </div>
  )
}

export default ChatContainer