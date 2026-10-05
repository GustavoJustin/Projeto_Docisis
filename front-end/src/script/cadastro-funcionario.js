document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastro');
    const inputFoto = document.getElementById('input-foto');
    const photoPreview = document.getElementById('photo-preview');
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    const btnCancelar = document.getElementById('btn-cancelar');
    const radioNivel = document.querySelectorAll('input[name="nivel_acesso"]');
    const cardAdmin = document.getElementById('card-admin');
    const cardFunc = document.getElementById('card-func');

    // Máscara CPF
    const inputCPF = document.getElementById('input-cpf');
    if (inputCPF) {
        inputCPF.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d)/, '$1.$2');
            v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = v;
        });
    }

    // Máscara Telefone
    const inputTel = document.getElementById('input-telefone');
    if (inputTel) {
        inputTel.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
            v = v.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = v;
        });
    }

    // Upload de foto
    inputFoto.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                photoPreview.src = event.target.result;
                photoPreview.classList.remove('hidden');
                uploadPlaceholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // Cartões de nível de acesso
    radioNivel.forEach((radio) => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'administrador') {
                cardAdmin.className = 'relative flex items-start p-4 rounded-xl border-2 border-[#875C46] bg-[#FDFBF7] cursor-pointer transition-all';
                cardFunc.className = 'relative flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:border-[#875C46]/50 cursor-pointer transition-all';
            } else {
                cardFunc.className = 'relative flex items-start p-4 rounded-xl border-2 border-[#875C46] bg-[#FDFBF7] cursor-pointer transition-all';
                cardAdmin.className = 'relative flex items-start p-4 rounded-xl border border-gray-200 bg-white hover:border-[#875C46]/50 cursor-pointer transition-all';
            }
        });
    });

    // Validação e Gravação
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const senha = document.getElementById('input-senha').value;
        const confirmaSenha = document.getElementById('input-confirma-senha').value;

        if (senha !== confirmaSenha) {
            alert('As senhas digitadas não coincidem. Verifique e tente novamente.');
            return;
        }

        const nome = document.getElementById('input-nome').value;
        const nivelSelecionado = document.querySelector('input[name="nivel_acesso"]:checked').value;

        const novoFunc = {
            id: Date.now(),
            nome: nome,
            cpf: document.getElementById('input-cpf').value,
            email: document.getElementById('input-email').value,
            cargo: nivelSelecionado === 'administrador' ? 'Administrador' : 'Funcionário',
            status: 'Ativo',
            foto: photoPreview.src && !photoPreview.classList.contains('hidden') ? photoPreview.src : null
        };

        const equipe = JSON.parse(localStorage.getItem('equipe_docegestao') || '[]');
        equipe.push(novoFunc);
        localStorage.setItem('equipe_docegestao', JSON.stringify(equipe));

        alert(`Funcionário ${nome} cadastrado com sucesso!`);
        window.location.href = 'gestao-equipes.html';
    });

    // Limpar
    btnCancelar.addEventListener('click', () => {
        form.reset();
        photoPreview.src = '';
        photoPreview.classList.add('hidden');
        uploadPlaceholder.classList.remove('hidden');
    });
});
