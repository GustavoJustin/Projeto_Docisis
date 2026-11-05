(() => {
  const alertas = {
    vencido: {
      titulo: "Produto vencido",
      etiqueta: "VENCIDO",
      prioridade: 6,
      cor: "#ef4444",
      fundo: "#fee2e2",
      borda: "#fecaca",
      texto: "#b91c1c",
    },
    esgotado: {
      titulo: "Produto esgotado",
      etiqueta: "FORA DE ESTOQUE",
      prioridade: 5,
      cor: "#ef4444",
      fundo: "#fee2e2",
      borda: "#fecaca",
      texto: "#b91c1c",
    },
    critico: {
      titulo: "Estoque crítico",
      etiqueta: "ESTOQUE CRÍTICO",
      prioridade: 4,
      cor: "#eab308",
      fundo: "#fef9c3",
      borda: "#fde047",
      texto: "#854d0e",
    },
    "prox-vencimento": {
      titulo: "Produto próximo ao vencimento",
      etiqueta: "PRÓXIMO DO VENCIMENTO",
      prioridade: 3,
      cor: "#eab308",
      fundo: "#fef9c3",
      borda: "#fde047",
      texto: "#854d0e",
    },
    "prox-estoque": {
      titulo: "Estoque próximo do fim",
      etiqueta: "ESTOQUE BAIXO",
      prioridade: 3,
      cor: "#eab308",
      fundo: "#fef9c3",
      borda: "#fde047",
      texto: "#854d0e",
    },
    medio: {
      titulo: "Estoque em nível médio",
      etiqueta: "ESTOQUE MÉDIO",
      prioridade: 2,
      cor: "#eab308",
      fundo: "#fef9c3",
      borda: "#fde047",
      texto: "#854d0e",
    },
  };

  function diasAte(data, hoje = new Date()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) return null;
    const dataHoje = new Date(hoje);
    dataHoje.setHours(0, 0, 0, 0);
    const validade = new Date(`${data}T00:00:00`);
    if (Number.isNaN(validade.getTime())) return null;
    return Math.floor((validade - dataHoje) / 86400000);
  }

  function classificar(produto, hoje = new Date()) {
    const quantidade = Number(produto.quantidade);
    const maximo = Number(produto.maximo);
    const encontrados = [];
    let diasValidade = null;

    if (Number.isFinite(quantidade)) {
      if (quantidade <= 0) {
        encontrados.push("esgotado");
      } else if (Number.isFinite(maximo) && maximo > 0) {
        const percentual = quantidade / maximo;
        if (percentual <= 0.25) encontrados.push("critico");
        else if (percentual <= 0.5) encontrados.push("prox-estoque");
        else if (percentual <= 0.75) encontrados.push("medio");
      }
    }

    diasValidade = diasAte(produto.validade, hoje);
    if (diasValidade !== null && diasValidade < 0) {
      encontrados.push("vencido");
    } else if (diasValidade !== null && diasValidade <= 7) {
      encontrados.push("prox-vencimento");
    }

    const estados = [...new Set(encontrados)].sort(
      (a, b) => alertas[b].prioridade - alertas[a].prioridade,
    );
    return {
      status: estados[0] || null,
      estados,
      diasValidade,
    };
  }

  function obterAlerta(status) {
    return alertas[status] || null;
  }

  function obterMensagem(produto, status, diasValidade) {
    const nome = String(produto.nome || produto.marca || "Produto");
    const unidade = String(produto.unidade || "un");
    const quantidade = Number(produto.quantidade) || 0;
    const maximo = Number(produto.maximo) || 0;
    const dataValidade = String(produto.validade || "").slice(0, 10);
    const dataFormatada = dataValidade
      ? dataValidade.split("-").reverse().join("/")
      : "";

    switch (status) {
      case "vencido":
        return `${nome} venceu em ${dataFormatada}.`;
      case "esgotado":
        return `${nome} está sem estoque.`;
      case "critico":
        return `${nome} está com ${quantidade} de ${maximo} ${unidade} em estoque.`;
      case "prox-estoque":
        return `${nome} está com ${quantidade} de ${maximo} ${unidade}; estoque próximo do fim.`;
      case "medio":
        return `${nome} está com ${quantidade} de ${maximo} ${unidade} em estoque.`;
      case "prox-vencimento":
        return `${nome} vence em ${dataFormatada} (${
          diasValidade === 0
            ? "hoje"
            : `em ${diasValidade} ${diasValidade === 1 ? "dia" : "dias"}`
        }).`;
      default:
        return "";
    }
  }

  const api = { classificar, obterAlerta, obterMensagem };
  if (typeof window !== "undefined") window.estoqueClassificacao = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
