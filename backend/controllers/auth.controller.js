import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import redis from '../lib/redis.js';

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    
    return { accessToken, refreshToken };
}
const storeRefreshToken = async (userId, refreshToken) => {
    try {
        await redis.set(`refreshToken:${userId}`, refreshToken, { ex: 7 * 24 * 60 * 60 });
    } catch (error) {
        console.error('Failed to store refresh token in Redis:', error.message);
    }
}
const setCookie = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true, //prevent XSS
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict', //CSRF protection
        maxAge: 15 * 60 * 1000 // 15 min
    })
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
    });
}


export const signup = async (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const userExists = await User.findOne({ email });   
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }   
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
         //authenticate
         const { accessToken, refreshToken } = generateTokens(user._id);
         await storeRefreshToken(user._id, refreshToken);

         setCookie(res, accessToken, refreshToken);

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles
            }
        ,
             message: 'User registered successfully' });
    } catch (error) {   
        res.status(500).json({ message: 'Server error' });
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookie(res, accessToken, refreshToken);
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                roles: user.roles
            },
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                await redis.del(`refreshToken:${decoded.userId}`);
            } catch (error) {
                console.error('Failed to delete refresh token from Redis:', error.message);
            }
        }
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}