import USER_MODEL from "../models/user.model.js";
import type {User} from "../models/user.model.js";

class UserRepository {
    async findAll(): Promise<User[]> {
        return USER_MODEL.find().exec();
    }

    async findById(id: string): Promise<User | null> {
        const user = await USER_MODEL.findById(id).exec();
        // console.log('found user', user);
        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return USER_MODEL.findOne({ email }).exec();
    }

    async findByRole(role: string): Promise<User[] | null> {
        return USER_MODEL.find({ role: role}).exec();
    }

    async register(user: Partial<User>): Promise<User> {
        return USER_MODEL.create(user);
    }

    async updateById(id: string, update: Partial<User>): Promise<User | null> {
        return USER_MODEL.findByIdAndUpdate(id, update, { new: true }).exec();
    }

    async deleteById(id: string): Promise<User | null> {
        return USER_MODEL.findByIdAndDelete(id).exec();
    }

    
}

export default new UserRepository();