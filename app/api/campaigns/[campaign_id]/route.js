import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { claim_campaign_fund } from "@/app/services/campaign-services";

function serializePrisma(obj) {                                 
    //What does it do?
     // The helper recursively traverses the returned data object and converts:

    // BigInt fields (like campaign_id and user_id) to standard string representations (e.g., "6").
    // Decimal fields (like goal_amount and current_amount) to string numbers (e.g., "1000.00").
    // Date objects (like created_at or donated_at) to standard ISO strings ("2026-06-23T14:27:09.898Z").
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
                take: 5,
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


export async function POST(request, { params }){
    const { campaign_id } = await params;

    const id = parseInt(campaign_id, 10);
    if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 });
    }

    try {
        const result = await claim_campaign_fund(id);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}