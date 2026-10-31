/**
 * 鼠标跟随光斑 —— B 站风格动态背景
 * 移动端 / 偏好减少动效时自动禁用
 * v4.1 打磨：改用 transform 位移（走合成层，不再每帧重绘整张径向渐变），
 *            静止后自动停帧，不再空转 rAF
 */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)) return;

  var div = document.createElement('div');
  div.id = 'mouse-follow';
  document.body.appendChild(div);

  var R = 380; /* 光斑半径，需与 custom.css 里 #mouse-follow 的尺寸一致 */
  var x = window.innerWidth / 2;
  var y = window.innerHeight / 2;
  var tx = x;
  var ty = y;
  var running = false;
  var MIN = 0.4;

  function render() {
    div.style.transform = 'translate3d(' + (x - R) + 'px,' + (y - R) + 'px,0)';
  }

  function loop() {
    var dx = tx - x;
    var dy = ty - y;
    // 平滑跟随（lerp），营造那种轻盈的拖尾感
    x += dx * 0.12;
    y += dy * 0.12;
    render();
    if (Math.abs(dx) < MIN && Math.abs(dy) < MIN) {
      x = tx;
      y = ty;
      render();
      running = false; /* 静止即停 */
      return;
    }
    requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(loop);
  }

  render();
  window.addEventListener('mousemove', function (e) {
    tx = e.clientX;
    ty = e.clientY;
    start();
  }, { passive: true });
})();
