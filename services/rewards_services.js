import prisma from "../config/db.js";
import AppError from "../utils/app_error.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// Get all rewards
export const getAllRewardsService = async () => {
  try {
    return await prisma.reward.findMany({
      orderBy: {
        created_at: "desc",
      },
    });
  } catch (err) {
    throw new AppError("Failed to fetch rewards.", 500);
  }
};

// Get reward by id
export const getRewardService = async (rewardId) => {
  try {
    const reward = await prisma.reward.findUnique({
      where: {
        reward_id: rewardId,
      },
    });

    if (!reward) {
      throw new AppError("Reward not found.", 404);
    }

    return reward;
  } catch (err) {
    throw new AppError("Failed to fetch rewards.", 500);
  }
};

// Create reward
export const createRewardService = async (createData, file) => {
  try {
    const existingReward = await prisma.reward.findFirst({
      where: {
        name: createData.name,
      },
    });

    if (existingReward) {
      throw new AppError("Reward already exists.", 400);
    }

    let imageUrl = null;

    if (file) {
      const uploadedImage = await cloudinary.uploader.upload(file.path, {
        folder: "rewards",
      });

      imageUrl = uploadedImage.secure_url;

      fs.unlinkSync(file.path);
    }

    return await prisma.reward.create({
      data: {
        name: createData.name,
        required_points: Number(createData.required_points),
        image: imageUrl,
      },
    });
  }catch (err) {
    throw new AppError("Failed to fetch rewards.", 500);
  }
};

// Update reward
export const updateRewardService = async (
  rewardId,
  updateData,
  file
) => {
  try {
    const reward = await prisma.reward.findUnique({
      where: {
        reward_id: rewardId,
      },
    });

    if (!reward) {
      throw new AppError("Reward not found.", 404);
    }

    if (file) {
      const uploadedImage = await cloudinary.uploader.upload(file.path, {
        folder: "rewards",
      });

      updateData.image = uploadedImage.secure_url;

      fs.unlinkSync(file.path);
    }

    if (updateData.required_points) {
      updateData.required_points = Number(updateData.required_points);
    }

    return await prisma.reward.update({
      where: {
        reward_id: rewardId,
      },
      data: updateData,
    });
  } catch (err) {
    throw new AppError("Failed to fetch rewards.", 500);
  }
};

// Delete reward
export const deleteRewardService = async (rewardId) => {
  try {
    const reward = await prisma.reward.findUnique({
      where: {
        reward_id: rewardId,
      },
    });

    if (!reward) {
      throw new AppError("Reward not found.", 404);
    }

    await prisma.reward.delete({
      where: {
        reward_id: rewardId,
      },
    });

    return;
  } catch (err) {
    throw new AppError("Failed to fetch rewards.", 500);
  }
};