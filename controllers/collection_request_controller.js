import * as CollectionRequestServices from "../services/collection_request_services.js";

import { successResponse }from "../utils/response.js";
import { paginationResponse } from "../utils/response.js";
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


export const getCustomerCollectionRequest = async (
    req,
    res,
    next
)=>{
    try{
        const queryParams = req.query;
        const requests = await CollectionRequestServices.getCustomerCollectionRequestService(req.user.user_id,queryParams);
        paginationResponse(
            res,
            "Collection requests fetched successfully",
            {
     page: requests.page,
     page_size: requests.page_size,
     total_items: requests.total_items,
     total: requests.total_pages
            },
            requests.data,
            200

        );
    }
    catch(err){
        next(err);
    }
};