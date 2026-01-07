import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { COLLECTIONS } from '../../../constants/collections';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
