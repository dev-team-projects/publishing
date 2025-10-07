// 신고
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.data-table__row').forEach(function (row) {
    row.style.cursor = 'pointer';
    row.addEventListener('click', function (e) {
      // Prevent checkbox click from triggering row navigation
      if (e.target.type === 'checkbox') return;
      window.location.href = './bisMemReqDetail.html';
    });
  });
});
