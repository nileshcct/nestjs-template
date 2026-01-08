import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get(':id')
  @SuccessMessage('User fetched successfully.')
  async get(@Param('id') id: string, @Req() req : Request) {
    return await this.userService.getUser(id);
  }

  @Patch(':id')
  @SuccessMessage('User updated successfully.')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  @SuccessMessage('User deleted successfully.')
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}
