import { Request, Response } from "express";
import prisma from "../prismaClient";
import moment from "moment-timezone";
import redisClient from "../redisClient";

export const getCurrentQuestion = async (req: Request, res: Response) => {
  try {
    const regionCode = req.query.region as string;
    if (!regionCode) {
      res.status(400).json({ error: "Region code is required" });
      return; // Add return after response to avoid further execution
    }

    const cacheKey = `currentQuestion:${regionCode}`;
    const cachedQuestion = await redisClient.get(cacheKey);

    if (cachedQuestion) {
      res.json({ question: cachedQuestion });
      return; // Add return here too
    }

    // Fetch from the database if not in cache
    const region = await prisma.region.findUnique({
      where: { code: regionCode },
      include: {
        configuration: true,
      },
    });

    if (!region) {
      res.status(404).json({ error: "Region not found" });
      return;
    }

    const now = moment().tz(region.timeZone);

    const assignment = await prisma.assignment.findFirst({
      where: {
        regionId: region.id,
        cycleStart: {
          lte: now.toDate(),
        },
        cycleEnd: {
          gt: now.toDate(),
        },
      },
      include: {
        question: true,
      },
    });

    if (!assignment) {
      res
        .status(500)
        .json({ error: "No question assigned for the current cycle" });
      return;
    }

    const questionContent = assignment.question.content;

    // Cache the question with an expiration time (e.g., cycle duration)
    const config = region.configuration;
    const cycleDurationInSeconds = config
      ? config.cycleDuration * 24 * 60 * 60
      : 7 * 24 * 60 * 60; // Default to 7 days

    await redisClient.setEx(cacheKey, cycleDurationInSeconds, questionContent);

    res.json({ question: questionContent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
