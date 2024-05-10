const { Client } = require('whatsapp-web.js');
const fs = require('fs');
const { AssemblyAI } = require('assemblyai');
const qrcode = require('qrcode-terminal');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let apiKey, phoneNumber;
console.log('Link par obter a chave API: https://www.assemblyai.com \n')
rl.question('Por favor, insira a chave da API da AssemblyAI: ', (answer) => {
    apiKey = answer;

    rl.question('Agora, insira o número de telefone: ', (answer) => {
        phoneNumber = answer;

        rl.close();

        startClient();
    });
});

function startClient() {
    const client = new Client({
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        }
    });

    client.on('qr', qr => {
        console.log('Iniciou');
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        console.log('Tudo certo! WhatsApp conectado.');
    });

    client.on('message', async msg => {
        if (msg.type === 'ptt') {
            try {
                console.log("Voice Clip Received");
                console.log(msg.id);

                // Faz o download do áudio
                const media = await msg.downloadMedia();

                // Salva o áudio em um arquivo local
                const binaryData = Buffer.from(media.data, 'base64');
                fs.writeFile('audio.ogg', binaryData, async function (err) {
                    if (err) {
                        console.error('Erro ao salvar arquivo de áudio:', err);
                    } else {
                        console.log('Arquivo de áudio salvo com sucesso!');

                        // Realiza a transcrição do áudio
                        const assemblyaiClient = new AssemblyAI({
                            apiKey: apiKey
                        });

                        const params = {
                            audio: 'audio.ogg',
                            language_code: 'pt'
                        };

                        const transcript = await assemblyaiClient.transcripts.transcribe(params);
                        console.log(transcript.text);

                        // Envia a transcrição junto com a mensagem de áudio
                        const contact = await msg.getContact();
                        const name = contact.pushname;
                        client.sendMessage(phoneNumber + '@c.us', `Mensagem de *${name}*\n\nTranscrição do áudio 🤖:\n\n${transcript.text}`);
                    }
                });
            } catch (error) {
                console.error('Erro ao processar áudio:', error);
            }
        }
    });

    client.initialize();
}
