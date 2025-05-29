import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { 
  User, 
  Mail, 
  Settings, 
  Palette, 
  Bot,
  Save,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useModels } from '../hooks/useModels'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Loading from '../components/ui/Loading'

const Profile = () => {
  const { user, updatePreferences, isLoading } = useAuth()
  const { allModels, isLoading: modelsLoading } = useModels()
  const [activeTab, setActiveTab] = useState('profile')
  const [isUpdating, setIsUpdating] = useState(false)

  // Profile form
  const profileForm = useForm({
    defaultValues: {
      username: user?.username || '',
      email: user?.email || ''
    }
  })

  // Preferences form
  const preferencesForm = useForm({
    defaultValues: {
      defaultModel: user?.preferences?.defaultModel || 'openai',
      theme: user?.preferences?.theme || 'light'
    }
  })

  const handleUpdatePreferences = async (data) => {
    setIsUpdating(true)
    try {
      await updatePreferences(data)
    } finally {
      setIsUpdating(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock }
  ]

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                      ${activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Profile Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Avatar Section */}
                    <div className="sm:col-span-2">
                      <div className="flex items-center space-x-6">
                        <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-10 w-10 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Profile Picture</h4>
                          <p className="text-sm text-gray-500">
                            Avatar customization coming soon
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="relative">
                      <User className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                      <Input
                        label="Username"
                        className="pl-10"
                        disabled
                        {...profileForm.register('username')}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Username cannot be changed
                      </p>
                    </div>

                    {/* Email */}
                    <div className="relative">
                      <Mail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
                      <Input
                        label="Email Address"
                        type="email"
                        className="pl-10"
                        disabled
                        {...profileForm.register('email')}
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Bot className="h-8 w-8 text-primary-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Member Since</p>
                          <p className="text-sm text-gray-500">
                            {new Date(user?.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Settings className="h-8 w-8 text-green-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Account Status</p>
                          <p className="text-sm text-green-600">Active</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Palette className="h-8 w-8 text-blue-600" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Theme</p>
                          <p className="text-sm text-gray-500 capitalize">
                            {user?.preferences?.theme || 'Light'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <form onSubmit={preferencesForm.handleSubmit(handleUpdatePreferences)}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Chat Preferences
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Default Model */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default AI Model
                        </label>
                        <select
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          {...preferencesForm.register('defaultModel')}
                        >
                          <option value="openai">OpenAI</option>
                          <option value="anthropic">Anthropic</option>
                          <option value="google">Google AI</option>
                        </select>
                        <p className="mt-2 text-sm text-gray-500">
                          This will be selected by default for new conversations
                        </p>
                      </div>

                      {/* Theme */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Theme
                        </label>
                        <select
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          {...preferencesForm.register('theme')}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                        <p className="mt-2 text-sm text-gray-500">
                          Choose your preferred interface theme
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Available Models Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Available AI Models
                    </h4>
                    {modelsLoading ? (
                      <Loading size="sm" />
                    ) : (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {['openai', 'anthropic', 'google'].map((provider) => {
                          const providerModels = allModels.filter(m => m.provider === provider)
                          const colors = {
                            openai: 'text-green-600 bg-green-50 border-green-200',
                            anthropic: 'text-orange-600 bg-orange-50 border-orange-200',
                            google: 'text-blue-600 bg-blue-50 border-blue-200'
                          }
                          
                          return (
                            <div key={provider} className={`p-3 rounded-lg border ${colors[provider]}`}>
                              <h5 className="font-medium capitalize mb-1">{provider}</h5>
                              <p className="text-xs opacity-75">
                                {providerModels.length} models available
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      loading={isUpdating}
                      disabled={isUpdating}
                      className="flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Preferences</span>
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Security Settings
                  </h3>
                  
                  {/* Password Section */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <Lock className="h-6 w-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Password</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Your password was last updated when you created your account.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3"
                          disabled
                        >
                          Change Password (Coming Soon)
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <Settings className="h-6 w-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Account Security</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Your account is secured with JWT authentication. Sessions expire automatically for security.
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Two-factor authentication:</span>
                            <span className="text-gray-500">Not available</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Login notifications:</span>
                            <span className="text-gray-500">Not available</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data & Privacy */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <User className="h-6 w-6 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">Data & Privacy</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Your chat conversations are stored securely and are only accessible by you.
                        </p>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Data encryption:</span>
                            <span className="text-green-600">Enabled</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Conversation history:</span>
                            <span className="text-gray-600">Private</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-sm font-medium">!</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-red-900">Danger Zone</h4>
                        <p className="text-sm text-red-700 mt-1">
                          Account deletion is not currently available. Contact support if you need assistance.
                        </p>
                        <Button
                          variant="danger"
                          size="sm"
                          className="mt-3"
                          disabled
                        >
                          Delete Account (Coming Soon)
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile