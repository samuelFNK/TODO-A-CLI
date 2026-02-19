import readline from 'node:readline';

export function inputWithPrefill(message, prefill) {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(message, answer => {
            rl.close();
            resolve(answer || prefill);
        });

        rl.write(prefill);

    });
}