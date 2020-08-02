const argv = require('minimist')(process.argv.slice(2));
const Instagram = require('instagram-web-api');
const express = require('express');
const server = express();

// porta padrão
let port = 8080;

// se passar como argumento, utiliza a porta escolhida
if (argv.port !== undefined) {
  let portParse = parseInt(argv.port);

  if (!isNaN(portParse)) {
    port = portParse;
  }
} else if (argv.p !== undefined) {
  let portParse = parseInt(argv.p);

  if (!isNaN(portParse)) {
    port = portParse;
  }
}

// endpoint GET /scrap
// argumentos obrigatórios da query: usuario, senha, usuarios, inicio, fim
// formato esperado de usuarios: user1,user2,user3,...
// formatos esperados do inicio e fim: DD/MM/AAAA
// espera-se que início seja menor que fim. devolve exceção caso contrário
server.get('/scrap', async (req, res) => {
  const { usuario, senha, usuarios, inicio, fim, quantidade_posts } = req.query;

  // retorna erro se qualquer um dos itens aleatórios estiver faltando
  if (
    usuario === undefined ||
    senha === undefined ||
    usuarios === undefined ||
    inicio === undefined ||
    fim === undefined
  ) {
    return res.status(500).send({
      argumentosPassados: req.query,
      erro:
        'Uso correto: /scrap?usuario=usuario&senha=senha&usuarios=usuario1,usuario2&inicio=DD/MM/AAAA&fim=DD/MM/AAAA&quantidade_posts=56',
    });
  }

  const quantidadePosts =
    quantidade_posts !== undefined && !isNaN(parseInt(quantidade_posts))
      ? parseInt(quantidade_posts)
      : 56;

  // separa usuários, transformando em um array
  const usuariosLista = usuarios.split(',');

  // converte manualmente a string DD/MM/AAAA para números
  const diaInicio = parseInt(inicio.substring(0, 2));
  const mesInicio = parseInt(inicio.substring(3, 5));
  const anoInicio = parseInt(inicio.substring(6, 10));

  // verifica se estava mal formatado
  if (isNaN(diaInicio) || isNaN(mesInicio) || isNaN(anoInicio)) {
    return res.status(500).send({
      dataInicio: inicio,
      error: 'Data de início está mal formatada. Formato esperado: DD/MM/AAAA',
    });
  }

  // cria objeto do tipo Date
  const dataInicio = new Date(anoInicio, mesInicio - 1, diaInicio, 0, 0);

  // converte manualmente a string DD/MM/AAAA para números
  const diaFim = parseInt(fim.substring(0, 2));
  const mesFim = parseInt(fim.substring(3, 5));
  const anoFim = parseInt(fim.substring(6, 10));

  // verifica se estava mal formatado
  if (isNaN(diaFim) || isNaN(mesFim) || isNaN(anoFim)) {
    return res.status(500).send({
      dataFim: fim,
      error: 'Data de fim está mal formatada. Formato esperado: DD/MM/AAAA',
    });
  }

  // cria objeto do tipo Date
  const dataFim = new Date(anoFim, mesFim - 1, diaFim, 23, 59);

  // verifica se a data de início passou da data fim
  if (dataInicio > dataFim) {
    return res.status(500).send({
      error: 'Data de início está maior que a data de fim',
    });
  }

  // prepara array que será retornado na consulta
  let postsDeUsuarios = [];

  const client = new Instagram(
    { username: usuario, password: senha },
    { language: 'pt-BR' },
  );

  // tenta realizar login com as credenciais passadas no argumento
  await client.login().catch(error => {
    // retorna erro caso aconteça (login não sucedido, credenciais erradas, timeout, etc). erro estará no formato que a API do Instagram retorna
    return res.status(500).send(error);
  });

  // para cada usuário listado, será consultado suas postagens e será filtrado entre os ranges de tempo determinado no início
  for (let i = 0; i < usuariosLista.length; i++) {
    const resp = await client
      .getPhotosByUsername({
        username: usuariosLista[i],
        first: quantidadePosts,
      })
      .catch(error => {
        // retorna erro caso aconteça (usuário não existe, não tem acesso a conta consultada, timeout, etc). erro estará no formato que a API do Instagram retorna
        return res.status(500).send(error);
      });

    // prepara array de postagens
    // o objeto terá a URL da postagem, o shortcode (usado para consultar os comentários do post), e a data da postagem no formato Date
    let listaShortCodesComTempo = [];

    // para cada post consultado, trata o objeto
    resp.user.edge_owner_to_timeline_media.edges.map(edge => {
      const objetoPostagem = {
        urlPostagem: 'https://www.instagram.com/p/' + edge.node.shortcode,
        shortcode: edge.node.shortcode,
        dataPostagem: new Date(edge.node.taken_at_timestamp * 1000),
      };

      // adiciona na listagem apenas os posts que estiverem dentro do range
      if (
        dataInicio <= objetoPostagem.dataPostagem &&
        objetoPostagem.dataPostagem <= dataFim
      ) {
        objetoPostagem.dataPostagem = objetoPostagem.dataPostagem.toLocaleString();
        listaShortCodesComTempo.push(objetoPostagem);
      }
    });

    let comentariosPorPost = [];

    for (let j = 0; j < listaShortCodesComTempo.length; j++) {
      // prepara objeto que terá os comentários por post
      // o objeto terá o texto do comentário, a data quando o comentário foi feito e o username de quem comentou
      const comentariosLista = [];

      let continuaBuscando = true;
      let pointer = '';

      // se 49 não trouxer todos os comentários, haverá paginação
      while (continuaBuscando) {
        const resp2 = await client
          .getMediaComments({
            shortcode: listaShortCodesComTempo[j].shortcode,
            first: '49', // esta é a quantidade máxima de comentários que pode ser consultada
            after: pointer, // paginação
          })
          .catch(error => {
            // retorna erro caso aconteça (post não existe, timeout, etc). erro estará no formato que a API do Instagram retorna
            continuaBuscando = false;
            return res.status(500).send(error);
          });

        // para cara comentário, trata e trata também as respostas
        resp2.edges.map(edge => {
          comentariosLista.push({
            textoComentario: edge.node.text,
            dataComentario: new Date(
              edge.node.created_at * 1000,
            ).toLocaleString(),
            usuarioComentario: edge.node.owner.username,
            // trata os comentários que são resposta deste comentário
            respostasComentario: edge.node.edge_threaded_comments.edges.map(
              edgeResposta => {
                return {
                  textoComentario: edgeResposta.node.text,
                  dataComentario: new Date(
                    edgeResposta.node.created_at * 1000,
                  ).toLocaleString(),
                  usuarioComentario: edgeResposta.node.owner.username,
                };
              },
            ),
          });
        });

        // se tiver paginação, pesquisa novamente
        if (resp2.page_info.has_next_page) {
          // esse ponteiro pode ser array, tem que tentar converter pra string se for
          pointer = resp2.page_info.end_cursor;
          try {
            pointer = JSON.parse(pointer);
            pointer = JSON.stringify(pointer);
          } catch (e) {}
        } else {
          // se não, para o loop while
          continuaBuscando = false;
        }
      }

      comentariosPorPost.push({
        postagem: listaShortCodesComTempo[j],
        detalhesComentarios: comentariosLista,
      });
    }

    // adiciona no array o objeto preparado, separado por username
    postsDeUsuarios.push({
      usernameDaConta: usuariosLista[i],
      comentariosPorPost: comentariosPorPost,
    });
  }

  return res.json(postsDeUsuarios);
});

server.use('/static', express.static('pagina'));

server.get('/', (req, res) => {
  res.sendFile(__dirname + '/pagina/index.html');
});

server.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
  console.log(`Acesse pelo link: http://localhost:${port}/`);
  console.log(`Caso deseja parar o processo pressione CTRL+C`);
});
