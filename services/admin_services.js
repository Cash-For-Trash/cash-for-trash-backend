import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import { paginate } from "../utils/pagination.js";
import { ROLES } from "../utils/constants.js";
import { hashPassword } from "../utils/hash.js";

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
      customer: {
        select: {
          points: true,
        },
      },
    },
  });

  result.data = result.data.map(({ customer, ...user }) => ({
    ...user,
    points: customer ? Number(customer.points) : 0,
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
  const workers= await paginate(prisma.user, query, {
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
  return workers
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

// update pointSetting for customer cash value

export const updatePointSettings = async ({ points, cash_value }) => {
  const pointSetting = await prisma.pointSetting.findFirst({
    where: {
      is_active: true,
    },
  });

  if (!pointSetting) {
    return await prisma.pointSetting.create({
      data: {
        points,
        cash_value,
        is_active: true,
      },
    });
  }

  return await prisma.pointSetting.update({
    where: {
      id: pointSetting.id,
    },
    data: {
      points,
      cash_value,
    },
  });
};

export const createSupervisor = async (data) => {
  const { first_name, last_name, email, password, mobile } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("Email already in use.", 409);
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
        role: ROLES.SUPERVISOR,
        is_verified: true,
        is_active: true,
      },
    });

    const supervisor = await tx.supervisor.create({
      data: {
        user_id: user.user_id,
      },
    });

    return { user, supervisor };
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
    created_at: result.user.created_at,
  };
};
  
export const getSupervisors = async (query) => {
  return await paginate(prisma.user, query, {
    where: { role: ROLES.SUPERVISOR },
    select: {
      user_id: true,
      first_name: true,
      last_name: true,
      image: true,
      email: true,
      mobile: true,
      is_verified: true,
      is_active: true,
      created_at: true,
      updated_at: true,
    },
  });
};


export const getSupervisorDetails = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
  });

  if (!user || user.role !== ROLES.SUPERVISOR) {
    throw new AppError("Supervisor not found.", 404);
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
  };
};

export const updateSupervisor = async (userId, data) => {
  const { first_name, last_name, email, mobile, is_active } = data;

  const existingUser = await prisma.user.findUnique({
    where: { user_id: userId },
  });

  if (!existingUser || existingUser.role !== ROLES.SUPERVISOR) {
    throw new AppError("Supervisor not found.", 404);
  }

  if (email && email !== existingUser.email) {
    const emailConflict = await prisma.user.findUnique({
      where: { email },
    });
    if (emailConflict) {
      throw new AppError("Email already in use.", 409);
    }
  }

  const updatedUser = await prisma.user.update({
    where: { user_id: userId },
    data: {
      ...(first_name !== undefined && { first_name }),
      ...(last_name !== undefined && { last_name }),
      ...(email !== undefined && { email }),
      ...(mobile !== undefined && { mobile }),
      ...(is_active !== undefined && { is_active }),
    },
  });

  return {
    user_id: updatedUser.user_id,
    first_name: updatedUser.first_name,
    last_name: updatedUser.last_name,
    email: updatedUser.email,
    mobile: updatedUser.mobile,
    role: updatedUser.role,
    is_verified: updatedUser.is_verified,
    is_active: updatedUser.is_active,
    updated_at: updatedUser.updated_at,
  };
};

export const deleteSupervisor = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
  });

  if (!user || user.role !== ROLES.SUPERVISOR) {
    throw new AppError("Supervisor not found.", 404);
  }

  await prisma.user.update({
    where: { user_id: userId },
    data: { is_active: false },
  });

  return { user_id: userId, is_active: false };
};
