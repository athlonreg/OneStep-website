// OneStep 官网：滚动进场 + 下载地址指向最新 Release
(function () {
  'use strict';

  // 滚动进场
  var targets = document.querySelectorAll(
    '.card, figure.shot-frame, .checklist li, .stats-inner div, .note'
  );
  targets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Number(el.dataset.delay || 0);
        setTimeout(function () { el.classList.add('in'); }, delay);
        observer.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function (el, index) {
      el.dataset.delay = String((index % 6) * 45);
      observer.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  // 赞助弹窗：导航按钮打开，遮罩 / 关闭键 / Esc 关闭
  var sponsorBtn = document.getElementById('sponsor-btn');
  var sponsorModal = document.getElementById('sponsor-modal');
  if (sponsorBtn && sponsorModal) {
    var closeModal = function () { sponsorModal.hidden = true; };
    sponsorBtn.addEventListener('click', function () { sponsorModal.hidden = false; });
    sponsorModal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sponsorModal.hidden) closeModal();
    });
    // 直达链接：?sponsor=1 自动打开（便于分享赞助入口）
    if (new URLSearchParams(location.search).has('sponsor')) sponsorModal.hidden = false;
  }

  // 下载按钮始终指向 latest release 资产；文件名缺失时退回 releases 页面
  var button = document.getElementById('download-btn');
  var note = document.getElementById('download-note');
  if (!button) return;

  var asset = 'https://github.com/athlonreg/OneStep-website/releases/latest/download/OneStep-1.0.1.zip';
  var probe = new Image();
  probe.onload = function () { /* 资源存在，保持直链 */ };
  probe.onerror = function () {
    button.href = 'https://github.com/athlonreg/OneStep-website/releases';
    button.textContent = '前往下载页';
    if (note) {
      note.innerHTML = '请在发布页选择与你的 Mac 匹配的版本。<br>解压后把 OneStep.app 拖进「应用程序」即可。';
    }
  };
  // HEAD 比 onload 更省流量；这里用 no-cors 的 image 探测做兜底判定
  probe.src = asset;
})();