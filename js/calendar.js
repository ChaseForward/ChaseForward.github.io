/**
 * 侧边栏文章日历（博客园风格）
 * 数据来自 /js/calendar-data.json（由 scripts/calendar-data.js 生成）
 */
(function () {
  var WEEK = ['一', '二', '三', '四', '五', '六', '日'];
  var DATA = null;
  var now = new Date();
  var curYear = now.getFullYear();
  var curMonth = now.getMonth(); // 0-11

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function key(y, m, d) { return y + '-' + pad(m) + '-' + pad(d); }

  function loadData(cb) {
    if (DATA) return cb(DATA);
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/js/calendar-data.json', true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        try { DATA = JSON.parse(xhr.responseText); } catch (e) { DATA = {}; }
        cb(DATA);
      }
    };
    xhr.send();
  }

  function render() {
    var titleEl = document.getElementById('cal-title');
    var gridEl = document.getElementById('cal-grid');
    var postsEl = document.getElementById('cal-posts');
    if (!gridEl || !titleEl) return;

    titleEl.textContent = curYear + '年' + (curMonth + 1) + '月';

    // 当月第一天是周几（周一 = 0）
    var first = new Date(curYear, curMonth, 1);
    var startOffset = (first.getDay() + 6) % 7;
    var daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();

    var html = '';
    for (var i = 0; i < startOffset; i++) html += '<span class="cal-day empty"></span>';

    for (var d = 1; d <= daysInMonth; d++) {
      var k = key(curYear, curMonth + 1, d);
      var hasPost = DATA[k] && DATA[k].length > 0;
      var cls = 'cal-day' + (hasPost ? ' has-post' : '');
      var isToday = (curYear === now.getFullYear() && curMonth === now.getMonth() && d === now.getDate());
      if (isToday) cls += ' today';
      html += '<span class="' + cls + '" data-date="' + k + '">' + d + '</span>';
    }

    gridEl.innerHTML = html;
    postsEl.innerHTML = '';
    postsEl.classList.add('is-empty');

    gridEl.querySelectorAll('.cal-day.has-post').forEach(function (el) {
      el.addEventListener('click', function () {
        showPosts(el.getAttribute('data-date'), el);
      });
    });
  }

  function showPosts(dateKey, activeEl) {
    var postsEl = document.getElementById('cal-posts');
    if (!postsEl) return;
    postsEl.classList.remove('is-empty');

    document.querySelectorAll('.cal-day.active').forEach(function (e) { e.classList.remove('active'); });
    if (activeEl) activeEl.classList.add('active');

    var list = DATA[dateKey] || [];
    if (!list.length) {
      postsEl.innerHTML = '<div class="cal-empty">当天没有文章</div>';
      return;
    }

    var parts = dateKey.split('-');
    var dateText = parts[0] + '年' + parseInt(parts[1], 10) + '月' + parseInt(parts[2], 10) + '日';
    var html = '<div class="cal-posts-date">' + dateText + ' · ' + list.length + ' 篇</div>';
    list.forEach(function (item) {
      html += '<a href="/' + item.url + '" title="' + item.title.replace(/"/g, '&quot;') + '">' +
        item.title + '</a>';
    });
    postsEl.innerHTML = html;
  }

  function bindNav() {
    var prev = document.getElementById('cal-prev');
    var next = document.getElementById('cal-next');
    if (prev) prev.addEventListener('click', function () {
      curMonth--; if (curMonth < 0) { curMonth = 11; curYear--; } render();
    });
    if (next) next.addEventListener('click', function () {
      curMonth++; if (curMonth > 11) { curMonth = 0; curYear++; } render();
    });
  }

  function init() {
    if (!document.getElementById('cal-grid')) return;
    loadData(function () { render(); bindNav(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
