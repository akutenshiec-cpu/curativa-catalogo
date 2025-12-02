const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("✂️ Iniciando conversión con corte exacto v2...");
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const filePath = path.join(__dirname, 'index.html');
  
  // 1. Cargar la página
  await page.goto(`file:${filePath}`, { waitUntil: 'networkidle0' });

  // 2. Configuración de Móvil (iPhone Width)
  const mobileWidth = 375; 
  await page.setViewport({ width: mobileWidth, height: 800, isMobile: true });

  // 3. INYECCIÓN DE CSS DE SEGURIDAD
  // Esto asegura que el body no tenga márgenes raros antes de medir
  await page.addStyleTag({content: `
      body, html { margin: 0 !important; padding: 0 !important; min-height: 0 !important; height: auto !important; }
      .site-footer { margin-bottom: 0 !important; }
  `});

  // 4. MEDICIÓN DEL BORDE INFERIOR DEL FOOTER
  const exactHeight = await page.evaluate(() => {
      const footer = document.querySelector('.site-footer');
      if (footer) {
          // Obtenemos la coordenada Y donde termina visualmente el footer
          return footer.getBoundingClientRect().bottom + window.scrollY;
      }
      return document.body.scrollHeight;
  });

  console.log(`📏 Altura final calculada: ${exactHeight}px`);

  // 5. Generar PDF con esa altura exacta
  await page.pdf({
    path: 'Catalogo_Curativa_Movil.pdf',
    width: mobileWidth + 'px',
    height: Math.floor(exactHeight) + 'px', // Redondeamos hacia abajo
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    pageRanges: '1'
  });

  await browser.close();
  console.log("✅ ¡Listo! PDF Generado perfectamente.");
})();