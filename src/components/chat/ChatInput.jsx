import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import Button from '../ui/Button'

const ChatInput = () => {
  const [message, setMessage] = useState('')
  const { sendMessage, isSending } = useChat()
  const textareaRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!message.trim() || isSending) return

    const messageContent = message.trim()
    setMessage('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    await sendMessage(messageContent)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 120) // Max height of ~4 lines
      textarea.style.height = `${newHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [message])

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          rows={1}
          disabled={isSending}
        />
      </div>
      
      <Button
        type="submit"
        disabled={!message.trim() || isSending}
        loading={isSending}
        className="px-4 py-3"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}

export default ChatInput