document.addEventListener('DOMContentLoaded', function () {
  const statusInput = document.getElementById('bisMem-status');
  const statusText = document.querySelector('.toggle-switch__text');

  function updateStatusText() {
    statusText.textContent = statusInput.checked ? '활성화' : '비활성화';
  }

  statusInput.addEventListener('change', updateStatusText);
  updateStatusText();

  const allDayBtn = document.getElementById('operating-hours__all-day-button');
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

  const weekendDays = ['saturday', 'sunday'];
  weekendDays.forEach((day) => {
    const dayButton = document.getElementById(
      `operating-hours__status-button--${day}`
    );
    if (dayButton) {
      dayButton.disabled = false;
    }
  });

  // allDayBtn 상태에 따라 월~금 버튼 스타일 및 시간 입력 동기화/활성화 변경
  if (allDayBtn) {
    allDayBtn.addEventListener('click', () => {
      const isActive = allDayBtn.classList.contains('btn--primary');
      if (isActive) {
        // allDayBtn이 활성(월~금 동일) -> 비활성으로 변경: inputs 활성화, 버튼만 상태 변경
        allDayBtn.classList.remove('btn--primary');
        allDayBtn.classList.add('btn--secondary');

        days.forEach((day) => {
          const startInput = document.getElementById(
            `operating-hours__time-start--${day}`
          );
          const endInput = document.getElementById(
            `operating-hours__time-end--${day}`
          );

          if (startInput) startInput.disabled = false;
          if (endInput) endInput.disabled = false;

          // 월~금 버튼 상태는 그대로 둠 (버튼 클래스는 유지)
        });
      } else {
        // allDayBtn이 비활성 -> 활성으로 변경: 월요일 기준으로 화~금에 시간 복사하고 inputs 비활성화
        allDayBtn.classList.remove('btn--secondary');
        allDayBtn.classList.add('btn--primary');

        const monoStart = document.getElementById(
          'operating-hours__time-start--monday'
        );
        const monoEnd = document.getElementById(
          'operating-hours__time-end--monday'
        );
        const mStartVal = monoStart ? monoStart.value : '';
        const mEndVal = monoEnd ? monoEnd.value : '';

        days.forEach((day) => {
          const startInput = document.getElementById(
            `operating-hours__time-start--${day}`
          );
          const endInput = document.getElementById(
            `operating-hours__time-end--${day}`
          );

          if (startInput) {
            startInput.value = mStartVal;
            startInput.disabled = true;
          }
          if (endInput) {
            endInput.value = mEndVal;
            endInput.disabled = true;
          }

          const dayButton = document.getElementById(
            `operating-hours__status-button--${day}`
          );
          if (dayButton) {
            dayButton.classList.remove('btn--secondary');
            dayButton.classList.add('btn--primary');
          }
        });
      }
    });
  }

  const operStatusBtn = document.getElementsByClassName(
    'operating-hours__status-button'
  );

  Array.from(operStatusBtn).forEach((button) => {
    button.addEventListener('click', () => {
      if (allDayBtn) {
        allDayBtn.classList.remove('btn--primary');
        allDayBtn.classList.add('btn--secondary');
      }
      button.classList.toggle('btn--primary');
      button.classList.toggle('btn--secondary');

      // 버튼 클릭 시 해당 요일의 시간 입력은 활성화 상태로 유지되도록 보장
      const id = button.id; // 운영시간 버튼 id 포맷: operating-hours__status-button--{day}
      if (id) {
        const parts = id.split('--');
        const day = parts[1] || null;
        if (day) {
          const startInput = document.getElementById(
            `operating-hours__time-start--${day}`
          );
          const endInput = document.getElementById(
            `operating-hours__time-end--${day}`
          );
          if (startInput) startInput.disabled = false;
          if (endInput) endInput.disabled = false;
        }
      }
    });
  });
});
