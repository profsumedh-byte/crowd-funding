"use server";

import prisma from "@/app/lib/prisma";

export async function createCampaign(data) {
  const campaign = await prisma.campaigns.create({
    data
  });

  return {
    success:200, message:"Image added to DB"
  };
}