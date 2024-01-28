import { winnersCount, getCarsAPI, takeWinnersAPI } from './api';
import { winnerStruture } from './page';
import { DescriptionCar } from './garage';

export let winnersPageNum = 1;
const winnerContainer = <HTMLElement>document.querySelector('.container-win');
const winnerCount = <HTMLElement>document.querySelector('.count-winners');
const winPrevBtn = <HTMLButtonElement>document.querySelector('.btn-prev-win');
const winNextBtn = <HTMLButtonElement>document.querySelector('.btn-next-win');
const winPageNum = <HTMLElement>document.querySelector('.count-page_winners');
let sortByWinsAscending = true; 
let sortByTimeAscending = true;
const thWins = document.querySelector('th[data-sort="wins"]');
const thTime = document.querySelector('th[data-sort="time"]');


const sortCars = (cars: DescriptionCar[]) => {
  if (sortByWinsAscending) {
    cars.sort((a, b) => a.wins - b.wins);
  } else {
    cars.sort((a, b) => b.wins - a.wins);
  }

  if (sortByTimeAscending) {
    cars.sort((a, b) => a.time - b.time);
  } else {
    cars.sort((a, b) => b.time - a.time);
  }
};
export const updateWinner = () => {
    let num = winnersPageNum * 10 - 10;

    takeWinnersAPI(winnersPageNum).then((arr: DescriptionCar[]) => {
        winnerContainer.innerHTML = '';
        sortCars(arr);
        arr.forEach((car) => {
            let name = '';
            let color = '';
            getCarsAPI(car.id).then((oneCar) => {
                name = oneCar.name;
                color = oneCar.color;
                num += 1;

                const oneWinner = `${winnerStruture(num, color, name, car.wins, car.time)}`;
                winnerContainer.innerHTML += oneWinner;
            });
        });
        winnerCount.textContent = `(${winnersCount})`;
    });
};
updateWinner();


if (thWins) {
  thWins.addEventListener('click', () => {
    sortByWinsAscending = !sortByWinsAscending;
    thWins.setAttribute('data-sort-direction', sortByWinsAscending ? 'asc' : 'desc');
    if (thTime) thTime.removeAttribute('data-sort-direction');
  });
}

if (thTime) {
  thTime.addEventListener('click', () => {
    sortByTimeAscending = !sortByTimeAscending;
    thTime.setAttribute('data-sort-direction', sortByTimeAscending ? 'asc' : 'desc');
    if (thWins) thWins.removeAttribute('data-sort-direction');
    updateWinner();
  });
}

 winPrevBtn.addEventListener('click', () => {
  if (winnersPageNum === 1) {
   winPrevBtn.setAttribute('disabled', 'disabled');
  } else {
    winNextBtn.removeAttribute('disabled');
    winnersPageNum -= 1;
    winPageNum.textContent = `${winnersPageNum}`;
  }
  updateWinner();
});

winNextBtn.addEventListener('click', () => {
  if (winnersPageNum * 10 >= winnersCount) {
    winNextBtn.setAttribute('disabled', 'disabled');
  } else {
   winPrevBtn.removeAttribute('disabled');
    winnersPageNum += 1;
    winPageNum.textContent = `${winnersPageNum}`;
  }
  updateWinner();
});
