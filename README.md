# Beast Maragames

App mobile de estudo de criação de jogos com confiança declarada, feito pelo grupo Mobile Builders para a Beast Maragames, na disciplina de Programação Mobile da UNDB. Feito com Expo (React Native) e Firebase.

A arquitetura, o ciclo da lição e o que fica no banco estão em [docs/arquitetura.md](docs/arquitetura.md).

## Como rodar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha com a configuração do app web do projeto Firebase.

3. Abra o app na web ou no Expo Go:

   ```bash
   npm start
   ```

## Testes

```bash
npm test
npm run test:regras
npm run tipos
npm run lint
```

- `npm test` roda os testes das regras do app, das telas e dos componentes.
- `npm run test:regras` roda os testes das regras do Firestore no emulador e precisa de Java.

## Conteúdo

As lições e as questões ficam em `content/`. `npm run seed:conteudo:check` só valida o conteúdo; gravar no Firestore pede a chave de serviço do projeto, que não fica no repositório.
