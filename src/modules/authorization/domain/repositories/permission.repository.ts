export interface PermissionRepository {
  create(data: {
    key: string
    domain: string
    action: string
  }): Promise<any>

  findById(id: string): Promise<any | null>
  findByKey(key: string): Promise<any | null>
  findAll(): Promise<any[]>

  update(
    id: string,
    data: Partial<{
      key: string
      domain: string
      action: string
    }>,
  ): Promise<any>

  delete(id: string): Promise<void>
}
