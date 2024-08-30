import mongoose, { Document, Model, Schema } from 'mongoose';

export type User = {
    _id: mongoose.Types.ObjectId; 
    username: string;
    email: string;
    password: string;
    refreshToken?: string;
};

export type UserCreateDto = Omit<User, '_id'>;
export type UserUpdateDto = Partial<UserCreateDto>;


export interface IUserDocument extends Omit<User, '_id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUserDocument>(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>('User', UserSchema);

export default UserModel;
