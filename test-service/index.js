const amqp = require("amqplib");

async function start() {
    const connection = await amqp.connect("amqp://rabbitmq");
    const channel = await connection.createChannel();

    await channel.assertQueue("test_queue");
    await channel.assertQueue("deploy_queue");

    channel.consume("test_queue", (msg) => {
        const data = JSON.parse(msg.content.toString());
        console.log("Running tests...");

        setTimeout(() => {
            console.log("Tests passed ✅");

            channel.sendToQueue("deploy_queue", Buffer.from(JSON.stringify(data)));
            channel.ack(msg);
        }, 2000);
    });
}

start();