import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AUTH_CREDENTIAL_REPOSITORY, AUTH_IDENTITY_REPOSITORY, AUTH_SESSION_REPOSITORY, REFRESH_TOKEN_REPOSITORY } from 'src/infrastructure/database/database.constants';
import * as authSessionRepository  from 'src/modules/auth/domain/repositories/auth-session.repository';
import * as refreshTokenRepository from 'src/modules/auth/domain/repositories/refresh-token.repository';
import * as authIdentityRepository from 'src/modules/auth/domain/repositories/auth-identity.repository';
import * as authCredentialRepository from 'src/modules/auth/domain/repositories/auth-credential.repository';
@Controller('user')
export class UsersController {
  constructor(
    @Inject(AUTH_IDENTITY_REPOSITORY) private readonly identityRepo: authIdentityRepository.AuthIdentityRepository,
    @Inject(AUTH_CREDENTIAL_REPOSITORY) private readonly credentialRepo: authCredentialRepository.AuthCredentialRepository,
    @Inject(AUTH_SESSION_REPOSITORY) private readonly authSessionRepo : authSessionRepository.AuthSessionRepository ,
    @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepo: refreshTokenRepository.RefreshTokenRepository,
    private readonly userService: UsersService
  ) {}
  @Get()
  @SuccessMessage('User fetched successfully.')
  async get(@CurrentUser() user : {sub : string}) {
    console.log('user :>> ', user);
    return await this.userService.getUser(user.sub);
  }

  @Patch()
  @SuccessMessage('User updated successfully.')
  async updateUser(@CurrentUser() user : {sub : string}, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(user.sub, dto);
  }

  @Delete()
  @SuccessMessage('User deleted successfully.')
  async deleteUser(@CurrentUser() user : {sub : string}) {
   await this.userService.getUser(user.sub);
    await Promise.all([
      this.authSessionRepo.deleteByUserId(user.sub),
      this.refreshTokenRepo.deleteByUserId(user.sub),
      this.identityRepo.deleteByUserId(user.sub),
      this.credentialRepo.deleteByUserId(user.sub),
      this.userService.deleteUser(user.sub)
    ]);
  }
}
