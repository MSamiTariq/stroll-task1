import prisma from "../prismaClient";
import moment from "moment-timezone";
import { schedule } from "node-cron";

export const rotateQuestions = async () => {
  try {
    const regions = await prisma.region.findMany({
      include: {
        configuration: true,
      },
    });

    for (const region of regions) {
      const config = region.configuration;
      if (!config) continue;

      const now = moment().tz(region.timeZone);
      const cycleStart = getCycleStart(now, config, region.timeZone);
      const cycleEnd = cycleStart.clone().add(config.cycleDuration, "days");

      // Check if an assignment already exists for this cycle
      const existingAssignment = await prisma.assignment.findFirst({
        where: {
          regionId: region.id,
          cycleStart: cycleStart.toDate(),
        },
      });

      if (existingAssignment) {
        // Assignment already exists for this cycle
        continue;
      }

      // Get the last assigned question index
      const lastAssignment = await prisma.assignment.findFirst({
        where: { regionId: region.id },
        orderBy: { cycleStart: "desc" },
        include: { question: true },
      });

      const questions = await prisma.question.findMany({
        where: { regionId: region.id },
        orderBy: { orderIndex: "asc" },
      });

      let nextQuestionIndex = 0;
      if (lastAssignment && lastAssignment.question) {
        const lastIndex = questions.findIndex(
          (q) => q.id === lastAssignment.questionId
        );
        nextQuestionIndex = (lastIndex + 1) % questions.length;
      }

      const questionToAssign = questions[nextQuestionIndex];

      // Create a new assignment
      await prisma.assignment.create({
        data: {
          regionId: region.id,
          questionId: questionToAssign.id,
          cycleStart: cycleStart.toDate(),
          cycleEnd: cycleEnd.toDate(),
        },
      });

      console.log(
        `Assigned question ${questionToAssign.id} to region ${region.name}`
      );
    }
  } catch (error) {
    console.error("Error rotating questions:", error);
  }
};

function getCycleStart(
  now: moment.Moment,
  config: any,
  timeZone: string
): moment.Moment {
  let cycleStart = now
    .clone()
    .day(config.cycleStartDay)
    .hour(config.cycleStartHour)
    .minute(config.cycleStartMinute)
    .second(0);

  if (now.isAfter(cycleStart)) {
    // If current time is after the cycle start, calculate the next cycle start
    cycleStart.add(config.cycleDuration, "days");
  }

  return cycleStart;
}

export const startScheduler = () => {
  // Schedule the rotateQuestions function
  // For demo purposes, let's run it every minute
  schedule("* * * * *", rotateQuestions);
};
