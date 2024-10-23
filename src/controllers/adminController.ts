import { Request, Response } from "express";
import prisma from "../prismaClient";

export const addQuestion = async (req: Request, res: Response) => {
  try {
    const { content, orderIndex, regionCode } = req.body;

    const region = await prisma.region.findUnique({
      where: { code: regionCode },
    });

    if (!region) {
      res.status(404).json({ error: "Region not found" });
      return;
    }

    const question = await prisma.question.create({
      data: {
        content,
        orderIndex,
        regionId: region.id,
      },
    });

    res.json({ message: "Question added successfully", question });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateConfiguration = async (req: Request, res: Response) => {
  try {
    const {
      regionCode,
      cycleDuration,
      cycleStartDay,
      cycleStartHour,
      cycleStartMinute,
    } = req.body;

    const region = await prisma.region.findUnique({
      where: { code: regionCode },
    });

    if (!region) {
      res.status(404).json({ error: "Region not found" });
      return;
    }

    const configuration = await prisma.configuration.upsert({
      where: { regionId: region.id },
      update: {
        cycleDuration,
        cycleStartDay,
        cycleStartHour,
        cycleStartMinute,
      },
      create: {
        cycleDuration,
        cycleStartDay,
        cycleStartHour,
        cycleStartMinute,
        regionId: region.id,
      },
    });

    res.json({ message: "Configuration updated successfully", configuration });
  } catch (error) {
    console.error("Error updating configuration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};