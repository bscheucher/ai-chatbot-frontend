import { useEffect } from 'react'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import Button from '../ui/Button'
import Loading from '../ui/Loading'

const Sidebar = () => {
  const {
    conversations,
    currentConversation,
    isLoading,
    loadConversations,
    loadConversation,
    startNewConversation,
    deleteConversation
  } = useChat()

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const handleNewChat = () => {
    startNewConversation()
  }

  const handleSelectConversation = (conversation) => {
    if (conversation._id !== currentConversation?._id) {
      loadConversation(conversation._id)
    }
  }

  const handleDeleteConversation = (e, conversationId) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(conversationId)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <Loading />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs text-gray-400">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => handleSelectConversation(conversation)}
                className={`
                  group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                  ${currentConversation?._id === conversation._id
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-100'
                  }
                `}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conversation.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500 capitalize">
                      {conversation.modelProvider}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(conversation.updatedAt)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => handleDeleteConversation(e, conversation._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity"
                  title="Delete conversation"
                >
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar