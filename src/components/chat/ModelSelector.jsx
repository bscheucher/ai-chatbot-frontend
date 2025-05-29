import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronsUpDown, Check } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import { useModels } from '../../hooks/useModels'
import Loading from '../ui/Loading'

const ModelSelector = () => {
  const { selectedModel, setSelectedModel, currentConversation } = useChat()
  const { allModels, isLoading } = useModels()

  // Don't allow model changes for existing conversations
  const isDisabled = !!currentConversation || isLoading

  const handleModelChange = (model) => {
    if (!isDisabled) {
      setSelectedModel({
        provider: model.provider,
        name: model.id
      })
    }
  }

  const getCurrentModel = () => {
    return allModels.find(model => 
      model.provider === selectedModel.provider && 
      model.id === selectedModel.name
    ) || { name: `${selectedModel.provider} - ${selectedModel.name}`, provider: selectedModel.provider }
  }

  const getProviderColor = (provider) => {
    const colors = {
      openai: 'text-green-600 bg-green-50',
      anthropic: 'text-orange-600 bg-orange-50',
      google: 'text-blue-600 bg-blue-50'
    }
    return colors[provider] || 'text-gray-600 bg-gray-50'
  }

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loading size="sm" />
        <span className="text-sm text-gray-500">Loading models...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-700">Model:</span>
      
      <Listbox value={getCurrentModel()} onChange={handleModelChange} disabled={isDisabled}>
        <div className="relative">
          <Listbox.Button className={`
            relative w-64 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          `}>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getProviderColor(getCurrentModel().provider)}`}>
                {getCurrentModel().provider}
              </span>
              <span className="block truncate">{getCurrentModel().name}</span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {allModels.map((model) => (
                <Listbox.Option
                  key={`${model.provider}-${model.id}`}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                    }`
                  }
                  value={model}
                >
                  {({ selected }) => (
                    <>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getProviderColor(model.provider)}`}>
                          {model.provider}
                        </span>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {model.name}
                        </span>
                      </div>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {currentConversation && (
        <span className="text-xs text-gray-500">
          (Model locked for existing conversation)
        </span>
      )}
    </div>
  )
}

export default ModelSelector