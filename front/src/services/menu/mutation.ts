import { useQuery } from '@tanstack/react-query'
import type { MenuResponse } from '../../types'
import { ObterMenu } from './api'

/**
 * Hook para buscar o menu (público)
 */
export const useObterMenu = (enabled = true) => {
  return useQuery<MenuResponse, Error>({
    queryKey: ['menu'],
    queryFn: () => ObterMenu(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}
