
import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { ROLES } from "../utils/constants.js";
// get user profile
export const getUserProfile = async (userId) => {
    const user=await prisma.user.findUnique({
        where: {
            user_id: userId,
        },
          include: {
            customer: true
        },
    });

    if (!user) {
        throw new AppError(
            "User not found.",
            404
        );
    
    } 
    return {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        image: user.image,
        points: user.customer ? user.customer.points : 0,
    };

    };  

    export const updateUserProfile = async (userId, updateData) => {
        const user = await prisma.user.findUnique({
            where: {
                user_id: userId,
            },
        });
        if (!user) {
            throw new AppError("User not found.", 404);
        }

        const updatedUser = await prisma.user.update({
            where: {
                user_id: userId,
            },
            data: updateData,
        });

        return updatedUser;
    };


    export const deleteUserProfile = async (userId,) => {
        const user = await prisma.user.findUnique({
            where: {
                user_id: userId,
            },
        });
        if (!user) {
            throw new AppError("User not found.", 404);
        }

        await prisma.user.delete({
            where: {
                user_id: userId,
            },
        });
    };

// Change password
export const ChangePassword = async (
    userId,
    oldPassword,
    newPassword,
    confirmPassword
) => {
    const user = await prisma.user.findUnique({
        where: {
            user_id: userId,
        },
    });

    if (!user) {
        throw new AppError("User not found.", 404);
    }

    // Check old password
    const isPasswordValid = await comparePassword(
        oldPassword,
        user.password
    );

    if (!isPasswordValid) {
        throw new AppError("Old password is incorrect.", 400);
    }

    // Prevent using the same password
    const isSamePassword = await comparePassword(
        newPassword,
        user.password
    );

    if (isSamePassword) {
        throw new AppError(
            "New password must be different from the old password.",
            400
        );
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: {
            user_id: userId,
        },
        data: {
            password: hashedPassword,
        },
    });
};
