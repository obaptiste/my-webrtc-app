//This component would display a list of video messages, potentially retrieved from the server using gRPC. Each video message could be represented as a separate component or rendered as a list item.
import React from 'react';
import VideoPlayer from './videoPlayer';
import { VideoMessage } from '@prisma/client';


const VideoMessageItem = ({message}) = {
    return (
        <div className="video-message-item">
        <h3>{message.title}<\h3>
        <p> {Message.description}</p>
        <VideoPlayer url={message.url} />
        </div>
    )
</h3>
    )
}