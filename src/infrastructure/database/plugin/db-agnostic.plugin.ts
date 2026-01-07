
import { Schema } from 'mongoose';

export const dbAgnosticPlugin = (schema: Schema) => {
  const transform = (doc: any, ret: Record<string, any>, options?: any): Record<string, any> => {
    // Ensure we have a string ID
    if (ret._id && typeof ret._id === 'object') {
      ret.id = ret._id.toString();
    } else if (ret._id) {
      ret.id = ret._id;
    }

    // Remove MongoDB internal fields
    delete ret._id;
    delete ret.__v;

    return ret;
  };

  // set toObject for service layer logic
  schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: transform,
  });

  // set toJSON for controller/API responses
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: transform,
  });
};