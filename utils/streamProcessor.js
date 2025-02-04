import {handleError} from '../middleware/errorHandler.js'

export async function processStream(completion, streamer) {
    try {
        for await (const chunk of completion) {
            const choice = chunk.choices[0];
            const content = choice?.delta?.content || "";
            const finishReason = choice?.finish_reason || null;

            const chunkData = streamer.createChunk(content, finishReason);
            streamer.sendChunk(chunkData);

            if (finishReason) {
                streamer.hasSentFinishReason = true;
                break;
            }
        }
    } catch (error) {
        handleError(streamer.res, error);
    } finally {
        streamer.endStream();
    }
}