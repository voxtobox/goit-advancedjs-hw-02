import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


let userSelectedDate = null;
let timerId = null;

const selector = document.querySelector("#datetime-picker");
const startButton = document.querySelector("button");
const daysValue = document.querySelector(".value[data-days]");
const hoursValue = document.querySelector(".value[data-hours]");
const minutesValue = document.querySelector(".value[data-minutes]");
const secondsValue = document.querySelector(".value[data-seconds]");

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    console.log(selectedDates[0]);
    if (userSelectedDate < new Date()) {
      startButton.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future!',
      });
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr("#datetime-picker", options);

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(val) {
  return String(val).padStart(2, '0');
}

const timer = () => {
  const currentDate = new Date();
  const deltaTime = userSelectedDate - currentDate;

  if (deltaTime <= 0) {
    selector.disabled = false;
    clearInterval(timerId);
    iziToast.success({
      title: 'Finished',
      message: 'Time counting is done!',
    });
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(deltaTime);

  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
};

const onStartBtnClick = () => {
  selector.disabled = true;
  startButton.disabled = true;
  timerId = setInterval(timer, 1000);
};

startButton.addEventListener('click', onStartBtnClick);
