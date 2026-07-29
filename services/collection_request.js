

export const createCollectionRequest = async (
    userId,
    data
)=>{
    const{
address_id,
availability_id,
payment_method,
quantity,
collection_img,
garbage_types
}=data;

const address=await prisma.address.findFirst({

where:{

address_id,

user_id:userId

}

});

if(!address){

throw new AppError(
"Address not found.",
404
);

}

const area=await prisma.area.findFirst({

where:{

is_active:true,

north_lat:{
gte:address.latitude
},

south_lat:{
lte:address.latitude
},

east_lng:{
gte:address.longitude
},

west_lng:{
lte:address.longitude
}

}

});

if(!area){

throw new AppError(

"Service is unavailable in your area.",

400

);

}

const availability =
await prisma.availability.findFirst({

    where:{

        availability_id,

        area_id:area.area_id

    }

});

if(!availability){

    throw new AppError(

        "Availability not found.",

        404

    );

}


const availableWorkers =
await prisma.workerAvailability.findMany({

    where:{

        availability_id:
            availability.availability_id,

        worker:{

            is_approved:true

        }

    },

    include:{

        worker:{

            include:{

                workerRequests:{

                    where:{

                        is_current:true,

                        collectionRequest:{

                            status:{

                                in:[
                                    "PENDING",
                                    "NEEDS_RESCHEDULE",
                                    "ACCEPTED",
                                    "ON_THE_WAY"
                                ]
                            }

                        }

                    }

                }

            }

        }

    }

});

if(availableWorkers.length===0){

    throw new AppError(

        "No available workers.",

        400

    );

}

availableWorkers.sort(

    (a,b)=>

        a.worker.workerRequests.length-

        b.worker.workerRequests.length

);

const selectedWorker =
availableWorkers[0];


if(payment_method==="MONTHLY"){

const subscription=

await prisma.subscription.findFirst({

where:{

user_id:userId,

is_active:true,

end_date:{
gte:new Date()
}

}

});

if(!subscription){

throw new AppError(

"Monthly subscription is inactive.",

400

);

}

}

const ids=

garbage_types.map(

g=>g.garbage_type_id

);

const types=

await prisma.garbageType.findMany({

where:{

garbage_type_id:{

in:ids

}

}

});

const typeMap = new Map(
    types.map(type => [
        type.garbage_type_id,
        type
    ])
);

if(types.length!==ids.length){

throw new AppError(

"One or more garbage types are invalid.",

404

);

}
const result = await prisma.$transaction(async (tx) => {

    // Create Collection Request

    const request =
    await tx.collectionRequest.create({

        data:{

            user_id:userId,

            address_id,

            quantity,

            collection_img,

            status:"PENDING",

            scheduled_day:
                availability.day_of_week,

            scheduled_from_time:
                availability.from_time,

            scheduled_to_time:
                availability.to_time,

            service_price:servicePrice,

            worker_share:workerShare

        }

    });

    // Garbage Types

    await tx.requestGarbage.createMany({

        data:garbage_types.map(item=>({

            collection_request_id:
                request.collection_request_id,

            garbage_type_id:
                item.garbage_type_id

        }))

    });

    // Payment

    if(payment_method === "CASH"){

        await tx.payment.create({

            data:{

                collection_request_id:
                    request.collection_request_id,

                payment_method:"CASH",

                payment_status:"PENDING",

                payment_amount:servicePrice

            }

        });

    }

    // Worker Assignment

    await tx.workerCollectionRequest.create({

        data:{

            user_id:
                selectedWorker.user_id,

            collection_request_id:
                request.collection_request_id,

            assigned_at:new Date(),

            is_current:true

        }

    });

    return request;

});

await createNotification(
    selected.user_id,
    "New Collection Request",
    "A new collection request has been assigned to you."
);

return result;
};

