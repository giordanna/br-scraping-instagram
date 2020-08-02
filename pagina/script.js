const baseUrl = window.location.protocol + '//' + window.location.host;
const baseUrlDom = document.getElementById('base-url');
baseUrlDom.innerText = baseUrl;

const listaUsuarios = [];

atualizaListaUsuarios = () => {
  const listaDom = document.getElementById('lista-usuarios');

  listaTexto = '<ul>';
  listaUsuarios.map(usuario => {
    listaTexto += `<li>${usuario} <button type="button" onclick="removerUsuario('${usuario}')">X</button></li>`;
  });
  listaTexto += '</ul>';

  listaDom.innerHTML = listaTexto;
};

adicionarUsuario = () => {
  const usuariosInput = document.getElementById('usuarios');
  const usuarioValor = usuariosInput.value;

  const possivelLista = usuarioValor.replace(' ', '').split(',');

  possivelLista.map(usuario => {
    if (
      usuario !== undefined &&
      usuario !== '' &&
      listaUsuarios.indexOf(usuario) === -1
    ) {
      listaUsuarios.push(usuario);

      atualizaListaUsuarios();
    }
  });

  usuariosInput.value = '';
};

removerUsuario = usuario => {
  const index = listaUsuarios.indexOf(usuario);

  if (index !== -1) {
    listaUsuarios.splice(index, 1);
  }

  atualizaListaUsuarios();
};

adicionarUsuarioPorEnter = event => {
  if (event.keyCode === 13) {
    adicionarUsuario();
  }
};

enviar = event => {
  event.preventDefault();

  const objeto = {
    usuario: document.getElementById('usuario').value,
    senha: document.getElementById('senha').value,
    inicio: document.getElementById('inicio').value,
    fim: document.getElementById('fim').value,
    quantidade_posts:
      document.getElementById('quantidade_posts').value !== undefined &&
      document.getElementById('quantidade_posts').value !== ''
        ? document.getElementById('quantidade_posts').value
        : 56,
  };

  if (
    objeto.usuario === undefined ||
    objeto.senha === undefined ||
    listaUsuarios.length == 0 ||
    objeto.inicio === undefined ||
    objeto.fim === undefined
  ) {
    mostraErro('Preencha os campos obrigatórios');
    return;
  }

  window.open(
    `/scrap?usuario=${objeto.usuario.replace(' ', '')}&senha=${
      objeto.senha
    }&usuarios=${listaUsuarios.join(',')}&inicio=${objeto.inicio
      .split('-')
      .reverse()
      .join('/')}&fim=${objeto.fim
      .split('-')
      .reverse()
      .join('/')}&quantidade_posts=${objeto.quantidade_posts}`,
    '_blank',
  );
};

mostraErro = erro => {
  let erroDom = document.getElementById('erro');
  erroDom.innerText = erro;

  setTimeout(() => {
    erroDom.innerText = '';
  }, 10000);
};
