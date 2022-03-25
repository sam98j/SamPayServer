import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    // generate salt
    const salt = await bcrypt.genSalt(10);
    // generate hashed password
    const hashedPassword = bcrypt.hash(password, salt);
    // return the result
    return hashedPassword
}
// dehashing the password
export const comparePassword = async (plainPassword: string, hashedPassword: string) => {
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    return isValid
}