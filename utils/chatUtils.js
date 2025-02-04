// utils/chatUtils.js
export const generateCompletionConfig = (body) => ({
    model: "deepseek-ai/deepseek-r1",
    messages: body.messages,
    temperature: body.temperature,
    top_p: body.top_p,
    max_tokens: 4096,
    stream: true,
});



