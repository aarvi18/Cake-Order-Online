import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";

export const registerController = async (req, res) => {

    try {
        const { name, email, password, phone, address } = req.body;

        //validations
        if (!name) {
            return res.send({ error: 'Name is Required' })
        }
        if (!password) {
            return res.send({ error: 'Password is Required' })
        }
        if (!email) {
            return res.send({ error: 'Email is Required' })
        }
        if (!phone) {
            return res.send({ error: 'Phone No. is Required' })
        }
        if (!address) {
            return res.send({ error: 'Address is Required' })
        }

        // check users
        const exisitingUser = await userModel.findOne({ email });

        //existing user
        if (exisitingUser) {
            return rex.status(200).send({
                success: true,
                message: 'Already Register please login',
            })
        }

        //register user
        const hashedPassword = await hashPassword(password);

        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword
        }).save()

        res.status(201).send({
            success: true,
            message: 'User Register Succesfully',
            user
        });


    } catch (error) {
        console.log(error)
        res.status(500).send({
            seccess: false,
            message: 'Error in Registration',
            error
        })
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid Email or Password'
            })
        }

        // check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not registerd'
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password'
            })
        }

        const token = await JsonWebTokenError.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.status(200).send({
            success: true,
            message: 'Login Successfully',
            user: {
                mame: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            seccess: false,
            message: 'Error in Login',
            error
        })
    }
}
