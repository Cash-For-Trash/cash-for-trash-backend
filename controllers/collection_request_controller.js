import * as CollectionRequestServices from "../services/collection_request_services.js";

import { successResponse }from "../utils/response.js";

export const createCollectionRequest = async (
    req,
    res,
    next
)=>{

    try{

        const request = await CollectionRequestServices.createCollectionRequest(

            req.user.user_id,

            req.body

        );

        successResponse(

            res,

            "Collection request created successfully.",

            request,

            201

        );

    }

    catch(err){

        next(err);

    }

};