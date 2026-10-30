# Beast Maragames

App mobile de estudo de criação de jogos com confiança declarada, feito pelo grupo Mobile Builders para a Beast Maragames, na disciplina de Programação Mobile da UNDB. Feito com Expo (React Native) e Firebase.

O aluno percorre lições organizadas em módulos e, a cada questão, diz o quanto tem certeza da resposta. O app cruza acerto e confiança para mostrar o que a pessoa sabe de fato e o que só acha que sabe.

A arquitetura, o ciclo da lição e o que fica no banco estão em [docs/arquitetura.md](docs/arquitetura.md).

## O que o app tem

- **Conta:** login e cadastro com e-mail e senha, redefinição de senha e perfil completado no primeiro acesso.
- **Termo e autoavaliação:** antes da primeira lição, a pessoa aceita o termo de consentimento, que sorteia a forma (A ou B) do diagnóstico, e dá uma nota de 1 a 5 para o quanto já sabe de cada módulo com questões (hoje, só Fundamentos de Game Design).
- **Boas-vindas:** a primeira tela depois do login, que só apresenta o app: a logo, o lobinho da Beast Maragames, a chamada "Solte a fera do game design", o botão Iniciar, a Configuração (a escolha do tema claro ou escuro) e as Regras do jogo (lição, certeza, XP, resultado e sequência). O Iniciar leva à home.
- **Home:** o cartão "Para hoje", com o próximo passo sugerido, o XP, a sequência de dias e as revisões agendadas.
- **Lições:** o módulo Fundamentos de Game Design, com 5 lições. Cada lição segue o ciclo diagnóstico → cartão de conceito → prática → verificação → revisão 7 dias depois. Os outros 5 módulos aparecem como "em breve".
- **Progresso:** domínio por tópico e as respostas divididas em quadrantes (Firme, Frágil, Ponto cego e Lacuna).
- **Perfil:** dados do cadastro, "Sobre você", tema claro ou escuro, o termo aceito e a saída da conta.

## Tecnologias

- [Expo](https://expo.dev) SDK 58 com [expo-router](https://docs.expo.dev/router/introduction/), React Native e TypeScript
- Firebase Authentication e Cloud Firestore
- Jest e Testing Library, com o emulador do Firestore para as regras

## Como rodar

### Pré-requisitos

- Node.js 22 (22.13 ou mais novo) ou 24 (24.3 ou mais novo), com npm
- Um projeto Firebase próprio, com:
  - **Authentication** com o provedor "E-mail/senha" ativado;
  - **Cloud Firestore** criado;
  - um **app web** registrado (é dele que sai a configuração do `.env`).
- Java 21 ou mais novo, só para os testes das regras do Firestore

### Passo a passo

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha com a configuração do app web do seu projeto Firebase:

   ```bash
   cp .env.example .env
   ```

3. Entre na sua conta do Firebase pelo terminal (abre o navegador para o login):

   ```bash
   npx firebase login
   ```

4. Publique as regras do Firestore no seu projeto:

   ```bash
   npx firebase deploy --only firestore:rules --project <id-do-seu-projeto>
   ```

5. Grave o conteúdo das lições no banco (ver [Conteúdo](#conteúdo)).

6. Abra o app:

   ```bash
   npm start       # escolha web, Android ou iOS no menu do Expo
   npm run web     # direto no navegador
   ```

   No celular, abra o QR code com o Expo Go.

## Scripts

| Comando | O que faz |
|---|---|
| `npm start` | Sobe o servidor do Expo |
| `npm run web` / `android` / `ios` | Sobe o Expo já na plataforma escolhida |
| `npm test` | Testes da lógica do app (`src/lib`), das telas e dos componentes (nativo e web) |
| `npm run test:watch` | Os mesmos testes, rodando de novo a cada mudança |
| `npm run test:regras` | Testes das regras do Firestore no emulador (precisa de Java) |
| `npm run tipos` | Checagem de tipos do TypeScript |
| `npm run lint` | ESLint |
| `npm run seed:conteudo:check` | Valida o conteúdo de `content/` sem gravar nada |
| `npm run seed:conteudo` | Valida e grava o conteúdo no Firestore |
| `npm run relatorio -- --simulado 100` | Gera o relatório de uma turma de 100 alunos virtuais, sem ler o banco |
| `npm run exportar -- --simulado 100` | Grava a mesma turma em tabelas CSV e no banco fictício, sem ler o banco |

## Conteúdo

As lições e as questões ficam em `content/`, e o JSON é a fonte da verdade:

- `content/topicos.json`: os tópicos, a lição de cada um e os slides do cartão de conceito;
- `content/questoes.json`: as questões (forma A, forma B e prática);
- `content/em-breve.json`: os módulos que ainda não têm questões, só com os títulos das lições.

Para mudar uma questão, edite o JSON e rode o seed de novo. Os ids são fixos, então rodar duas vezes atualiza em vez de duplicar.

```bash
npm run seed:conteudo:check            # só valida, não precisa de credencial
npm run seed:conteudo                  # valida e grava
npm run seed:conteudo -- --prune       # grava e apaga questões que saíram do JSON
```

## Relatório e turma simulada

O relatório para a Beast Maragames é uma página só, com os números da turma em conjunto e nada que identifique alguém: ganho do diagnóstico para a verificação, retenção na revisão, calibração da confiança, quadrantes e perfis de resposta.

Para ver o relatório funcionando antes de haver uma turma usando o app, o `--simulado` sorteia alunos virtuais de perfis variados, que respondem às lições com as mesmas regras do app (`src/lib/simulacao.ts`). Nada disso lê ou grava o Firestore, e a página avisa no topo que os dados são simulados.

```bash
npm run relatorio -- --simulado 100 --semente 1250808581   # a mesma semente gera sempre a mesma turma
npm run relatorio -- --simulado 100 --cenario nulo         # um cenário só: base, nulo, confianca_cega, forma_b_dificil ou certeza_protege
npm run exportar -- --simulado 100 --semente 1250808581    # a mesma turma em tabelas CSV
```

Os cenários servem para conferir as contas. No **nulo** ninguém aprende nem esquece, e o relatório tem que mostrar ganho perto de zero; na **confiança cega** a certeza não depende de saber, e a calibração tem que cair a zero.

O relatório sai em `relatorio/simulado/` e as tabelas em `exportacao/`, duas pastas fora do git. Sem `--simulado`, os dois comandos leem o Firestore e pedem a chave de conta de serviço (ver [Conteúdo](#conteúdo)).

Gravar no Firestore pede a chave de conta de serviço do projeto em `serviceAccountKey.json`, na raiz. Para gerá-la, abra o console do Firebase em **Configurações do projeto → Contas de serviço → Gerar nova chave privada** e salve o arquivo baixado com esse nome. A chave dá acesso total ao banco: ela está no `.gitignore`, nunca deve entrar no repositório e não deve ser enviada a ninguém.

## Estrutura

```
src/
  app/          telas e rotas (expo-router); (app)/ é a parte logada
  components/   componentes das telas
  hooks/        busca de dados para as telas
  lib/          regras do app em funções puras (lição, XP, quadrantes, sequência...)
  data/         contrato de acesso ao banco e a implementação com Firebase
  constants/    textos, tema e termo
  types/        tipos do domínio (perfil, questão, resposta...)
  test/         apoio aos testes (repositório em memória)
  __tests__/    testes das telas; os de cada pasta ficam no __tests__/ dela
assets/         ícone, splash, logo e mascote
content/        lições e questões em JSON
regras/         testes das regras do Firestore
scripts/        seed do conteúdo, exportação e relatório
firestore.rules regras de segurança do banco
docs/           documentação
```

## Entregas

O app é entregue em partes ao longo da disciplina. O que entra em cada uma está no fim de [docs/arquitetura.md](docs/arquitetura.md#entregas).
