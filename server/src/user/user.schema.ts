import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import * as bcrypt from "bcryptjs";

export interface UserDocumentMethods {
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

export type UserDocument = HydratedDocument<User> & UserDocumentMethods;
export type UserModel = Model<User, Record<string, never>, UserDocumentMethods>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 50 })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  })
  email!: string;

  @Prop({ required: true, minlength: 6, select: false })
  password!: string;

  @Prop({ default: false })
  isAdmin!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  enteredPassword: string,
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};
