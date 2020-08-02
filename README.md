# 📸 Scraping de comentários do Instagram

Retorna um JSON mais amigável, resultante de scraping de comentários das
postagens do Instagram.

Este projeto utiliza uma biblioteca que facilita o uso da API do Instagram. O
foco é retornar os comentários de postagens de determinado(s) usuário(s), dentro
de um período de tempo escolhido.

É necessário login, para que assim a API possa acessar os usuários que estão com
conta privada. Esses usuários precisam ter lhe dado permissão para seguir para
assim poder fazer scraping de seus comentários.

Foi criado um formulário para preencher com mais facilidade estas informações.
Está tudo sendo passado pera URL pois a intenção deste projeto é ser executado
localmente, no seu computador, e nunca online.

Ao clicar em enviar, será aberta uma nova aba, que poderá demorar um tempo até
que termine de carregar. A aba então retornará um arquivo JSON, separado por
usuário, suas postagens e comentários.

## 📌 Tecnologias

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [instagram-web-api](https://github.com/jlobos/instagram-web-api)
- [minimist](https://www.npmjs.com/package/minimist)

## 📂 Instalação

```sh
git clone https://github.com/giordanna/br-scraping-instagram.git

cd br-scraping-instagram

# instala as dependências do projeto
npm i
```

## 🚀 Execução

```sh
node server.js
# ou
npm start
```

Ele usa por padrão a porta 8080. Você pode trocar utilizando --port ou -p, como
nos exemplos abaixo:

```sh
node server.js --port=4000
# ou
node server.js -p 4000
```

Agora é só visitar https://localhost:8080/ (ou com outra porta que você
definir). Lá terá um formulário que facilita bem o uso do projeto.

### 💻 Usando cURL

Se achar melhor fazer através do terminal, o uso se segue da seguinte forma:

```sh
curl -X GET "http://localhost:8080/scrap?usuario=usuario&senha=senha&usuarios=usuario1,usuario2&inicio=DD/MM/AAAA&fim=DD/MM/AAAA&quantidade_posts=56"

# ou, de uma forma mais legível

curl -X GET -G \
-d 'usuario=usuario' \
-d 'senha=senha' \
-d 'usuarios=usuario1,usuario2' \
-d 'inicio=DD/MM/AAAA' \
-d 'fim=DD/MM/AAAA' \
-d 'quantidade_posts=56' \
http://localhost:8080/scrap
```

### 🔎 Observações

- Há um limite no número de requisições que se pode fazer na API do Instagram.
  Não sei ao certo o número, mas após eu testar muito o meu projeto o Instagram
  começou a me retornar mensagem de erro, dizendo pra eu esperar uns minutos
  antes de tentar novamente. Após aguardar uns minutos pude voltar a utilizar a
  API

## 📕 Licença

Lançado em 2020. Projeto sob a
[Licença MIT](https://choosealicense.com/licenses/mit/).

Feito com ❤️ por [Giordanna De Gregoriis](https://github.com/giordanna).
