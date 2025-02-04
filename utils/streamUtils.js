export class ResponseStreamer {
    constructor(res, model) {
        this.res = res;
        this.model = model;
        this.responseId = `chatcmpl-${Math.random()
            .toString(36)
            .substring(2, 15)}`;
        this.created = Math.floor(Date.now() / 1000);
        this.hasSentFinishReason = false;

        this._initHeaders();
    }

    _initHeaders() {
        this.res.setHeader("Content-Type", "text/event-stream");
        this.res.setHeader("Cache-Control", "no-cache");
        this.res.setHeader("Connection", "keep-alive");
    }

    createChunk(content, finishReason = null) {
        const delta = finishReason ? {} : { content };
        return {
            id: this.responseId,
            object: "chat.completion.chunk",
            created: this.created,
            model: this.model,
            choices: [
                {
                    index: 0,
                    delta,
                    finish_reason: finishReason,
                },
            ],
        };
    }

    sendChunk(chunk) {
        this.res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    sendFinalChunk() {
        if (!this.hasSentFinishReason) {
            const finalChunk = this.createChunk("", "stop");
            this.sendChunk(finalChunk);
            this.hasSentFinishReason = true;
        }
    }

    endStream() {
        this.sendFinalChunk();
        this.res.end();
    }
}
