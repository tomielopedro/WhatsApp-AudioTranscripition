# Whatsapp-AudioTranscription

## Descrição
Esse projeto foi feito com o objetivo de transcrever mensagens de áudio recebidas no WhatsApp para texto.

## Funcionamento

O código monitora as mensagens recebidas, as mensagens que forem do tipo áudio são baixadas e enviadas para uma API de transcrição de áudio para texto. 

Após passar pela API a transcrição é enviada como mensagem de texto para um número selecionado pelo usário

## Como usar

### Instalar dependências
    npm install

### Rodar
    node main.js

### Dados necessários



#### - Link para pegar a chave da API
https://www.assemblyai.com

#### - Formato do número

##### CÓDIGO DO PAÍS + DDD + NÚMERO(sem 9 na frente)
    ex: 555499999999

### Conectar
    Basta ler o QR-CODE gerado no terminal
