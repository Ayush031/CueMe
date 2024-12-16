import { prismaClient } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })
    if (!user) {
        return NextResponse.json({
            message: "unauthenticated"
        }, {
            status: 403
        })
    }

    const streams = await prismaClient.stream.findMany({
        where: {
            userId: user.id
        },
        include: {
            _count: { // add a key count 
                select: { // and select 
                    upvotes: true // the upvote column and count total
                }
            },
            upvotes: { // checks if current user has voted or not 
                where: {
                    userId: user.id
                }
            }
        }
    })

    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
            ...rest,
            upvotes: _count.upvotes, // to reduce the count to root level
            hasUpvoted: rest.upvotes.length ? true : false
        }))
    });
}