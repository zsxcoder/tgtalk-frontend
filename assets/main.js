/* global tgTalker */

// 更新主题图标
function updateThemeIcon(theme, iconElement) {
  if (iconElement) {
    iconElement.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

// 获取系统主题偏好
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// 确保 DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  try {
    // 主题切换功能
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    // 检查必要的 DOM 元素是否存在
    if (!themeToggle || !themeIcon) {
      console.error('主题切换所需的元素未找到');
      return;
    }

    // 从本地存储读取主题偏好，如果没有则使用系统主题
    const savedTheme = localStorage.getItem('theme') || getSystemTheme();
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme, themeIcon);

    // 监听系统主题变化（当用户未设置自定义主题时）
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateThemeIcon(e.matches ? 'dark' : 'light', themeIcon);
    };

    if (!localStorage.getItem('theme')) {
      systemThemeQuery.addEventListener('change', handleSystemThemeChange);
    }

    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';

      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme, themeIcon);

      // 用户手动切换主题后，移除系统主题监听器
      systemThemeQuery.removeEventListener('change', handleSystemThemeChange);
    });

    // 初始化 tgTalker
    // 等待 tgTalker 加载完成，最多尝试 20 次，每次间隔 100ms
    const initTalker = (retryCount = 0) => {
      if (typeof tgTalker !== 'undefined') {
        try {
          const talker = new tgTalker({
            serverUrl: "https://tg-api.mcyzsx.top",
            selector: "#talk-container",
            zoom: true,
            defaultAvatar: "https://imgbed.mcyzsx.top/file/avatar/1765626136745_zsxcoder.jpg",
            defaultName: "钟神秀",
            custom: {
              proxy: {
                proxyUrl: "https://tg-api.mcyzsx.top",
                image: true,
              },
              emaction: {
                enable: true,
                endpoint: "https://api-emaction.mcyzsx.top",
                theme: "system",
                availableArrayString: "",
                threeDimensional: false,
              },
            },
          });
          talker.init();
          console.log('tgTalker 初始化成功');
        } catch (error) {
          console.error('tgTalker 初始化失败:', error);
        }
      } else if (retryCount < 20) {
        console.log(`等待 tgTalker 加载... (${retryCount + 1}/20)`);
        setTimeout(() => initTalker(retryCount + 1), 100);
      } else {
        console.error('tgTalker 未正确加载，请检查脚本引用顺序');
      }
    };

    initTalker();
  } catch (error) {
    console.error('初始化过程中发生错误:', error);
  }
});
