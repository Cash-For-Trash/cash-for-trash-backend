import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import { paginate } from "../utils/pagination.js";
import { ROLES } from "../utils/constants.js";

export const getCustomers = async (query) => {
  const result = await paginate(prisma.user, query, {
    where: { role: ROLES.CUSTOMER },
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      image: true,
      email: true,
      is_verified: true,
      is_active: true,
    },
  });

  result.data = result.data.map((user) => ({
    id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    image: user.image,
    email: user.email,
    is_verified: user.is_verified,
    is_active: user.is_active,
  }));

  return result;
};

export const getCustomerDetails = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    include: { customer: true },
  });

  if (!user || user.role !== ROLES.CUSTOMER) {
    throw new AppError("Customer not found.", 404);
  }

  return {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    mobile: user.mobile,
    image: user.image,
    role: user.role,
    is_verified: user.is_verified,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at,
    points: user.customer ? Number(user.customer.points) : 0,
  };
};

export const getWorkers = async (query) => {
  const result = await paginate(prisma.user, query, {
    where: { role: ROLES.WORKER },
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      image: true,
      email: true,
      is_verified: true,
      is_active: true,
    },
  });

  result.data = result.data.map((user) => ({
    id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    image: user.image,
    email: user.email,
    is_verified: user.is_verified,
    is_active: user.is_active,
  }));

  return result;
};

export const getWorkerDetails = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    include: { worker: true },
  });

  if (!user || user.role !== ROLES.WORKER) {
    throw new AppError("Worker not found.", 404);
  }

  return {
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    mobile: user.mobile,
    image: user.image,
    role: user.role,
    is_verified: user.is_verified,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at,
    national_id: user.worker ? user.worker.national_id : null,
    is_approved: user.worker ? user.worker.is_approved : false,
    approved_at: user.worker ? user.worker.approved_at : null,
  };
};
