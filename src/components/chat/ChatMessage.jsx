import { User, Bot } from 'lucide-react'

const ChatMessage = ({ message, isLast }) => {
  const isUser = message.role === 'user'
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-xs lg:max-w-md xl:max-w-lg space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
          ${isUser ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}
        `}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Message Content */}
        <div className={`
          px-4 py-3 rounded-lg
          ${isUser 
            ? 'bg-primary-600 text-white' 
            : 'bg-gray-100 text-gray-900'
          }
        `}>
          <div className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </div>
          {message.timestamp && (
            <div className={`
              text-xs mt-2 
              ${isUser ? 'text-primary-100' : 'text-gray-500'}
            `}>
              {formatTime(message.timestamp)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage