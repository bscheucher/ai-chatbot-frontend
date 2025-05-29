import { useState, useMemo } from 'react'
import { 
  MessageSquare, 
  Trash2, 
  Search, 
  Calendar,
  Filter,
  MoreVertical,
  Edit2,
  Archive
} from 'lucide-react'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { useChat } from '../../hooks/useChat'
import Loading from '../ui/Loading'
import Input from '../ui/Input'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

const ConversationList = ({ 
  compact = false, 
  showSearch = true, 
  showFilters = true,
  onSelectConversation,
  className = '' 
}) => {
  const {
    conversations,
    currentConversation,
    isLoading,
    loadConversation,
    deleteConversation
  } = useChat()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterProvider, setFilterProvider] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [conversationToDelete, setConversationToDelete] = useState(null)

  // Filter and sort conversations
  const filteredAndSortedConversations = useMemo(() => {
    let filtered = conversations

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Provider filter
    if (filterProvider !== 'all') {
      filtered = filtered.filter(conv => conv.modelProvider === filterProvider)
    }

    // Sort conversations
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt) - new Date(a.updatedAt)
        case 'oldest':
          return new Date(a.updatedAt) - new Date(b.updatedAt)
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        case 'provider':
          return a.modelProvider.localeCompare(b.modelProvider)
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt)
      }
    })

    return sorted
  }, [conversations, searchQuery, filterProvider, sortBy])

  // Group conversations by date for better organization
  const groupedConversations = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: []
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    filteredAndSortedConversations.forEach(conv => {
      const convDate = new Date(conv.updatedAt)
      
      if (convDate >= today) {
        groups.today.push(conv)
      } else if (convDate >= yesterday) {
        groups.yesterday.push(conv)
      } else if (convDate >= thisWeek) {
        groups.thisWeek.push(conv)
      } else if (convDate >= thisMonth) {
        groups.thisMonth.push(conv)
      } else {
        groups.older.push(conv)
      }
    })

    return groups
  }, [filteredAndSortedConversations])

  const handleSelectConversation = (conversation) => {
    if (onSelectConversation) {
      onSelectConversation(conversation)
    } else {
      if (conversation._id !== currentConversation?._id) {
        loadConversation(conversation._id)
      }
    }
  }

  const handleDeleteClick = (e, conversation) => {
    e.stopPropagation()
    setConversationToDelete(conversation)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (conversationToDelete) {
      await deleteConversation(conversationToDelete._id)
      setDeleteModalOpen(false)
      setConversationToDelete(null)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const getProviderColor = (provider) => {
    const colors = {
      openai: 'bg-green-100 text-green-800',
      anthropic: 'bg-orange-100 text-orange-800',
      google: 'bg-blue-100 text-blue-800'
    }
    return colors[provider] || 'bg-gray-100 text-gray-800'
  }

  const ConversationItem = ({ conversation, showProvider = true }) => (
    <div
      onClick={() => handleSelectConversation(conversation)}
      className={`
        group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm
        ${currentConversation?._id === conversation._id && !onSelectConversation
          ? 'bg-primary-50 border border-primary-200 shadow-sm'
          : 'hover:bg-gray-50 border border-transparent'
        }
        ${compact ? 'p-2' : 'p-3'}
      `}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-3">
          <MessageSquare className={`flex-shrink-0 text-gray-400 ${compact ? 'h-3 w-3' : 'h-4 w-4'}`} />
          <div className="flex-1 min-w-0">
            <p className={`font-medium text-gray-900 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
              {conversation.title}
            </p>
            <div className={`flex items-center space-x-2 ${compact ? 'mt-0.5' : 'mt-1'}`}>
              {showProvider && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium capitalize ${getProviderColor(conversation.modelProvider)}`}>
                  {conversation.modelProvider}
                </span>
              )}
              <span className={`text-gray-500 ${compact ? 'text-xs' : 'text-xs'}`}>
                {formatDate(conversation.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {!compact && (
        <Menu as="div" className="relative">
          <Menu.Button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition-opacity">
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </Menu.Button>
          
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      disabled
                    >
                      <Edit2 className="h-4 w-4 mr-3" />
                      Rename (Coming Soon)
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                      disabled
                    >
                      <Archive className="h-4 w-4 mr-3" />
                      Archive (Coming Soon)
                    </button>
                  )}
                </Menu.Item>
                <div className="border-t border-gray-100"></div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => handleDeleteClick(e, conversation)}
                      className={`${
                        active ? 'bg-red-50' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                    >
                      <Trash2 className="h-4 w-4 mr-3" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )}
    </div>
  )

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loading size={compact ? 'sm' : 'md'} />
      </div>
    )
  }

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Search and Filters */}
      {(showSearch || showFilters) && !compact && (
        <div className="p-4 border-b border-gray-200 space-y-3">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2"
              />
            </div>
          )}
          
          {showFilters && (
            <div className="flex space-x-2">
              <select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
                className="flex-1 text-sm border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="all">All Providers</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google AI</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 text-sm border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">A-Z</option>
                <option value="provider">By Provider</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {searchQuery ? 'Try adjusting your search' : 'Start a new chat to begin'}
            </p>
          </div>
        ) : compact ? (
          // Compact view - simple list
          <div className="space-y-1 p-2">
            {filteredAndSortedConversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                showProvider={false}
              />
            ))}
          </div>
        ) : (
          // Full view - grouped by date
          <div className="p-2 space-y-4">
            {Object.entries(groupedConversations).map(([group, convs]) => {
              if (convs.length === 0) return null
              
              const groupLabels = {
                today: 'Today',
                yesterday: 'Yesterday',
                thisWeek: 'This Week',
                thisMonth: 'This Month',
                older: 'Older'
              }
              
              return (
                <div key={group}>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2">
                    {groupLabels[group]}
                  </h3>
                  <div className="space-y-1">
                    {convs.map((conversation) => (
                      <ConversationItem
                        key={conversation._id}
                        conversation={conversation}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Conversation"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-gray-600">
            Are you sure you want to delete this conversation? This action cannot be undone.
          </p>
          {conversationToDelete && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-900">
                {conversationToDelete.title}
              </p>
              <p className="text-sm text-gray-500">
                {conversationToDelete.modelProvider} • {formatDate(conversationToDelete.updatedAt)}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default ConversationList