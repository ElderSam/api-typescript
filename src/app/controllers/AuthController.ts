import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/Users';

class AuthController {
    async authenticate(req: Request, res: Response) {
        const repository = getRepository(User);
        const { email, password } = req.body;

        const user = await repository.findOne({ where: { email } });

        if(!user) {
            return res.sendStatus(401);
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword) {
            return res.sendStatus(401);
        }

        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' });
        /* the second parameter of sign() is sensitive data,
            so the ideal would be to get it through a dotenv
            or a local file (which does not go to github) in a real application, for security reasons.
        */

        interface auxUser {
            password?: string; // the password can be `undefined`
        }

        const auxUser: auxUser = user;
        delete auxUser.password; // not to send the password to the frontend

        return res.json({
            auxUser,
            token
        });
    }
}

export default new AuthController();