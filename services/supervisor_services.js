import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import { hashPassword } from "../utils/hash.js";
import { paginate } from "../utils/pagination.js";
import { ROLES } from "../utils/constants.js";

export const createWorker = async (data) => {
  const { first_name, last_name, email, password, mobile, national_id } = data;

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new AppError("Email already in use.", 409);
  }

  if (national_id) {
    const existingNationalId = await prisma.worker.findUnique({
      where: { national_id },
    });
    if (existingNationalId) {
      throw new AppError("National ID already in use.", 409);
    }
  }

  const hashedPassword = await hashPassword(password);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        mobile: mobile || null,
        role: ROLES.WORKER,
        is_verified: true,
        is_active: true,
      },
    });

    const worker = await tx.worker.create({
      data: {
        user_id: user.user_id,
        national_id: national_id || null,
        is_approved: true,
        approved_at: new Date(),
      },
    });

    return { user, worker };
  });

  return {
    user_id: result.user.user_id,
    first_name: result.user.first_name,
    last_name: result.user.last_name,
    email: result.user.email,
    mobile: result.user.mobile,
    role: result.user.role,
    is_verified: result.user.is_verified,
    is_active: result.user.is_active,
    national_id: result.worker.national_id,
    is_approved: result.worker.is_approved,
    approved_at: result.worker.approved_at,
    created_at: result.user.created_at,
  };
};

export const getWorkers = async (query) => {
  const paginatedResult = await paginate(prisma.user, query, {
    where: { role: ROLES.WORKER },
    include: { worker: true },
  });

  paginatedResult.data = paginatedResult.data.map((user) => ({
    user_id: user.user_id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    mobile: user.mobile,
    image: user.image,
    role: user.role,
    is_verified: user.is_verified,
    is_active: user.is_active,
    national_id: user.worker ? user.worker.national_id : null,
    is_approved: user.worker ? user.worker.is_approved : false,
    approved_at: user.worker ? user.worker.approved_at : null,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }));

  return paginatedResult;
};

export const getWorkerDetails = async (workerId) => {
  const user = await prisma.user.findUnique({
    where: { user_id: workerId },
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
    national_id: user.worker ? user.worker.national_id : null,
    is_approved: user.worker ? user.worker.is_approved : false,
    approved_at: user.worker ? user.worker.approved_at : null,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

export const updateWorker = async (workerId, data) => {
  const { first_name, last_name, email, mobile, national_id, is_active, is_approved } = data;

  const existingUser = await prisma.user.findUnique({
    where: { user_id: workerId },
    include: { worker: true },
  });

  if (!existingUser || existingUser.role !== ROLES.WORKER) {
    throw new AppError("Worker not found.", 404);
  }

  if (email && email !== existingUser.email) {
    const emailConflict = await prisma.user.findUnique({
      where: { email },
    });
    if (emailConflict) {
      throw new AppError("Email already in use.", 409);
    }
  }

  if (national_id && existingUser.worker && national_id !== existingUser.worker.national_id) {
    const nationalIdConflict = await prisma.worker.findUnique({
      where: { national_id },
    });
    if (nationalIdConflict) {
      throw new AppError("National ID already in use.", 409);
    }
  }

  const updatedResult = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { user_id: workerId },
      data: {
        ...(first_name !== undefined && { first_name }),
        ...(last_name !== undefined && { last_name }),
        ...(email !== undefined && { email }),
        ...(mobile !== undefined && { mobile }),
        ...(is_active !== undefined && { is_active }),
      },
    });

    const updatedWorker = await tx.worker.upsert({
      where: { user_id: workerId },
      create: {
        user_id: workerId,
        national_id: national_id || null,
        is_approved: is_approved !== undefined ? is_approved : true,
        approved_at: is_approved ? new Date() : null,
      },
      update: {
        ...(national_id !== undefined && { national_id }),
        ...(is_approved !== undefined && {
          is_approved,
          approved_at: is_approved ? new Date() : existingUser.worker?.approved_at,
        }),
      },
    });

    return { user: updatedUser, worker: updatedWorker };
  });

  return {
    user_id: updatedResult.user.user_id,
    first_name: updatedResult.user.first_name,
    last_name: updatedResult.user.last_name,
    email: updatedResult.user.email,
    mobile: updatedResult.user.mobile,
    role: updatedResult.user.role,
    is_verified: updatedResult.user.is_verified,
    is_active: updatedResult.user.is_active,
    national_id: updatedResult.worker.national_id,
    is_approved: updatedResult.worker.is_approved,
    approved_at: updatedResult.worker.approved_at,
    updated_at: updatedResult.user.updated_at,
  };
};

export const deleteWorker = async (workerId) => {
  const user = await prisma.user.findUnique({
    where: { user_id: workerId },
  });

  if (!user || user.role !== ROLES.WORKER) {
    throw new AppError("Worker not found.", 404);
  }

  await prisma.user.update({
    where: { user_id: workerId },
    data: { is_active: false },
  });

  return { user_id: workerId, is_active: false };
};
