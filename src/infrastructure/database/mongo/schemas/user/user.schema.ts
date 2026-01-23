import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { COLLECTIONS } from 'src/infrastructure/database/constants/collections';

export type UserDocument = User & Document;

@Schema({
  collection: COLLECTIONS.USERS,
  timestamps: true,
})
export class User {
  @Prop()
  name: string;
  
  @Prop()
  age: number;

  @Prop({ default: null }) // NEW FIELD
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
