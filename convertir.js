const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("📱 Iniciando modo móvil...");
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const filePath = path.join(__dirname, 'index.html');
  
  // 1. Cargar la página
  await page.goto(`file:${filePath}`, { waitUntil: 'networkidle0' });

  // 2. CONFIGURACIÓN MÓVIL
  // Usamos 375px (iPhone) para forzar tu diseño en una sola columna
  const mobileWidth = 375; 
  
  await page.setViewport({ 
      width: mobileWidth, 
      height: 800, 
      isMobile: true, 
      hasTouch: true 
  });

  // 3. Medir la altura de la página en modo móvil (será mucho más larga)
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`📏 Altura móvil detectada: ${bodyHeight}px`);

  // 4. Generar el PDF vertical
  await page.pdf({
    path: 'Catalogo_Curativa_Movil.pdf',
    width: mobileWidth + 'px',   // Ancho de celular
    height: bodyHeight + 'px',   // Largo infinito
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    pageRanges: '1'
  });

  await browser.close();
  console.log("✅ ¡PDF Móvil generado! Revisa 'Catalogo_Curativa_Movil.pdf'");
})();