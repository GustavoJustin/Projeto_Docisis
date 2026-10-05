lucide.createIcons();

function selecionarTipo(tipo) {
    const btnEntrada = document.getElementById('btn-entrada');
    const btnSaida = document.getElementById('btn-saida');
    const inputTipo = document.getElementById('tipo_movimentacao');

    inputTipo.value = tipo;

    if (tipo === 'ENTRADA') {
        // Estilos para botão Entrada ativo
        btnEntrada.className = 'rounded-md bg-white py-1.5 text-xs font-semibold text-emerald-700 shadow-xs text-center border border-stone-200 transition';
        // Estilos para botão Saída inativo
        btnSaida.className = 'rounded-md py-1.5 text-xs font-medium text-stone-500 hover:text-stone-700 text-center transition';
    } else {
        // Estilos para botão Saída ativo
        btnSaida.className = 'rounded-md bg-white py-1.5 text-xs font-semibold text-rose-600 shadow-xs text-center border border-stone-200 transition';
        // Estilos para botão Entrada inativo
        btnEntrada.className = 'rounded-md py-1.5 text-xs font-medium text-stone-500 hover:text-stone-700 text-center transition';
    }
}
