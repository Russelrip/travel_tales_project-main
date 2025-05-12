import bcrypt from 'bcrypt';

export async function hashPassword(plainPassword: string): Promise<{ passwordHash: string, passwordSalt: string }> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(plainPassword, salt);
    return { passwordHash: hash, passwordSalt: salt };
}

// export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
//     return await bcrypt.compare(plainPassword, hashedPassword);
// }

export async function comparePassword(plainPassword: string, passwordSalt: string, storedHash: string): Promise<boolean> {
    const hashToCompare = await bcrypt.hash(plainPassword, passwordSalt);
    return hashToCompare === storedHash;
}