import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

function serializePrisma(obj) {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) {
        return obj.map(serializePrisma);
    }
    if (typeof obj === "object") {
        if (obj.constructor?.name === "Decimal" || (obj.d !== undefined && obj.e !== undefined && obj.s !== undefined)) {
            return obj.toString();
        }
        if (obj instanceof Date) {
            return obj.toISOString();
        }
        const newObj = {};
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (typeof val === "bigint") {
                newObj[key] = val.toString();
            } else if (val && typeof val === "object" && (val.constructor?.name === "Decimal" || (val.d !== undefined && val.e !== undefined && val.s !== undefined))) {
                newObj[key] = val.toString();
            } else if (val instanceof Date) {
                newObj[key] = val.toISOString();
            } else if (val && typeof val === "object") {
                newObj[key] = serializePrisma(val);
            } else {
                newObj[key] = val;
            }
        }
        return newObj;
    }
    return obj;
}

export async function GET(request, { params }) {
    const { campaign_id } = await params;

    const id = parseInt(campaign_id, 10);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 });
    }

    const campaign = await prisma.campaigns.findUnique({
        where: { campaign_id: BigInt(id) },
        include: {
            users: {
                select: {
                    name: true,
                    profile_image: true,
                },
            },
            donations: {
                where: { status: "success" },
                orderBy: { donated_at: "desc" },
                take: 10,
                select: {
                    donor_name: true,
                    amount: true,
                    message: true,
                    donated_at: true,
                },
            },
        },
    });

    if (!campaign) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(serializePrisma(campaign));
}