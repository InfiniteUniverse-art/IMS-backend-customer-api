
const logger = {
    info: (message: string) => {
        const timestamp = new Date().toISOString();
        // \x1b[32m is the ANSI escape code for Green
        console.log(`[\x1b[32m${timestamp}\x1b[0m] INFO: ${message}`);
    },
    error: (message: string) => {
        const timestamp = new Date().toISOString();
        // \x1b[31m is the ANSI escape code for Red
        console.error(`[\x1b[31m${timestamp}\x1b[0m] ERROR: ${message}`);
    },
    warn: (message: string) => {
        const timestamp = new Date().toISOString();
        // \x1b[33m is the ANSI escape code for Yellow
        console.warn(`[\x1b[33m${timestamp}\x1b[0m] WARN: ${message}`);
    }
};

export default logger;