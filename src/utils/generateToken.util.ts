import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config({path: './config.env'});

const JWT_SECRET = process.env.JWT_SECRET || '12345678901234567890123456789012';

const generateToken = async(id:string, role: string):Promise<string> => {
 return jwt.sign({id: id, role: role}, JWT_SECRET,{expiresIn:'5d'})
}

export default generateToken