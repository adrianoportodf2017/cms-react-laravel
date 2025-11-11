import { axiosConfig } from '../../lib/axios'
import type { MenuResponse } from '../../types'
 

/**
 * Busca menu dinâmico (PÚBLICO)
 * Observação: segue o mesmo padrão dos outros services públicos (ex.: /pages/{slug})
 */
export const ObterMenu = async (): Promise<MenuResponse> => {
  const response = await axiosConfig.get<MenuResponse>('/menu', {
    headers: { Accept: 'application/json' },
  })
  // garante shape mínimo
  const data = response.data ?? { menuItems: [], bottomMenuItems: [] }
  return { menuItems: data.menuItems ?? [], bottomMenuItems: data.bottomMenuItems ?? [] }
}

