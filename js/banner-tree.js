/**
 * banner-tree.js — 封面横幅的栾树（动态版）
 * 把原来画在背景里的静态树，改成插入页面的真 SVG：
 * 树冠随风摆动，叶子周期性脱落、随风飘远（动画全部由 CSS 驱动，见 custom.css §11.1b）。
 */
(function () {
  function plant() {
    var header = document.getElementById('page-header');
    if (!header || !header.classList.contains('full_page')) return;
    if (header.querySelector('.banner-tree')) return;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'banner-tree');
    svg.setAttribute('viewBox', '0 0 220 230');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = [
      // 地面：一条微弧的土线 + 几丛小草
      '<path class="bt-ground" d="M28 219 Q110 214 192 219" />',
      '<g class="bt-grass">',
      '<path d="M52 217 q2 -6 4 0" /><path d="M60 216 q2 -5 4 0" /><path d="M168 216 q2 -6 4 0" /><path d="M176 217 q2 -5 4 0" />',
      '</g>',
      // 树干：主干 + 三级分枝，笔触由粗到细
      '<g class="bt-trunk">',
      '<path d="M108 216 C110 188 111 158 109 118" />',
      '<path d="M109 158 C100 148 92 142 82 132" />',
      '<path d="M109 146 C120 138 130 132 142 122" />',
      '<path d="M109 128 C104 120 101 116 96 108" />',
      '</g>',
      // 树冠：六团叠加，比原版更蓬松；随风摆动
      '<g class="bt-crown">',
      '<circle cx="64"  cy="112" r="30" class="bt-c2" />',
      '<circle cx="156" cy="108" r="32" class="bt-c2" />',
      '<circle cx="88"  cy="66"  r="34" class="bt-c1" />',
      '<circle cx="132" cy="62"  r="30" class="bt-c3" />',
      '<circle cx="108" cy="94"  r="40" class="bt-c1" />',
      '<circle cx="70"  cy="84"  r="24" class="bt-c3" />',
      // 栾树金色灯笼果：实心 + 空心穿插，带小果柄
      '<g class="bt-fruit">',
      '<circle cx="56"  cy="104" r="4.5" />',
      '<circle cx="150" cy="96"  r="4.5" />',
      '<circle cx="126" cy="44"  r="4.5" />',
      '<circle cx="88"  cy="56"  r="3.6" />',
      '<circle cx="140" cy="128" r="4"   />',
      '<circle cx="76"  cy="136" r="3.4" />',
      '<circle class="bt-fruit--ring" cx="98"  cy="34"  r="5"   />',
      '<circle class="bt-fruit--ring" cx="164" cy="76"  r="4.6" />',
      '<circle class="bt-fruit--ring" cx="46"  cy="84"  r="4"   />',
      '</g>',
      '</g>',
      // 枝头待落的叶子（随风轻颤）
      '<g class="bt-leaf bt-leaf--perch1"><path d="M84 134 q8 -6 14 -2 q-8 6 -14 2 Z" /></g>',
      '<g class="bt-leaf bt-leaf--perch2"><path d="M138 124 q9 -4 14 1 q-9 4 -14 -1 Z" /></g>',
      // 飘走的叶子：沿 offset-path 曲线远去（路径在 CSS 里）
      '<g class="bt-leaf bt-leaf--drift1"><path d="M0 0 q7 -5 12 -1 q-7 5 -12 1 Z" /></g>',
      '<g class="bt-leaf bt-leaf--drift2"><path d="M0 0 q6 6 11 3 q-6 -6 -11 -3 Z" /></g>',
      '<g class="bt-leaf bt-leaf--drift3"><path d="M0 0 q7 -4 12 0 q-7 4 -12 0 Z" /></g>'
    ].join('');
    header.appendChild(svg);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', plant);
  } else {
    plant();
  }
})();
