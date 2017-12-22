(function() {
  const moveGen = moveGenerator()

  let stateInit = {
    btns: new Array(),
    moves: new Array(),
    notif: '',
    strict: new Boolean(false),
    tmpMoves: new Array()
  }

  let state = Object.create(stateInit)

  // Sounds
  let sound0 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3')
  let sound1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3')
  let sound2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3')
  let sound3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')

  const controls = e => {
    if(e.target !== e.currentTarget && e.target.nodeName === 'A') {
      switch (e.target.id) {
        case 'start':
          // console.log(e.target.className)
          e.target.classList.add('disabled')
          move()
          break
        case 'restart':
          clearAll()
          break
        default:
          break
      }
    }

    if (e.target !== e.currentTarget && e.target.nodeName === 'INPUT') {
      if (state.strict === false) {
        state.strict = false
      } else {
        state.strict = true
      }
    }
    
    e.stopPropagation();
  }

  const choices = e => {
    let num = 0

    if(e.target !== e.currentTarget && e.target.nodeName === 'A') {
      switch (e.target.id) {
        case 'green':
          num = 0
          sound0.play()
          break
        case 'red':
          num = 1
          sound1.play()
          break
        case 'yellow':
          num = 2
          sound2.play()
          break
        case 'blue':
          num = 3
          sound3.play()
          break
        default:
          break
      }

      if (num !== state.tmpMoves[0]) {
        state.tmpMoves = new Array()
        state.notif.style.display = 'block'
        state.notif.textContent = 'You have failed to enter the correct pattern.'

        if (state.strict === false) {
          state.tmpMoves = state.moves.slice()
          
          setTimeout(() => {
            render()
          }, 1500)
        } else {
          document.querySelector('#choices').removeEventListener('click', choices, false)
          for (let i = 0; i < 4; i++) {
            state.btns[i].classList.add('disabled')
          }

          return
        }
      } else {
        state.notif.style.display = 'none'
        state.tmpMoves.shift()
      }

      if (state.tmpMoves.length <= 0) {
        document.querySelector('#choices').removeEventListener('click', choices, false)

        setTimeout(() => {
          move()
        }, 1500)
      }
    }
    
    e.stopPropagation();
  }

  const move = () => {
    if (state.moves.length === 20) {
      state.notif.style.display = 'block'
      state.notif.textContent = 'You have beaten the system and joined our ranks.'
    } else {
      document.getElementById('display').innerHTML = state.moves.length + 1
      state.moves.push(moveGen.next().value)
      state.tmpMoves = state.moves.slice()
      render()
    }
  }

  const render = () => { 
    if (state.tmpMoves.length > 0) {
      state.btns[state.tmpMoves[0]].classList.remove('darken-2')
      state.btns[state.tmpMoves[0]].classList.add('lighten-2')

      switch (state.tmpMoves[0]) {
        case 0:
          sound0.play()
          break
        case 1:
          sound1.play()
          break
        case 2:
          sound2.play()
          break
        case 3:
          sound3.play()
          break
        default:
          break
      }
  
      setTimeout(() => {
        state.btns[state.tmpMoves[0]].classList.remove('lighten-2')
        state.btns[state.tmpMoves[0]].classList.add('darken-2')
        state.tmpMoves.shift()

        setTimeout(() => {
          render()
        }, 500)
      }, 500)
    } else {
      listen()
    }
  }

  const listen = () => {
    state.tmpMoves = state.moves.slice()
    document.querySelector('#choices').addEventListener('click', choices, false)
  }

  function* moveGenerator() {
    let min = 0
    let max = 3

    while(true)
      yield Math.floor(Math.random() * (max - min + 1)) + min
  }

  const clearAll = () => {
    state = Object.create(stateInit)
    document.getElementById('display').innerHTML = '--'
    document.querySelector('#start').className = 'control waves-effect waves-light btn-large blue-grey lighten-3'
    document.querySelector('.switch input').checked = false
    state.moves = state.tmpMoves.splice()
    state.strict = false
    state.btns = document.querySelectorAll('.board-choices')
    state.notif = document.querySelector('#notification')
    state.notif.style.display = 'none'
    state.notif.innerHTML = ''

    for (let i = 0; i < 4; i++) {
      if (state.btns[i].classList.contains('disabled')) {
        state.btns[i].classList.remove('disabled')
      }

      // if (state.btns[i].classList.contains('lighten-2')) {
      //   state.btns[i].classList.remove('lighten-2')
      //   state.btns[i].classList.add('darken-2')  
      // } else {
      //   state.btns[i].classList.remove('darken-2')
      //   state.btns[i].classList.add('lighten-2')
      // }
    }
  }


  const initializer = () => {
    document.querySelector('#controls').addEventListener('click', controls, false)
    state.moves = state.tmpMoves.splice()
    state.btns = document.querySelectorAll('.board-choices')
    state.notif = document.querySelector('#notification')
  }

  window.addEventListener('load', initializer, false)
})()