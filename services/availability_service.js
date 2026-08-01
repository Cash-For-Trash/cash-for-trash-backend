import prisma from "../config/db.js";
import  AppError  from "../utils/app_error.js";
import { toTimeDate,formatTime } from "../utils/time.js";

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
        // if (!worker.is_approved) {
        //     throw new AppError(
        //         "Worker is not approved yet.",
        //         403
        //     );
        // }

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

export const getMyAvailabilities = async (worker_id) => {

    const availabilities =
        await prisma.workerAvailability.findMany({

            where: {
                user_id: worker_id
            },

            include: {

                availability: {

                    include: {
                        area: true
                    }

                }

            },

            orderBy: {
                availability: {
                    day_of_week: "asc"
                }
            }

        });

   return availabilities.map(item => ({

    availability_id: item.availability.availability_id,

    area_id: item.availability.area.area_id,

    area_name: item.availability.area.name,

    day_of_week: item.availability.day_of_week,

    from_time: formatTime(item.availability.from_time),

    to_time: formatTime(item.availability.to_time)

}));

};


export const updateAvailability = async (

    worker_id,
    availability_id,
    data

) => {

    //------------------------------------
    // Rule 1
    //------------------------------------

    const workerAvailability =
        await prisma.workerAvailability.findUnique({

            where: {

                availability_id_user_id: {

                    availability_id,
                    user_id: worker_id

                }

            },

            include: {

                availability: true

            }

        });

    if (!workerAvailability) {

        throw new AppError(

            "Availability not found.",
            404

        );

    }

    //------------------------------------
    // Rule 2
    //------------------------------------

    const area_id =
        data.area_id ??
        workerAvailability.availability.area_id;

    const day_of_week =
        data.day_of_week ??
        workerAvailability.availability.day_of_week;

    const from_time =
        data.from_time ??
        formatTime(workerAvailability.availability.from_time);

    const to_time =
        data.to_time ??
        formatTime(workerAvailability.availability.to_time);

    //------------------------------------
    // Rule 3
    //------------------------------------

    if (from_time >= to_time) {

        throw new AppError(

            "From time must be before To time.",
            400

        );

    }

    //------------------------------------
    // Rule 4
    //------------------------------------

    const area = await prisma.area.findUnique({

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

    //------------------------------------
    // Rule 5
    //------------------------------------

    const overlap =
        await prisma.workerAvailability.findFirst({

            where: {

                user_id: worker_id,

                NOT: {

                    availability_id

                },

                availability: {

                    day_of_week,

                    AND: [

                        {

                            from_time: {

                                lt: toTimeDate(to_time)

                            }

                        },

                        {

                            to_time: {

                                gt: toTimeDate(from_time)

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

    //------------------------------------
    // Rule 6
    //------------------------------------
    // TODO
    //
    // Prevent update if there are
    // assigned collection requests.
    //

    //------------------------------------
    // Rule 7
    //------------------------------------

    let availability =
        await prisma.availability.findFirst({

            where: {

                area_id,

                day_of_week,

                from_time: toTimeDate(from_time),

                to_time: toTimeDate(to_time)

            }

        });

    //------------------------------------
    // Rule 8
    //------------------------------------

    if (!availability) {

        availability =
            await prisma.availability.create({

                data: {

                    area_id,

                    day_of_week,

                    from_time: toTimeDate(from_time),

                    to_time: toTimeDate(to_time)

                }

            });

    }

    //------------------------------------
    // Rule 9
    //------------------------------------

    await prisma.workerAvailability.update({

        where: {

            availability_id_user_id: {

                availability_id,
                user_id: worker_id

            }

        },

        data: {

            availability_id:
                availability.availability_id

        }

    });

    //------------------------------------
    // Rule 10
    //------------------------------------

    const remainingWorkers =
        await prisma.workerAvailability.count({

            where: {

                availability_id

            }

        });

    if (remainingWorkers === 0 &&
        availability_id !== availability.availability_id) {

        await prisma.availability.delete({

            where: {

                availability_id

            }

        });

    }

    //------------------------------------
    // Return
    //------------------------------------

    return {

        availability_id: availability.availability_id,
        area_id: availability.area_id,
        day_of_week: availability.day_of_week,
        from_time: formatTime(availability.from_time),
        to_time: formatTime(availability.to_time)

    };

};