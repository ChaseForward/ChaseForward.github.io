/* 侧栏抽屉 v4.2：
   列表页：左栏淡绿面板+白色小卡，默认展开；收起后面板滑出、主栏舒展占满
   文章页：双栏（正文 + 右侧目录），左栏已于 v4.2 移除
   把手贴合「阅读栏外缘」，跟着面板边界走，不再飘在窗口边角
   v4.1 打磨：去掉重复 id、补 aria、定位只在需要时跑（不再 60fps 常驻）
   v4.2 变更：文章页去掉左栏（作者/最近文章/分类/标签/网站信息卡不再展示），
              因此也不再创建左手柄；列表页行为不变
   无记忆：每次刷新回到默认状态 */
(function () {
  var html = document.documentElement
  var isPost = !!document.getElementById('post')
  html.classList.add(isPost ? 'chase-post' : 'chase-list')

  var aside = document.getElementById('aside-content')
  if (!aside) return

  var GAP = 26 /* 把手宽度，与 CSS 保持一致 */

  /* 计算某个元素的可见盒子（收起中 width 会变，所以要实时读） */
  function box(el) {
    return el ? el.getBoundingClientRect() : null
  }

  /* 把手贴到元素的左外侧（left: true）或右外侧；窄屏时夹在可视区内，不许半截出界 */
  function placeAt(handle, el, side) {
    var r = box(el)
    if (!r || !r.width) return
    var left = side === 'left' ? r.left - GAP : r.right
    left = Math.max(4, Math.min(left, window.innerWidth - GAP - 4))
    handle.style.left = Math.round(left) + 'px'
    handle.style.right = 'auto'
  }

  /* 只在展开/收起动画 + 窗口缩放期间持续跟随，其余时间不占帧 */
  function track(handle, el, side, ms) {
    var end = Date.now() + (ms || 520)
    function frame() {
      placeAt(handle, el, side)
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  function makeHandle(side) {
    var b = document.createElement('button')
    b.className = 'aside-drawer-handle handle-' + side
    b.type = 'button'
    document.body.appendChild(b)
    return b
  }

  /* 把手做成「竖向书签」：方向箭头 + 竖排文字
     原来只是一个孤零零的尖括号，看不出是干嘛的，也不知道点下去会往哪边走。
     现在文字直接写「目录 / 侧栏」，箭头指向点击后面板移动的方向。 */
  function label(handle, off, side, word) {
    var glyph
    if (side === 'left') glyph = off ? '\u203A' : '\u2039'
    else glyph = off ? '\u2039' : '\u203A'
    handle.innerHTML =
      '<span class="hd-chev" aria-hidden="true">' + glyph + '</span>' +
      '<span class="hd-word">' + word + '</span>'
  }

  if (isPost) {
    /* ---- 文章页：只留右侧目录 ---- */
    /* 左栏已整体移除（2026-10-29）。目录以外的卡片（作者、最近文章、分类、
       标签、网站信息）在文章页不再展示，交给 CSS 的
       `.chase-post #aside-content .card-widget:not(#card-toc)` 统一隐藏。
       这里不搬动 DOM，脚本失效时卡片仍能照常显示，属于安全的降级方向。 */

    var tocOff = false
    var hR = makeHandle('right')
    hR.setAttribute('aria-label', '收起目录')
    hR.setAttribute('aria-controls', 'aside-content')
    function applyToc() {
      html.classList.toggle('toc-off', tocOff)
      label(hR, tocOff, 'right', '目录')
      hR.title = tocOff ? '展开目录' : '收起目录'
      hR.setAttribute('aria-label', hR.title)
      hR.setAttribute('aria-expanded', String(!tocOff))
      track(hR, aside, 'right', 520)
    }
    hR.addEventListener('click', function () {
      tocOff = !tocOff
      applyToc()
    })
    applyToc()
  } else {
    /* ---- 列表页 ---- */
    var off = false
    var h = makeHandle('left')
    h.setAttribute('aria-label', '收起侧栏')
    h.setAttribute('aria-controls', 'aside-content')
    function applyList() {
      html.classList.toggle('aside-off', off)
      label(h, off, 'left', '侧栏')
      h.title = off ? '展开侧栏' : '收起侧栏'
      h.setAttribute('aria-label', h.title)
      h.setAttribute('aria-expanded', String(!off))
      track(h, aside, 'left', 520)
    }
    h.addEventListener('click', function () {
      off = !off
      applyList()
    })
    applyList()
  }

  /* 首页有封面时，把手在封面还没滚过去之前不出现：
     它固定在视口垂直居中，正好压在封面右下角的签名上，像一块白补丁。
     留着功能，等封面让位了再浮上来。 */
  if (!isPost) {
    var banner = document.getElementById('page-header')
    if (banner) {
      var syncBanner = function () {
        var h = banner.offsetHeight || 0
        html.classList.toggle('banner-cover', window.scrollY < h - 160)
      }
      window.addEventListener('scroll', syncBanner, { passive: true })
      window.addEventListener('resize', syncBanner)
      syncBanner()
    }
  }

  /* 窗口尺寸变化后重新贴一次（面板宽度是按百分比算的） */
  window.addEventListener('resize', function () {
    document.querySelectorAll('.aside-drawer-handle').forEach(function (b) {
      placeAt(b, aside, b.classList.contains('handle-left') ? 'left' : 'right')
    })
  })
})()
