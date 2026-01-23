import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthorizationService } from 'src/modules/authorization/authorization.service'
import { PERMISSIONS_KEY } from 'src/common/decorators/permission.decorator'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationService: AuthorizationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      )
    // No permissions required → allow
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    /**
     * Auth guard already ran and attached user
     * request.user = { id: string, ... }
     */
    const user = request.user

    if (!user?.id) {
      throw new ForbiddenException('User not authenticated')
    }
    const userPermissionIds = await this.authorizationService.getUserPermissionKeys(user.id);

    const hasAllPermissions = requiredPermissions.every(permission =>
      userPermissionIds.includes(permission),
    )

    if (!hasAllPermissions) {
      throw new ForbiddenException('Insufficient permissions')
    }

    return true
  }
}
