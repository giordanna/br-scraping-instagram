# Scrapping de comentários do Instagram

Retorna um JSON mais amigável, resultante de scrapping de comentários das
postagens do Instagram.

### Requisitos

- Node.js (utilizei v10.16.0): https://nodejs.org/en/

## Instalação

```sh
git clone https://github.com/giordanna/br-scrapping-instagram.git (ou só baixa mesmo o projeto)
npm i
node server.js (ou npm run start)
```

Ele usa por padrão a porta 8080. Você pode trocar utilizando --port ou -p, como
nos exemplos abaixo:

```sh
node server.js --port=4000
node server.js -p 4000
```

## Execução

```sh
node server.js (ou npm run start)
```

Ele usa por padrão a porta 8080. Você pode trocar utilizando --port ou -p, como
nos exemplos abaixo:

```sh
node server.js --port=4000
node server.js -p 4000
```

Agora é só visitar https://localhost:8080/ (ou com outra porta que você
definir). Lá terá um formulário que facilita bem o uso do projeto.

### Usando cURL

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

## Bibliotecas utilizadas

- express: https://expressjs.com/pt-br/
- instagram-web-api: https://github.com/jlobos/instagram-web-api
- minimist: https://www.npmjs.com/package/minimist

## Licença

MIT License
