/* 侧栏抽屉 v3.2：
   列表页：左栏外层面板(淡绿)+内层卡片(白色小色块)，默认展开，可收起（把手实时贴合色块边缘）
   文章页：主栏占左+中；右栏外层面板+白色目录卡，默认展开；左侧"我"面板默认藏、可拉出
   无记忆：每次刷新回到默认状态 */
(function () {
  var html = document.documentElement
  var isPost = !!document.getElementById('post')
  html.classList.add(isPost ? 'chase-post' : 'chase-list')

  var aside = document.getElementById('aside-content')
  if (!aside) return

  var DUR = 420

  function makeHandle(side) {
    var b = document.createElement('button')
    b.id = 'aside-drawer-handle'
    b.className = 'handle-' + side
    b.type = 'button'
    document.body.appendChild(b)
    return b
  }

  /* 把手实时贴合对应色块边缘（fixed 定位，读实时 rect） */
  function place(handle, side, el, off) {
    var r = el.getBoundingClientRect()
    if (off) {
      if (side === 'left') { handle.style.left = '0px'; handle.style.right = 'auto' }
      else { handle.style.right = '0px'; handle.style.left = 'auto' }
    } else {
      if (side === 'left') { handle.style.left = r.right + 'px'; handle.style.right = 'auto' }
      else { handle.style.right = (window.innerWidth - r.left) + 'px'; handle.style.left = 'auto' }
    }
  }

  function track(handle, side, el, getOff) {
    var t0 = performance.now()
    function frame(now) {
      place(handle, side, el, getOff())
      if (now - t0 < DUR + 80) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  function arrow(handle, off, side) {
    if (side === 'left') handle.textContent = off ? '\u3009' : '\u3008'
    else handle.textContent = off ? '\u3008' : '\u3009'
  }

  if (isPost) {
    /* ---- 文章页 ---- */
    var left = document.createElement('div')
    left.id = 'chase-aside-left'
    var cards = aside.querySelectorAll('.sticky_layout > .card-widget')
    var moved = false
    cards.forEach(function (c) {
      if (c.id !== 'card-toc') { left.appendChild(c); moved = true }
    })

    /* 右：目录（默认展开） */
    var toc = 'on'
    var hR = makeHandle('right')
    function applyToc() {
      html.classList.toggle('toc-off', toc === 'off')
      arrow(hR, toc === 'off', 'right')
      hR.title = toc === 'off' ? '展开目录' : '收起目录'
    }
    hR.addEventListener('click', function () {
      toc = toc === 'off' ? 'on' : 'off'
      applyToc()
      track(hR, 'right', aside, function () { return toc === 'off' })
    })
    applyToc()
    place(hR, 'right', aside, false)

    /* 左：我（默认藏） */
    if (moved) {
      document.body.appendChild(left)
      var leftOff = true
      var hL = makeHandle('left')
      function applyLeft() {
        html.classList.toggle('left-off', leftOff)
        arrow(hL, leftOff, 'left')
        hL.title = leftOff ? '展开侧栏' : '收起侧栏'
      }
      hL.addEventListener('click', function () {
        leftOff = !leftOff
        applyLeft()
        track(hL, 'left', left, function () { return leftOff })
      })
      applyLeft()
      place(hL, 'left', left, true)
    }
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
      off = off === 'off' ? 'on' : 'off'
      applyList()
      track(h, 'left', aside, function () { return off })
    })
    applyList()
    place(h, 'left', aside, false)
  }
})()
