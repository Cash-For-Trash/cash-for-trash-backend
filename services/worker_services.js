import prisma from "../config/db.js";
import { AppError } from "../utils/appError.js";
import { ROLES } from "../utils/constants.js";

export const approveWorker = async (workerId) => {

    const worker = await prisma.worker.findUnique({
        where: {
            user_id: workerId
        },
        include: {
            user: true
        }
    });

    if (!worker) {
        throw new AppError(
            "Worker not found.",
            404
        );
    }

    if (worker.user.role !== ROLES.WORKER) {
        throw new AppError(
            "This user is not a worker.",
            400
        );
    }

    if (worker.is_approved) {
        throw new AppError(
            "Worker already approved.",
            409
        );
    }

    const updatedWorker = await prisma.worker.update({

        where: {
            user_id: workerId
        },

        data: {

            is_approved: true,

            approved_at: new Date()

        },

        include: {
            user: {
                select: {
                    first_name: true,
                    last_name: true,
                    email: true,
                    mobile: true
                }
            }
        }

    });

    return updatedWorker;
};