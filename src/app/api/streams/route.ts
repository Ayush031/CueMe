import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";


const CreatorSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

const YT_REGEX = new RegExp(`^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$`)



export async function POST(req: NextRequest) {
    try {
        const data = CreatorSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);
        if (!isYt) {
            return NextResponse.json({
                message: "Invalid URL format",
            }, {
                status: 411
            })
        }
        const extractedId = data.url.split("?v=")[1];
        await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: 'YOUTUBE'
            }
        })
    } catch (error) {
        return NextResponse.json({
            message: "Error while adding a Stream",
        }, {
            status: 411
        })
    }
}