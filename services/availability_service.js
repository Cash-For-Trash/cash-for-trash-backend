import prisma from "../config/db.js";
import  AppError  from "../utils/app_error.js";
import { toTimeDate } from "../utils/time.js";

export const createAvailability = async (worker_id, data) => {

const {
    area_id,
    day_of_week
} = data;

const from_time = toTimeDate(data.from_time);
const to_time = toTimeDate(data.to_time);

    // Rule 1: Validate time range
    if (from_time >= to_time) {
        throw new AppError(
            "From time must be before to time.",
            400
        );
    }

    return await prisma.$transaction(async (tx) => {

        // Rule 2: Check area exists
        const area = await tx.area.findUnique({
            where: {
                area_id
            }
        });

        if (!area) {
            throw new AppError(
                "Area not found.",
                404
            );
        }

        // Rule 3: Check worker exists
        const worker = await tx.worker.findUnique({
            where: {
                user_id: worker_id
            }
        });

        if (!worker) {
            throw new AppError(
                "Worker not found.",
                404
            );
        }

        // Rule 4: Worker must be approved
        if (!worker.is_approved) {
            throw new AppError(
                "Worker is not approved yet.",
                403
            );
        }

        // Rule 5: Prevent overlapping time in the same day
        const overlap = await tx.workerAvailability.findFirst({

            where: {

                user_id: worker_id,

                availability: {

                    day_of_week,

                    AND: [
                        {
                            from_time: {
                                lt: to_time
                            }
                        },
                        {
                            to_time: {
                                gt: from_time
                            }
                        }
                    ]

                }

            }

        });

        if (overlap) {

            throw new AppError(
                "This availability overlaps with another availability.",
                409
            );

        }

        // Rule 6: Find existing availability
        let availability = await tx.availability.findFirst({

            where: {

                area_id,

                day_of_week,

                from_time,

                to_time

            }

        });

        // Rule 7: Create availability if it doesn't exist
        if (!availability) {

            availability = await tx.availability.create({

                data: {

                    area_id,
                    day_of_week,
                    from_time,
                    to_time

                }

            });

        }

        // Rule 8: Worker already linked?
        const workerAvailability = await tx.workerAvailability.findUnique({

            where: {

                availability_id_user_id: {

                    availability_id: availability.availability_id,
                    user_id: worker_id

                }

            }

        });

        if (workerAvailability) {

            throw new AppError(
                "Availability already added.",
                409
            );

        }

        // Rule 9: Link worker with availability
        await tx.workerAvailability.create({

            data: {

                availability_id: availability.availability_id,
                user_id: worker_id

            }

        });

        return availability;

    });

};