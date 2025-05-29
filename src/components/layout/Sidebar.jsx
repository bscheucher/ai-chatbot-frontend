import { useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import ConversationList from '../chat/ConversationList'
import Button from '../ui/Button'

const Sidebar = () => {
  const { loadConversations, startNewConversation } = useChat()

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  const handleNewChat = () => {
    startNewConversation()
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
      <div className="flex-1 overflow-hidden">
        <ConversationList 
          compact={true}
          showSearch={false}
          showFilters={false}
        />
      </div>
    </div>
  )
}

export default Sidebar