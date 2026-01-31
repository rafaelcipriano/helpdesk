# HELP DESK API
## Sobre

A API é para uma plataforma de gerenciamento de chamados para serviços de TI, o cliente inicia um chamado descrevendo o seu problema e selecionando o serviço que ele precisa. O chamado é atribuído a um técnico de acordo com sua disponibilidade, uma vez que o técnico recebe um chamado ele tem opção de adicionar um serviço adicional caso seja necessário. Um administrador é responsável por gerenciar os técnicos e fazer demais acompanhamentos dos clientes e seus chamados.

## Como executar o projeto localmente.

Você irá precisar do Node.js, Docker e o Insomnia instalados em sua máquina. Após isso execute os códigos no terminal em sequência.

```terminal
npm install                        //Instala as dependências do projeto.
npm run infra:start                //Inicia a imagem do docker.
npx prisma migrate dev --name init //Cria as tabelas no banco de dados.
npx prisma generate                //Gera a pasta do prisma para fazer a conexão com o banco de dados.
npx prisma db seed                 //Preenche o banco de dados com registros pré-prontos.
npm run dev                        //Inicia o servidor localmente.

// Opcionais
npm run dev:test // Inicia os testes da API.
npm run build    // Gera uma build do projeto.
```