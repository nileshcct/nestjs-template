export interface RoleRepository {
  create(data: { key: string; description?: string }): Promise<any>
  findById(id: string): Promise<any | null>
  findByKey(key: string): Promise<any | null>
  findAll(): Promise<any[]>
  update(
    id: string,
    data: Partial<{ key: string; description?: string }>,
  ): Promise<any>
  delete(id: string): Promise<void>
}
