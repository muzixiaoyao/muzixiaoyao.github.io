(() => {
  const resourcePath = 'https://fastly.jsdelivr.net/npm/live2d-widgets@1.0.1/dist/';
  const modelPath = 'https://fastly.jsdelivr.net/gh/fghrsh/live2d_api/';

  const loadResource = (url, type) => new Promise((resolve, reject) => {
    const element = document.createElement(type === 'css' ? 'link' : 'script');
    if (type === 'css') {
      element.rel = 'stylesheet';
    } else {
      element.type = 'module';
    }
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error(`Live2D resource failed: ${url}`));
    element[type === 'css' ? 'href' : 'src'] = url;
    document.head.appendChild(element);
  });

  const boot = async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;
    if (document.getElementById('waifu') || document.getElementById('waifu-toggle')) return;

    try {
      await Promise.all([
        loadResource(`${resourcePath}waifu.css`, 'css'),
        loadResource(`${resourcePath}waifu-tips.js`, 'js')
      ]);

      if (typeof window.initWidget !== 'function') return;

      if (!localStorage.getItem('modelId')) localStorage.setItem('modelId', '5');
      if (!localStorage.getItem('modelTexturesId')) localStorage.setItem('modelTexturesId', '18');

      window.initWidget({
        waifuPath: `${resourcePath}waifu-tips.json`,
        cdnPath: modelPath,
        cubism2Path: `${resourcePath}live2d.min.js`,
        cubism5Path: 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
        modelId: 5,
        modelTexturesId: 18,
        tools: ['hitokoto', 'switch-model', 'photo', 'info', 'quit'],
        logLevel: 'warn',
        drag: false,
        showToggleAfterQuit: true
      });
    } catch (error) {
      console.warn('[Live2D] Widget was not loaded.', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
