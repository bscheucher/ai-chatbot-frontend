import { useQuery } from 'react-query'
import { modelService } from '../services/modelService'

export const useModels = () => {
  const {
    data: modelsData,
    isLoading,
    error,
    refetch
  } = useQuery(
    'models',
    modelService.getAllModels,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    }
  )

  const models = modelsData?.data || {}
  
  // Format models for easier use
  const formattedModels = Object.entries(models).map(([provider, modelList]) => ({
    provider,
    models: modelList.map(model => ({
      id: model.id,
      name: model.name,
      provider
    }))
  }))

  // Get all models as flat array
  const allModels = formattedModels.flatMap(({ models }) => models)

  return {
    models: formattedModels,
    allModels,
    isLoading,
    error,
    refetch
  }
}