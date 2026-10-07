/**
 * 鼠标跟随光斑 —— B 站风格动态背景
 * 移动端 / 偏好减少动效时自动禁用
 */
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent)) return;

  var div = document.createElement('div');
  div.id = 'mouse-follow';
  document.body.appendChild(div);

  var x = window.innerWidth / 2;
  var y = window.innerHeight / 2;
  var tx = x;
  var ty = y;

  window.addEventListener('mousemove', function (e) {
    tx = e.clientX;
    ty = e.clientY;
  }, { passive: true });

  function loop() {
    // 平滑跟随（lerp），营造 B 站那种轻盈的拖尾感
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    div.style.setProperty('--mx', x + 'px');
    div.style.setProperty('--my', y + 'px');
    requestAnimationFrame(loop);
  }

  loop();
})();
