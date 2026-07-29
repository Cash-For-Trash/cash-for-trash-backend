import prisma from "../config/db.js";

export const calculateWorkerShare = async (servicePrice) => {

    const pricing = await prisma.pricingSettings.findFirst();

    const percentage = Number(pricing.worker_percentage);

    return Number(
        (
            servicePrice * percentage
        ) / 100
    );

};

export const calculatePayment = (
    paymentMethod,
    servicePrice
)=>{

    if(paymentMethod==="MONTHLY"){

        return 0;

    } 

    return servicePrice;

};