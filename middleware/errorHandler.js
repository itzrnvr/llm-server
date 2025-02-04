// middleware/errorHandler.js
export const handleError = (res, error) => {
    console.error(error);
    res.write(
        `data: ${JSON.stringify({
            error: { message: "Internal server error" },
        })}\n\n`
    );
    res.end();
};

