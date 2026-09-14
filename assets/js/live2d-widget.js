(() => {
  const modelPath = 'https://cdn.jsdelivr.net/npm/live2d-widget-model-platelet@1.1.0/assets/platelet.model.json';

  const boot = async () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;
    if (document.getElementById('l2d-widget')) return;

    try {
      const createWidget = window.L2D_WIDGET?.createWidget;
      if (typeof createWidget !== 'function') return;

      window.xiaoyaoLive2D = createWidget({
        model: {
          path: modelPath,
          scale: 0.84,
          logLevel: 'error',
          tips: {
            welcomeMessage: ['欢迎来到木子逍遥的博客～', '今天也要保持好心情呀！'],
            messages: ['记得偶尔起来走动一下哦。', '有什么新发现吗？', '欢迎常回来看看～'],
            duration: 4000,
            interval: 12000
          }
        },
        position: 'bottom-right',
        size: { width: 220, height: 260 },
        primaryColor: 'rgba(49, 103, 201, 0.88)',
        transitionDuration: 800,
        transitionType: 'fade',
        menus: { align: 'right' }
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
