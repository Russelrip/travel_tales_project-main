import { prisma } from "../prisma";
import { RegisteredUser } from "../models/registered-user";
import { BaseRepository } from "./base-repository";


export class RegisteredUserRepository extends BaseRepository<RegisteredUser, 'id' | 'createdAt'> {

    constructor() {
        super(prisma.registeredUser);
    }

    async findByEmail(email: string): Promise<RegisteredUser | null> {
        try {
            return await this.model.findUnique({
                where: { email }
            });
        } catch (error: any) {
            throw new Error(`Failed to find user by email: ${error.message}`);
        }
    }
}