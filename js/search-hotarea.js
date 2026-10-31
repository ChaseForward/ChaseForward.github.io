'use strict'

/*
 * 修复导航栏搜索按钮的点击热区
 *
 * 【问题】
 *   主题把点击监听绑在 `#search-button > .search` 这个 span 上
 *   （themes/butterfly/source/js/search/local-search.js 的 searchClickFn）。
 *   实测几何：外层 div 从 x=897 起、宽 72，而内部 span 从 x=911 起、宽 58。
 *   也就是说按钮左侧那 14px 是死区 —— 视觉上属于按钮，点上去却毫无反应。
 *   同时 cursor 是 auto，鼠标悬停不变手型，用户根本判断不出哪里可点。
 *
 * 【做法】
 *   把整个 #search-button 变成有效点击区：点在 span 之外的空白处时，
 *   手动把点击转发给 span。若点在 span 内部则不重复派发
 *   （span 的原生监听已经处理了，转发会导致 openSearch 执行两次）。
 *   不修改主题任何文件。
 */

;(function () {
  var btn = document.getElementById('search-button')
  if (!btn) return

  btn.style.cursor = 'pointer'

  btn.addEventListener('click', function (e) {
    var span = btn.querySelector('.search')
    if (!span) return
    // 点中的是 span 自己或它的子元素（图标/文字），原生监听已覆盖
    if (span === e.target || span.contains(e.target)) return
    span.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
  })
})()
