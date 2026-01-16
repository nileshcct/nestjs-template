import 'dotenv/config';
import { connect, model } from 'mongoose';
import { User, UserSchema } from 'src/infrastructure/database/mongo/schemas/user/user.schema';

export async function up() {
  await connect(process.env.DATABASE_URL!);

  const UserModel = model<User>('User', UserSchema);

  const result = await UserModel.updateMany(
    { phone: { $exists: false } },
    { $set: { phone: null } }
  );

  console.log(`add phone field to ${result.modifiedCount} users`);
}
