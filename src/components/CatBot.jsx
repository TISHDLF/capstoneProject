import React from 'react'

const CatBot = () => {
    const catClicked = () => {
        console.log('Test click for Cat Bot!')
    }

  return (
    <button  onClick={catClicked} 
    className='fixed bottom-5 right-5 flex items-center justify-center bg-[#cfda34] box-border max-w-[75px]
    h-auto rounded-[100%] p-[12px] active:scale-90 z-50'>
        <img src="src/assets/icons/CatBot.png" alt="Cat Bot" />
    </button>
  )
}

export default CatBot