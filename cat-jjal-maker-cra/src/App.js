import './App.css'
import React from 'react'
import Title from './components/Title'
import Favorites from './components/Favorites'
import MainCard from './components/MainCard'
import Form from './components/Form'

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/cat/${responseJson._id}/says/${text}`; // NOTE: API 스펙 변경으로 강의 영상과 다른 URL로 변경했습니다.
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";

  // 비구조화 할당으로 선언
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter")
  })
  const [mainCat, setMainCat] = React.useState(CAT1)

  // useState의 인자를 함수로 넘겨주게되면 첫렌더링에 한번만 실행된다.
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || []
  })

  const alreadyFavorite = favorites.includes(mainCat)

  async function setInitialCat() {
    const newCat = await fetchCat('First cat')
    setMainCat(newCat)
  }

  React.useEffect(() => {
    setInitialCat()
  }, []) // 두번째 인자가 빈배열인 경우 컴포넌트가 렌더링 될때 실행된다
  // 배열에 값을 넣으면 그 값이 변경될 때 마다 useEffect가 실행된다.

  async function updateMainCat(value) {
    const newCat = await fetchCat(value)

    setMainCat(newCat) // 다음 고양이 사진으로 변경

    // set함수의 인자를 값으로 넘겨주게되면 그 값이 씹히는 현상이 있는데
    // 인자를 함수로 넘겨주게 되면 값이 씹히는 현상이 없어진다.
    setCounter((prev) => {
      const nextCounter = prev + 1
      jsonLocalStorage.setItem("counter", nextCounter)
      return nextCounter
    })
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat]
    setFavorites(nextFavorites)
    jsonLocalStorage.setItem("favorites", nextFavorites)
  }

  const counterTitle = counter === null ? '' : counter + '번째 '
  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  )
}

export default App;
