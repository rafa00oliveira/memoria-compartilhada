(() => {
  // clientWidth, não innerWidth: no celular, página larga demais aumenta o innerWidth e esconde a rolagem.
  const vw = document.documentElement.clientWidth;
  const visivel = (e) => e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const alvos = [...document.querySelectorAll(
    'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=tab], [role=link], [onclick]'
  )].filter(visivel);
  const pequenos = alvos.filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width < 44 || b.height < 44;
  });
  const campos = [...document.querySelectorAll(
    'input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]), select, textarea'
  )].filter(visivel);
  const fonteMiuda = campos.filter((e) => parseFloat(getComputedStyle(e).fontSize) < 16);
  const vp = document.querySelector('meta[name=viewport]')?.content ?? '';
  const max = vp.match(/maximum-scale\s*=\s*([\d.]+)/i);
  const resumo = {
    largura: vw,
    rolagemHorizontal: document.documentElement.scrollWidth > vw,
    zoomTravado: /user-scalable\s*=\s*(no|0)/i.test(vp) || (max !== null && parseFloat(max[1]) < 2),
    semViewport: vp === '',
    alvosAbaixoDe44: `${pequenos.length} de ${alvos.length}`,
    camposComFonteAbaixoDe16: fonteMiuda.length,
    inputTypeNumber: document.querySelectorAll('input[type=number]').length,
  };
  console.table(resumo);
  console.log('Alvos abaixo de 44 px (link dentro de texto corrido é exceção):', pequenos);
  console.log('Campos com fonte abaixo de 16 px:', fonteMiuda);
  return resumo;
})();
