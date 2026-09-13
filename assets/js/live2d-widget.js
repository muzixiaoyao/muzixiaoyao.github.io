(() => {
  const resourcePath = 'https://fastly.jsdelivr.net/npm/live2d-widgets@1.0.1/dist/';
  const tipsPath = `${window.location.origin}/live2d/waifu-tips.json`;

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

      if (localStorage.getItem('live2d-config-version') !== 'platelet-1') {
        localStorage.setItem('modelId', '0');
        localStorage.setItem('modelTexturesId', '0');
        localStorage.setItem('live2d-config-version', 'platelet-1');
      }

      window.initWidget({
        waifuPath: tipsPath,
        cubism2Path: `${resourcePath}live2d.min.js`,
        cubism5Path: 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
        modelId: 0,
        tools: ['hitokoto', 'photo', 'info', 'quit'],
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
