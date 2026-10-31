/* 文章 meta 的收尾打磨（v4.1）
   1) 「更新于」和「发表于」是同一天时，隐藏前者 —— 信息没变少，噪声少一件
   2) 浏览量（busuanzi）2.5 秒内没返回（被拦截 / 离线 / 静态预览），收起这一项，
      不让一个空转的加载图标长期挂在标题下面 */
(function () {
  var meta = document.getElementById('post-meta')

  if (meta) {
    var created = meta.querySelector('.post-meta-date-created')
    var updated = meta.querySelector('.post-meta-date-updated')
    if (created && updated) {
      var c = created.textContent.trim()
      var u = updated.textContent.trim()
      if (c && c === u) {
        var label = updated.previousElementSibling
        var icon = label && label.previousElementSibling
        ;[icon, label, updated].forEach(function (el) {
          if (el && el.nodeType === 1) el.style.display = 'none'
        })
      }
    }
  }

  setTimeout(function () {
    var pv = document.getElementById('busuanzi_value_page_pv')
    if (!pv) return
    if (pv.textContent.trim() === '') {
      var block = pv.closest('.post-meta-pv-cv')
      if (block) block.style.display = 'none'
    }
  }, 2500)
})()
