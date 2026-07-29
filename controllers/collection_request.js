import * as CollectionRequestService
from "../services/collection_request_service.js";

import { successResponse }from "../utils/response.js";

export const createCollectionRequest = async (
    req,
    res,
    next
)=>{

    try{

        const request =
        await CollectionRequestService.createCollectionRequest(

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