import { carStructure } from './page';
import { updateWinner } from './winner';
import {
    carAPI,
    allCarsToCount,
    updateCarOfAPI,
    takeCarsAPI,
    removeCarAPI,
    takeAllWinnersAPI,
    removeWinnerAPI,
    getCarsAPI,
    uploadWinnersAPI,
    makeWinnersAPI,
    motorStart,
    motorDrive,
    motorStop,
} from './api';
import { carBrands, carModels } from './brands';
let pageNumber = 1;
const prevCarsBtn = <HTMLButtonElement>document.querySelector('.btn-prev');
const nextCarsBtn = <HTMLButtonElement>document.querySelector('.btn-next');
const pageNum = <HTMLSpanElement>document.querySelector('.cont-page');
const generateCarbtn = <HTMLElement>document.querySelector('.generate-cars');
const generateCardsBtn = <HTMLElement>document.querySelector('.btn-generate_cars');
const carContainer = <HTMLElement>document.querySelector('.car-container');
const contGarage = <HTMLElement>document.querySelector('.cont-garage');
const textCreate = <HTMLInputElement>document.querySelector('.text-create');
const colorCreate = <HTMLInputElement>document.querySelector('.color-create');
const textUpdate = <HTMLInputElement>document.querySelector('.text-update');
const colorUpdate = <HTMLInputElement>document.querySelector('.color-update');
const updateBtn = <HTMLInputElement>document.querySelector('.button-update');


let idUpdateCar: number;

export type DescriptionCar = {
    [key: string | number]: number | string,
    id: number,
    name: string,
    color: string,
    wins: number,
    time: number
};

export const updateCars = () => {
  takeCarsAPI(pageNumber).then((arr: DescriptionCar[]) => {
    carContainer.innerHTML = '';


    arr.forEach((car) => {
      const oneCar = `${carStructure(car.id, car.name, car.color)}`;
      carContainer.innerHTML += oneCar;
    });
    contGarage.textContent = `(${allCarsToCount})`;
  });
};
updateCars();

prevCarsBtn.addEventListener('click', () => {
  if (pageNumber === 1) {
    prevCarsBtn.setAttribute('disabled', 'disabled');
  } else {
    nextCarsBtn.removeAttribute('disabled');
      pageNumber -= 1;
      pageNum.textContent = `${pageNumber}`;
  }
  updateCars();

});

nextCarsBtn.addEventListener('click', () => {
  if (pageNumber * 7 >= allCarsToCount) {
    nextCarsBtn.setAttribute('disabled', 'disabled');
  } else {
    prevCarsBtn.removeAttribute('disabled');
    pageNumber += 1;
    pageNum.textContent = `${pageNumber}`;
  }
  updateCars();

});

document.addEventListener('click', async (e) => {
  const btn = e.target as HTMLElement;

  if (btn.classList.contains('cars-options_select-btn')) {
    idUpdateCar = Number(btn.dataset.select);
    textUpdate.disabled = false;
    colorUpdate.disabled = false;
    updateBtn.disabled = false;

    getCarsAPI(idUpdateCar).then((item) => {
      textUpdate.value = item.name;
      colorUpdate.value = item.color;
    });
  }

  if (btn.classList.contains('cars-options_remove-btn')) {
    const btnId = Number(btn.dataset.remove);
    removeCarAPI(btnId).then(() => updateCars());

    takeAllWinnersAPI().then((arrAllWin) => {
      arrAllWin.forEach((item: DescriptionCar) => {
        if (Number(item.id) === btnId) removeWinnerAPI(btnId);
                });
            }).then(() => updateWinner());
    }
});

generateCarbtn.addEventListener('click', (e) => {
  const elem = e.target as HTMLElement;

  if (elem.classList.contains('button-create')) {
    const nameCar =  textCreate.value;
    const colorCar =  colorCreate.value;

    if (nameCar == '') {
      alert('Please, enter name car!');
    } else {
      (carAPI({ 'name': nameCar, 'color': colorCar })).then(() => updateCars());
    }

    if (allCarsToCount % 7 === 0) nextCarsBtn.removeAttribute('disabled');
    textCreate.value = '';
  }

  if (elem.classList.contains('button-update')) {
    const nameUpdateCar =  textUpdate.value;
    const colorUpdateCar =  colorUpdate.value;

    (updateCarOfAPI( { 'name': nameUpdateCar, 'color': colorUpdateCar }, idUpdateCar)).then(() => updateCars() );

    textUpdate.value = '';
    textUpdate.disabled = true;
    colorUpdate.disabled = true;
    updateBtn.disabled = true;
  }
});

  const putRandomName =  () => {
  const brandRandomNum = Math.floor(Math.random() * 50);
  const modelRandomNum = Math.floor(Math.random() * 50);

  return carBrands[brandRandomNum] + ' ' + carModels[modelRandomNum];
};
  const putRandomColor =  () => {
  const colorsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
  let colorRandom = '';
  for (let i = 1; i < 7; i++ ) {
    const randomNum = Math.floor(Math.random() * colorsArray.length);
   colorRandom += colorsArray[randomNum];
  }
  return `#${colorRandom}`;
};

generateCardsBtn.addEventListener('click', async () => {
  for (let i = 0; i < 100; i++){
    const color = putRandomColor();
    const name = putRandomName();

    carAPI({ 'name': `${name}`, 'color': `${color}` });
  }
  updateCars();
  nextCarsBtn.removeAttribute('disabled');
});

const winNotice = <HTMLElement>document.querySelector('.winner-notice');
const resetBtn = <HTMLButtonElement>document.querySelector('.btn-reset');
let raceResult: HTMLElement[] = [];
let time: number;
const aniInfo: { [id: number] : DescriptionCar; } = {};
const raceBtn = <HTMLButtonElement>document.querySelector('.btn-race');
const fieldControl = <HTMLElement>document.querySelector('.field-control');

function winnerIs(carWinner: HTMLElement, winTimener: number) {
  const winId = Number(carWinner.dataset.car);
  let winTime = (winTimener / 1000).toFixed(2);
  let wins = 1;
  let winName;
  getCarsAPI(winId).then((arr) => {
    winName = arr.name;
    winNotice.innerHTML = `${winName} went first (${winTime}s) !`;
  });
  takeAllWinnersAPI().then((arrAllWin: DescriptionCar[]) => {
    arrAllWin.forEach((item) => {
      if (Number(item.id) === winId) {
        wins = item.wins + 1;
        winTime = (Number(item.time) < Number(winTime) ? item.time : winTime).toString();
      }
    });
    }).then(() => {
      if (wins > 1) {
        uploadWinnersAPI({ 'wins': wins, 'time': winTime }, winId);
      } else {
        makeWinnersAPI({ 'id': winId, 'wins': wins, 'time': winTime });
      }
    }).then(() => updateWinner());
}

function carAnimation(car: HTMLElement, distance: number, duration: number) {
  let timeToStart = 0;
  const aniId = <DescriptionCar>{};

  function step(timestamp: number) {
    if (!timeToStart) {
      timeToStart = timestamp;
    }
    const advance = (timestamp - timeToStart) / duration;
    const translate: number = advance * distance;
    car.style.transform = `translateX(${translate}px)`;

    if (advance < 1) {
        aniId.id = window.requestAnimationFrame(step);
    }
    if (advance >= 1 && !resetBtn.hasAttribute('disabled')) {
      if (raceResult.length === 0) winnerIs(car, duration);
      raceResult.push(car);
    }
  }
  aniId.id = window.requestAnimationFrame(step);
  return aniId;
}

const toStart = async (idCar: number) => {
  motorStart(idCar).then((obj) => {
    const velocity = Number(obj.velocity);
    const distance = Number(obj.distance);
    time = distance / velocity;

    const cars = <HTMLElement>document.getElementById(`car-${idCar}`);
    const widthScreen = document.body.clientWidth;
    const carPosition = widthScreen / 100 * 15;
    const aniDistance = widthScreen - carPosition;

    aniInfo[idCar] = carAnimation(cars, aniDistance, time);

    motorDrive(idCar).then((drive) => {
      if (!drive.success) {
        window.cancelAnimationFrame(aniInfo[idCar].id);
      }
    });
  });
};
const toStop = async (idStop: number) => {
  motorStop(idStop).then(() => {
    window.cancelAnimationFrame(aniInfo[idStop].id);
    const cars = <HTMLElement>document.getElementById(`car-${idStop}`);
    cars.style.transform = 'translateX(0px)';
  });
};
 const raceStarts = async (page: number) => {
  takeCarsAPI(page, 7).then((arrCars: DescriptionCar[]) =>
  arrCars.forEach((elem) => toStart(elem.id)));
};

 const raceStops = async (page: number) => {
  takeCarsAPI(page, 7).then((arrCars: DescriptionCar[]) => {
   arrCars.forEach((elem) => toStop(elem.id));
  });
  raceResult = [];
  winNotice.innerHTML = '';
};

export function resetRace() {
  if (!resetBtn.hasAttribute('disabled')) {
    resetBtn.setAttribute('disabled', 'disabled');
    raceBtn.removeAttribute('disabled');
    raceResult = [];
    winNotice.innerHTML = '';
  }
}

document.addEventListener('click', async (e) => {
  const btn = e.target as HTMLElement;

  if (btn.classList.contains('car-control_start-btn')) {
    const idCar = Number(btn.dataset.start);
    toStart(idCar);
    const startBtn = <HTMLButtonElement>document.getElementById(`start-${idCar}`);
    const stopBtn = <HTMLButtonElement>document.getElementById(`stop-${idCar}`);
    startBtn.setAttribute('disabled', 'disabled');
    stopBtn.removeAttribute('disabled');
  }

  if (btn.classList.contains('car-control_stop-btn')) {
    const idCar = Number(btn.dataset.stop);
    toStop(idCar);
    const startBtn = <HTMLButtonElement>document.getElementById(`start-${idCar}`);
    const stopBtn = <HTMLButtonElement>document.getElementById(`stop-${idCar}`);
    stopBtn.setAttribute('disabled', 'disabled');
    startBtn.removeAttribute('disabled');
  }
});

fieldControl.addEventListener('click', async (e) => {
  const btn = e.target as HTMLElement;

  if (btn.classList.contains('btn-race')) {
    raceStarts(pageNumber);
    raceBtn.setAttribute('disabled', 'disabled');
    resetBtn.removeAttribute('disabled');
  }

  if (btn.classList.contains('btn-reset')) {
    raceStops(pageNumber);
    resetBtn.setAttribute('disabled', 'disabled');
    raceBtn.removeAttribute('disabled');
  }
});
