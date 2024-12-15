import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId: z.string()
})

export async function POST(req: NextRequest) {
    const session = getServerSession();
    // TODO: replace with id here
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email
        }
    });
    if (!user) {
        return NextResponse.json({
            message: 'unauthenticated'
        }, {
            status: 403
        })
    }
    try {
        const data = UpvoteSchema.parse(req.json());
        await prismaClient.upvote.create({
            data: {
                userId: user.id,
                streamId: data.streamId
            }
        })
    } catch (e) {
        return NextResponse.json({
            message: 'only single choice allowed'
        }, {
            status: 403
        })
    }
}