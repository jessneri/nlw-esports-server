import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { formatHoursToMinutes } from "./utils/formatHoursToMinutes";
import { formatMinutesToHours } from "./utils/formatMinutesToHours";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });

  return res.json(games);
});

app.post("/games/:id/ads", async (request, response) => {
  const gameId = request.params.id;
  const body: any = request.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      hourEnd: formatHoursToMinutes(body.hourEnd),
      hourStart: formatHoursToMinutes(body.hourStart),
      useVoiceChannel: body.useVoiceChannel,
      weekDays: body.weekDays.join(","),
    },
  });

  return response.json(ad);
});

app.get("/games/:id/ads", async (request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      discord: false,
      game: true,
      gameId: true,
      hourEnd: true,
      hourStart: true,
      name: true,
      useVoiceChannel: true,
      weekDays: true,
      yearsPlaying: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return response.json(
    ads.map((ad) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(","),
        hourStart: formatMinutesToHours(ad.hourStart),
        hourEnd: formatMinutesToHours(ad.hourEnd),
      };
    })
  );
});

app.get("/ads/:id/discord", async (request, response) => {
  const adId = request.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: { discord: true },
    where: { id: adId },
  });

  return response.json({
    discord: ad.discord,
  });
});

app.listen(3333);
