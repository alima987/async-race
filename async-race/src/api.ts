export const url = 'http://127.0.0.1:3000';
const garage = `${url}/garage`;
const motor = `${url}/engine`;

const winners = `${url}/winners`;
export let winnersCount = 0;

export const carAPI = async (body: object) => {
    await fetch(garage, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
      'Content-Type': 'application/json'
    },
  });
};

export let allCarsToCount = 0;

export const updateCarOfAPI = async (body: object, id: number) => {
  await fetch(`${garage}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  });
};

export const takeCarsAPI = async (page: number, limit = 7) => {
  const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`, { method: 'GET' });
  allCarsToCount = Number(response.headers.get('X-Total-count'));

  return response.json();
};

export const getCarsAPI = async (id: number) => (await fetch(`${garage}/${id}`, { method: 'GET' })).json();

export const removeCarAPI = async (id: number) => {
  await fetch(`${garage}/${id}`, {
    method: 'DELETE'
  });
};



export const takeAllWinnersAPI = async () => {
  const response = await fetch(`${winners}`, { method: 'GET' });
  return response.json();
};

export const takeWinnersAPI = async (page: number, limit = 10) => {
  const response = await fetch(`${winners}?_page=${page}&_limit=${limit}`, { method: 'GET' });
  winnersCount = Number(response.headers.get('X-Total-count'));
  return response.json();
};

export const removeWinnerAPI = async (id: number) => {
  await fetch(`${winners}/${id}`, {
    method: 'DELETE'
  });
};

export const uploadWinnersAPI = async (body: object, id: number) => {
  await fetch(`${winners}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    },
  });
};
export const makeWinnersAPI = async (body: object) => {
  await fetch(winners, {
  method: 'POST',
    body: JSON.stringify(body),
    headers: {
    'Content-Type': 'application/json'
    },
  });
};

export const motorStart = async (id: number) => (await fetch(`${motor}?id=${id}&status=started`, { method: 'PATCH' })).json();
export const motorDrive = async (id: number) => {
  const res = await fetch(`${motor}?id=${id}&status=drive`, { method: 'PATCH' }).catch();
  return res.status !== 200 ? { success: false } : { ...(await res.json()) };
};
export const motorStop = async (id: number) => (await fetch(`${motor}?id=${id}&status=stopped`, { method: 'PATCH' })).json();
