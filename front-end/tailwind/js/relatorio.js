import { createIcons, icons } from 'lucide';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

// Inicializar ícones Lucide
createIcons({ icons });

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menu de Perfil (Dropdown)
  const btnPerfil = document.getElementById('btn-perfil');
  const dropdownPerfil = document.getElementById('dropdown-perfil');

  if (btnPerfil && dropdownPerfil) {
    btnPerfil.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownPerfil.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      dropdownPerfil.classList.add('hidden');
    });
  }

  // 2. Exportar PDF
  const btnPdf = document.getElementById('btn-export-pdf');
  if (btnPdf) {
    btnPdf.addEventListener('click', () => {
      const conteudo = document.getElementById('relatorio-conteudo');
      const opcoes = {
        margin: 0.3,
        filename: 'relatorio-confeitaria.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
      };
      html2pdf().set(opcoes).from(conteudo).save();
    });
  }

  // 3. Exportar Excel
  const btnExcel = document.getElementById('btn-export-excel');
  if (btnExcel) {
    btnExcel.addEventListener('click', () => {
      const tabela = document.getElementById('tabela-produtos');
      const wb = XLSX.utils.table_to_book(tabela, { sheet: "Produtos" });
      XLSX.writeFile(wb, 'produtos-mais-utilizados.xlsx');
    });
  }
});