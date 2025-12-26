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
  } catch (error) {
    console.error('初始化过程中发生错误:', error);
  }
});
