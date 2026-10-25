/* 侧栏抽屉 v4.0：
   列表页：左栏淡绿面板+白色小卡，默认展开；收起后面板滑出、主栏舒展占满
   文章页：三栏（左=与首页相同的侧栏，默认收起；中=文章；右=目录，默认展开），全部挤压式
   把手持续贴合面板可视边缘（连续 rAF，窗口缩放/动画全程都跟随）
   无记忆：每次刷新回到默认状态 */
(function () {
  var html = document.documentElement
  var isPost = !!document.getElementById('post')
  html.classList.add(isPost ? 'chase-post' : 'chase-list')

  var aside = document.getElementById('aside-content')
  if (!aside) return

  function makeHandle(side) {
    var b = document.createElement('button')
    b.id = 'aside-drawer-handle'
    b.className = 'handle-' + side
    b.type = 'button'
    document.body.appendChild(b)
    return b
  }

  /* 把手贴在面板可视边缘：left = 面板右缘（最小 0 贴屏幕左缘）；
     right = 面板左缘到屏幕右缘的距离（最小 0 贴屏幕右缘） */
  function place(handle, side, el) {
    var r = el.getBoundingClientRect()
    if (side === 'left') {
      handle.style.left = Math.max(r.right, 0) + 'px'
      handle.style.right = 'auto'
    } else {
      handle.style.right = Math.max(window.innerWidth - r.left, 0) + 'px'
      handle.style.left = 'auto'
    }
  }

  /* 持续跟随：一次绑定，永久生效（动画、滚动、窗口缩放都不掉队） */
  function follow(handle, side, el) {
    function frame() {
      place(handle, side, el)
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  function arrow(handle, off, side) {
    if (side === 'left') handle.textContent = off ? '\u3009' : '\u3008'
    else handle.textContent = off ? '\u3008' : '\u3009'
  }

  if (isPost) {
    /* ---- 文章页 ---- */
    /* 左栏：把目录以外的所有卡片移进独立左栏面板（内容与首页一致），插入主栏与右栏之间 */
    var layout = aside.parentNode
    var left = document.createElement('div')
    left.id = 'chase-aside-left'
    var inner = document.createElement('div')
    inner.className = 'sticky_layout'
    left.appendChild(inner)

    var moved = false
    aside.querySelectorAll('.card-widget').forEach(function (c) {
      if (c.id !== 'card-toc') { inner.appendChild(c); moved = true }
    })

    var leftOff = true
    if (moved) {
      layout.insertBefore(left, aside) /* main 仍是 :first-child，宽度规则不受影响 */
      var hL = makeHandle('left')
      function applyLeft() {
        html.classList.toggle('left-off', leftOff)
        arrow(hL, leftOff, 'left')
        hL.title = leftOff ? '展开侧栏' : '收起侧栏'
      }
      hL.addEventListener('click', function () {
        leftOff = !leftOff
        applyLeft()
      })
      applyLeft()
    } else {
      left.style.display = 'none'
    }

    /* 右栏：只留目录（默认展开） */
    var tocOff = false
    var hR = makeHandle('right')
    function applyToc() {
      html.classList.toggle('toc-off', tocOff)
      arrow(hR, tocOff, 'right')
      hR.title = tocOff ? '展开目录' : '收起目录'
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
    function applyList() {
      html.classList.toggle('aside-off', off)
      arrow(h, off, 'left')
      h.title = off ? '展开侧栏' : '收起侧栏'
    }
    h.addEventListener('click', function () {
      off = !off
      applyList()
    })
    applyList()
  }
})()
