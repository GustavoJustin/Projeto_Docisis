document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal-esqueci');
    const btnAbrir = document.getElementById('btn-abrir-esqueci');
    const btnFechar = document.getElementById('btn-fechar-esqueci');
    const btnCancelar = document.getElementById('btn-cancelar-esqueci');
    const formRecuperacao = document.getElementById('form-recuperacao');
    const msgErro = document.getElementById('mensagem-erro');
    const msgSucesso = document.getElementById('mensagem-sucesso');
    const btnEnviar = document.getElementById('btn-enviar-esqueci');

    function abrirModal() {
        modal.style.display = 'flex';
        msgErro.style.display = 'none';
        msgSucesso.style.display = 'none';
        formRecuperacao.reset();
        btnEnviar.disabled = false;
        btnEnviar.style.opacity = '1';
    }

    function fecharModal() {
        modal.style.display = 'none';
    }

    btnAbrir.addEventListener('click', abrirModal);
    btnFechar.addEventListener('click', fecharModal);
    btnCancelar.addEventListener('click', fecharModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    formRecuperacao.addEventListener('submit', (e) => {
        e.preventDefault();

        const novaSenha = document.getElementById('nova-senha').value;
        const confirmarSenha = document.getElementById('confirmar-senha').value;

        msgErro.style.display = 'none';
        msgSucesso.style.display = 'none';

        if (novaSenha !== confirmarSenha) {
            msgErro.innerText = 'As senhas não coincidem. Digite novamente.';
            msgErro.style.display = 'block';
            return;
        }

        if (novaSenha.length < 6) {
            msgErro.innerText = 'A senha precisa ter pelo menos 6 caracteres.';
            msgErro.style.display = 'block';
            return;
        }

        btnEnviar.disabled = true;
        btnEnviar.style.opacity = '0.6';

        setTimeout(() => {
            msgSucesso.innerText = '✓ Senha alterada com sucesso!';
            msgSucesso.style.display = 'block';

            setTimeout(() => {
                fecharModal();
            }, 1800);
        }, 400);
    });
});
