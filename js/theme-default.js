/* 默认深色模式：仅当访客从未手动选择过主题时生效 */
(function () {
  try {
    var raw = localStorage.getItem('theme')
    var v = raw ? JSON.parse(raw) : null
    if (!v || !v.expiry || Date.now() > v.expiry) {
      localStorage.setItem('theme', JSON.stringify({
        value: 'dark',
        expiry: Date.now() + 3650 * 86400000
      }))
    }
    /* 提前设 data-theme，避免加载时闪白 */
    document.documentElement.setAttribute('data-theme', 'dark')
  } catch (e) {}
})()
