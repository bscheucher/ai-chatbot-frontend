import { useQuery } from '@tanstack/react-query'
import { modelService } from '../services/modelService'

export const useModels = () => {
  const {
    data: modelsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['models'],
    queryFn: modelService.getAllModels,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (renamed from cacheTime in v4)
  })

  const models = modelsData?.data?.data || {}
  
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