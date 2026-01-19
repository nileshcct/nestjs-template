import 'dotenv/config';
import { model } from 'mongoose';
import { User, UserSchema } from 'src/infrastructure/database/mongo/schemas/user/user.schema';

const UserModel = model<User>('User', UserSchema);
export async function up() {
  const result = await UserModel.updateMany(
    { phone: { $exists: false } },
    { $set: { phone: null } }
  );

  console.log(`add phone field to ${result.modifiedCount} users`);
}
export async function down() {
  // Rollback: remove phone field if it was added
    await UserModel.updateMany(
    { phone: null },
    { $unset: { phone: '' } }
  );

  console.log('rollback: phone field removed');
}