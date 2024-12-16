
import { prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";
import axios from "axios";
import { getServerSession } from "next-auth";
// import youtubesearchapi from 'youtube-search-api';

const CreatorSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})


const YT_REGEX = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;

// Helper function to extract YouTube video ID
// function getYoutubeVideoId(url: string): string | null {
//     try {
//         const urlObj = new URL(url);
//         if (urlObj.hostname.includes('youtu.be')) {
//             return urlObj.pathname.slice(1);
//         }
//         const videoId = urlObj.searchParams.get('v');
//         return videoId && videoId.length === 11 ? videoId : null;
//     } catch {
//         return null;
//     }
// }

const getYoutubeVideoId = (url: string) => {
    const regex =
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

export async function POST(req: NextRequest) {
    try {
        const data = CreatorSchema.parse(await req.json());
        const isYt = YT_REGEX.test(data.url);

        if (!isYt) {
            return NextResponse.json({
                message: "Invalid YouTube URL format",
            }, {
                status: 400
            });
        }
        const extractedId = getYoutubeVideoId(data.url);

        if (!extractedId) {
            return NextResponse.json({
                message: "Could not extract YouTube video ID",
            }, {
                status: 404
            });
        }

        const response = await axios.get(
            `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${extractedId}`
        );
        const videoDetails = await response.data;

        // const videoDetails = await youtubesearchapi.GetVideoDetails(extractedId);
        // const thumbnails = videoDetails?.thumbnail.thumbnails;
        // thumbnails.sort((a: { width: number }, b: { height: number }) => a.width < b.height ? 1 : -1);

        const existingStream = await prismaClient.stream.findFirst({
            where: {
                extractedId,
                type: 'YOUTUBE',
            }
        });
        if (existingStream) {
            return NextResponse.json({
                message: { title: "Stream already in queue", description: "Vibe Matched !!" },
            })
        }
        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: 'YOUTUBE',
                title: videoDetails.title ?? "Can't Find",
                // smlImg: thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url ?? "https://img.freepik.com/free-photo/cute-cat-spending-time-indoors_23-2150649172.jpg?t=st=1734280662~exp=1734284262~hmac=6fea58159e5df9f17cd4393c7aade9bf0abd63fdc9e1f263e2c69be607ef433e&w=1060",
                // bigImg: thumbnails[thumbnails.length - 1].url ?? "https://img.freepik.com/free-photo/cute-cat-spending-time-indoors_23-2150649172.jpg?t=st=1734280662~exp=1734284262~hmac=6fea58159e5df9f17cd4393c7aade9bf0abd63fdc9e1f263e2c69be607ef433e&w=1060"
                smlImg: videoDetails.thumbnail_url,
                bigImg: videoDetails.thumbnail_url
            }
        });

        return NextResponse.json({
            message: { title: "Stream added successfully", description: "Enjoy your songs !!" },
            id: stream.id
        }, {
            status: 201
        });
    } catch (error) {
        return NextResponse.json({
            message: "Error while adding stream",
            error: error instanceof Error ? error.message : "Unknown error"
        }, {
            status: 500
        });
    }
}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const session = await getServerSession();

    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })

    if (!user) {
        return NextResponse.json({
            message: { title: "Unauthenticated", description: "Sign In to interact with the content" }
        }, {
            status: 403
        })
    }

    if (!creatorId) {
        return NextResponse.json({
            message: { title: "No creatorId found" }
        }, {
            status: 411
        })
    }
    const [streams, activeStream] = await Promise.all([await prismaClient.stream.findMany({
        where: {
            userId: creatorId
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
    }),
    await prismaClient.currentStream.findFirst({
        where: {
            userId: creatorId
        },
        include: {
            stream: true
        }
    })])

    return NextResponse.json({
        streams: streams.map(({ _count, ...rest }) => ({
            ...rest,
            upvotes: _count.upvotes, // to reduce the count to root level
            hasUpvoted: rest.upvotes.length ? true : false
        })),
        activeStream
    });
}