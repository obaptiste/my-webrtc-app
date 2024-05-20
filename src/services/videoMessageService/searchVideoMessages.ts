import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import {
  SearchVideoMessagesRequest,
  SearchVideoMessagesResponse,
  VideoMessageMetadata,
} from "../../../generated/video_message_pb.d";
import prisma from "../../../lib/prisma";
import { VideoNotFoundError } from "@/lib/errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

async function searchVideoMessages(
  call: ServerUnaryCall<
    SearchVideoMessagesRequest,
    SearchVideoMessagesResponse
  >,
  callback: sendUnaryData<SearchVideoMessagesResponse>,
) {
  const request = call.request;
  const query = request.getQuery();
  const recipientId = request.getRecipientId();
  const pageSize = request.getPageSize();
  const pageToken = request.getPageToken();
  const startTime = request.getStartTime();
  const endTime = request.getEndTime();

  try {
    const videoMessages = await prisma.videoMessage.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
        recipientId: parseInt(recipientId),
        createdAt: {
          gte: startTime ? new Date(startTime) : undefined,
          lte: endTime ? new Date(endTime) : undefined,
        },
      },
      take: pageSize,
      skip: pageToken ? 1 : 0,
      orderBy: { createdAt: "desc" },
      include: { videoChunks: true },
    });

    if (videoMessages.length === 0) {
      throw new VideoNotFoundError("No matching video messages found.");
    }

    const response = new SearchVideoMessagesResponse();
    const videoMessageMetadata: VideoMessageMetadata[] = videoMessages.map(
      (videoMessage) => {
        const metadata = new VideoMessageMetadata();
        metadata.setId(videoMessage.id);
        metadata.setTitle(videoMessage.title);
        metadata.setDescription(videoMessage.description);
        metadata.setCreatedAt(videoMessage.createdAt.toISOString());
        metadata.setCreatedBy(videoMessage.createdBy);
        metadata.setSize(videoMessage.size);
        metadata.setDuration(videoMessage.duration);
        return metadata;
      },
    );

    response.setMessagesList(videoMessageMetadata);
    response.setTotalCount(videoMessageMetadata.length);
    callback(null, response);
  } catch (error) {
    if (error instanceof VideoNotFoundError) {
      callback(
        {
          code: status.NOT_FOUND,
          message: error.message,
        },
        null,
      );
      return;
    } else if (error instanceof PrismaClientKnownRequestError) {
      callback(
        {
          code: status.INTERNAL,
          message:
            "A database error occurred while searching for video messages.",
        },
        null,
      );
    } else {
      console.error("Error searching for video messages:", error);
      callback(
        {
          code: status.INTERNAL,
          message:
            "An unexpected error occurred while searching for video messages.",
        },
        null,
      );
    }
  }
}

export default searchVideoMessages;
