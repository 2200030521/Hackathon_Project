import bcryptLib from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
    return await bcryptLib.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcryptLib.compare(password, hash);
};

export default {
    hashPassword,
    comparePassword
};
