let score = 0;
const scoreBoard = document.getElementById('score')
function init() { // luodaan ensimmäinen palikka ja käynnistetään peli / luodaan event handler näppäimistölle
        score = 0
        game.table = createTableObj()
        let rand = Math.floor(Math.random() * 5)
        game.blocks[rand].active = true
        for (let i = 0; i < game.blocks[rand].position(game.startPosV, game.startPosH, game.aligment).length; i++) {
                let y = game.blocks[rand].position(game.startPosV, game.startPosH, game.aligment)
                game.table.forEach(table => { if (table.id == y[i]){table.occupied = 1}})
        }
        let x = []
        game.table.forEach(table => { if (table.occupied == 1){x.push(document.getElementById(table.id))}})
        for (i = 0; i < x.length; i++) {
                x[i].setAttribute("class", "occupied")
        }
        document.onkeydown = handleKey
}
function draw() {  //tyhjentää pöydän palikasta ja piirtää saman uuteen positioon
        deleteRow()
        cleanTable()
        let x = checkPosition()
        x.forEach(x => {
                game.table.forEach(table => {
                        if (x == table.id) {
                                table.occupied = 1 
                        }
                })
        })
        let y = []
        game.table.forEach(table => {
                if (table.occupied == 1) {
                        y.push(document.getElementById(table.id))
                }
        })
        y.forEach(y => {
                y.setAttribute("class", "occupied")
        })
}
function handleKey(e) { //controllleri
        if (e.keyCode === 13) {
                gamePlay = setTimeout(gameDown, 600);
        } else if (e.keyCode === 37) {
                moveLeft()
        } else if (e.keyCode === 39) {
                moveRight()
        } else if (e.keyCode === 32) {
                turn()
        } else if (e.keyCode === 40) {
                moveExBlock()
                endLine()
                deleteRow()
                let origPos = checkPosition()
                let orig = game.startPosV 
                if(game.startPosV <= 15) {
                 game.startPosV++
                 checkOccupiedTwo(origPos)
                  if (checkIfOnMap()) {
                  draw() 
                } else {
                  game.startPosV = orig
                }
               }
        } 
} 
let moveLeft = () => {
        let orig = game.startPosH       
        game.startPosH--
        if(checkIfOnMap()){
        draw()
        } else {
          game.startPosH = orig   
        }
}
let moveRight = () => {
        let orig = game.startPosH       
        game.startPosH++
        if(checkIfOnMap()){
        draw()
        } else {
        game.startPosH = orig     
        }
}
let turn = () => {
          let origAli = game.aligment
               game.aligment++
               if (game.aligment > 3) {
                       game.aligment = 0
               }
               if (checkIfOnMap()) {
                  draw()
               } 
               if (checkIfOnMap() == false) {
                game.aligment = origAli   
               }
}      
let newBlock = () => { //luo uuden blokin
        game.aligment = 0
        game.startPosH = 3
        game.startPosV = 2
        cleanActive()
        score++
        let rand = Math.floor(Math.random() * 5)
        game.blocks[rand].active = true
        for (let i = 0; i < game.blocks[rand].position(game.startPosV, game.startPosH, game.aligment).length; i++) {
                let y = game.blocks[rand].position(game.startPosV, game.startPosH, game.aligment)
                game.table.forEach(table => { if (table.id == y[i]){table.occupied = 1}})
                if (checkIfOnMap() == false) {
                        clearTimeout(gamePlay)
                       if(confirm(`Sinun tuloksesi: ${score} uudestaan?`)) {
                               init()
                       }
        }
        
             }
        let x = []
        game.table.forEach(table => { if (table.occupied == 1){{x.push(document.getElementById(table.id))}}})
        for (i = 0; i < x.length; i++) {
                x[i].setAttribute("class", "occupied")
        }

}
let cleanTable = () => { //Tää siivoaa vanhan blokin pois ennen kuin piirtää saman uudestaan. (eli palkki ei "maalaa" kenttää vain mustaksi)
        game.table.forEach(table => {if (table.occupied == 1){table.occupied = 0}})
        let x = []
        game.table.forEach(table => { if (table.occupied == 0){x.push(document.getElementById(table.id))}})
                x.forEach(x => {
                        x.setAttribute("class", "free")
                })
}
let cleanActive = () => { //tää poistaa aktiivi blokin ennen kuin luodaan randomilla taas uus
     let x = checkActive()
     if (x !== -1){
     game.blocks[x].active = false
     } else {
     return false
     }
}
let checkActive = () => { //tarkastaa mikä blokki on pelissä
        return game.blocks.map((e) => {return e.active}).indexOf(true)
}
let checkPosition = () => { //blokin sijainti
        return game.blocks[checkActive()].position(game.startPosV, game.startPosH, game.aligment)
}
let checkIfOnMap = () => { //katsoo onko blokki kentällä (Tämä on blokin siirtymisen ja piirtämisen välissä: blokki siirtyy --> tämä tarkastaa onko uus sijainti kentällä --> jos true niin homma jatkuu piirtämiseen)
        let x = checkPosition()
        let y = getOccupied()
        for (i = 0; i < x.length; i++) {          
        if (game.table.map((table) => {return table.id}).indexOf(x[i]) == -1 || y.map((y) => {return y}).indexOf(x[i]) != -1) {   
         return false
        }
       } 
       return true
}
let checkOccupiedTwo = (originalPos) => { //tämä katsoo osuuko blokki blokkikasaan eli siirtää position, katsoo onko joku kulma kasassa jos on niin tämä piirtää edeltävän position.
        let x = originalPos
        if (checkMore()) {
                x.forEach(x => {
                        game.table.forEach(table => {
                                if (table.id == x) {
                                        table.occupied = 2
                                }
                        })
                })
                newBlock()
        }                
}
let gameDown = () => { //pelin perus osa vertikaalinen aloitus positio siirtyy yhden alaspäin... endline katsoo onko osuttu kentän alareunaan jos on se luo uuden blokin ja aloittaa kierron alusta tässä myös otetaan talteen sen hetkinen positio.
       endLine()
       gamePlay = setTimeout(gameDown, 600);
       let origPos = checkPosition()
       let orig = game.startPosV 
       if(game.startPosV <= 15) {
        game.startPosV++
        checkOccupiedTwo(origPos)
         if (checkIfOnMap()) {
          console.log(score)
         draw() 
       } else {
         game.startPosV = orig
       }
      }     
}
let createTableObj = () => { // luo pöytä olion
        let j = []
        let x = document.getElementsByTagName('td')
         for (i = 0; i < x.length; i++){
          j.push({id: x[i].id, occupied: 0})
         }
   return j
}
let checkRows = () => { //tarkastaa montako vanhaa palikkaa on rivillä. Tähän pitäisi olla parempi keino...
        let rows = new Uint16Array(16)
        game.table.forEach(table => {
                if (table.id.charAt(0) == 0) {
                        if (table.occupied == 2)
                        rows[0]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow0')
                } else if (table.id <= 18 && table.id >= 10) {
                        if (table.occupied == 2)
                        rows[1]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow1')
                } else if (table.id.charAt(0) == 2) {
                        if (table.occupied == 2)
                        rows[2]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow2') 
                } else if (table.id.charAt(0) == 3) {
                        if (table.occupied == 2)
                        rows[3]++  
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow3')
                } else if (table.id.charAt(0) == 4) {
                        if (table.occupied == 2)
                        rows[4]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow4')    
                } else if (table.id.charAt(0) == 5) {
                        if (table.occupied == 2)
                        rows[5]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow5')
                } else if (table.id.charAt(0) == 6) {
                        if (table.occupied == 2)
                        rows[6]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow6')
                } else if (table.id.charAt(0) == 7) {
                        if (table.occupied == 2)
                        rows[7]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow7')
                } else if (table.id.charAt(0) == 8) {
                        if (table.occupied == 2)
                        rows[8]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow8')
                } else if (table.id.charAt(0) == 9) {
                        if (table.occupied == 2)
                        rows[9]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow9')
                } else if (table.id >= 100 && table.id.charAt(1) == 0) {
                        if (table.occupied == 2)
                        rows[10]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow10')
                } else if (table.id >= 100 && table.id.charAt(1) == 1) {
                        if (table.occupied == 2)
                        rows[11]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow11')
                } else if (table.id >= 100 && table.id.charAt(1) == 2) {
                        if (table.occupied == 2)
                        rows[12]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow12')
                } else if (table.id >= 100 && table.id.charAt(1) == 3) {
                        if (table.occupied == 2)
                        rows[13]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow13')
                } else if (table.id >= 100 && table.id.charAt(1) == 4) {
                        if (table.occupied == 2)
                        rows[14]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow14')
                } else if (table.id >= 100 && table.id.charAt(1) == 5) {
                        if (table.occupied == 2)
                        rows[15]++
                        let x = document.getElementById(table.id)
                        x.setAttribute('class', 'onRow15')
                }                              
        })
        return rows
}
let deleteRow = () => { //poistaa täyden rivin ja lähettää tiedon eteenpäin palikkakasa funktiolle
        row = checkRows().indexOf(9)
        scoreMultiplier = 0
        while (row != -1) {
                score = score + 10
                scoreMultiplier++
                console.log(scoreMultiplier)
                row = checkRows().indexOf(9)
                let delRow = 'onRow' + row
                let x = document.getElementsByClassName(delRow)
                let xIds = () => {
                        let y = []
                        for (i = 0; i < x.length; i++) {
                                y.push(x[i].id)
                        } return y
                }
                game.table.forEach(table => {
                        xIds().forEach(x => { if (table.id == x) {
                                table.occupied = 0
                        }
                })
        }) 
                for (i = 0; i < x.length; i++) {
                        x[i].setAttribute('class', 'free')
                }
                moveExBlock(row)
        } 
        scoreMultParse = "1." + scoreMultiplier
        console.log(scoreMultParse)
        score = Math.floor(score * scoreMultParse)
        scoreBoard.innerHTML = `Score: ${score}`
}
let moveExBlock = (rowActive) => { // luo palikka kasan sijainnin ja luo position kaikista palikoista poistetun rivin yläpuolelta yhden alaspäin    
 let occu = getOccupied()
 let y = []
 let x
 let z
 let i
  if (occu.length >= 1) {
        for (j = 0; j < occu.length; j++) {
                z = occu[j].substring(occu[j].length -1, 0)
                if (z < rowActive)
                z++
                x = occu[j].slice(-1)
                i = z + x
                y.push(i)
                }
        } drawBlockMass(y, occu)   
}
let drawBlockMass = (newPos, oldPos) => { //piirtää palikka kasan uuden position ja poistaa vanhat..
let x = []  
let y = []      
        game.table.forEach(table => { 
                oldPos.forEach(pos => { 
                        if (table.id == pos) {
                                table.occupied = 0}
                        })
                })        
        game.table.forEach(table => { 
                if (table.occupied == 0) {
                        x.push(document.getElementById(table.id))
                        }
                })
         x.forEach(x => {
                 x.setAttribute("class", "free")
                        })
        newPos.forEach(pos => {
                game.table.forEach(table => {
                        if (table.id == pos) {
                                table.occupied = 2 
                                        }
                                })
                        })
        game.table.forEach(table => {
                 if (table.occupied == 2) {
                         y.push(document.getElementById(table.id))
                                }
                        })
        y.forEach(y => {
                y.setAttribute("class", "occupied")
        })
        
}
let endLine = () => { //luo kentän pohjan, checkline määrittää
        let x = checkPosition()
        if (checkLine()) {
                x.forEach(x => {
                        game.table.forEach(table => {
                                if (table.id == x) {
                                        table.occupied = 2
                                }
                        })
                })
            newBlock()    
        }
}        
let checkLine = () => { //määrittää pohjan
        let x = checkPosition()
        let y = false
        x.forEach(x => { if (x >= 150) {
                y = true
        }
    })
    return y
}
let checkMore = () => { //tarkastaa osutaanko palikka kassaan
        let x = checkPosition()
        let y = getOccupied()
        let sir = false
        x.forEach(x => {
                y.forEach(y => { 
                        if (x == y) { 
                                sir = true
                        }
                })
        })
        return sir
}                
let getOccupied = () => { //luo taulokon palikkakasasta
        let x = []
        game.table.forEach(table => {
                if (table.occupied == 2) {
                        x.push(table.id)
                }
        })
        return x
}
let game = { // 0 = zigzag, 1 = straight, 2 = square, 3 = tblock
    table: [], 
    startPosH: 3,
    startPosV: 2,  
    aligment: 0,  

    blocks: [{ /*zigzag*/  
                active: false,
                position: (pos1, pos2, alig) => {
                        let pos = [/*pos0*/[[pos1, pos2].join(''), [pos1 + 1, pos2 - 1].join(''), [pos1, pos2 + 1].join(''), [pos1 + 1, pos2].join('')],
                                   /*pos0*/[[pos1, pos2].join(''), [pos1 - 1, pos2 - 1].join(''), [pos1, pos2 - 1].join(''), [pos1 + 1, pos2].join('')],
                                   /*pos0*/[[pos1, pos2].join(''), [pos1, pos2 - 1].join(''), [pos1 - 1, pos2].join(''), [pos1 - 1, pos2 + 1].join('')],
                                   /*pos0*/[[pos1, pos2].join(''), [pos1 - 1, pos2].join(''), [pos1, pos2 + 1].join(''), [pos1 + 1, pos2 + 1].join('')]
                                  ]

                                return pos[alig]
                }          
                
       },
              {/*straight*/
                active: false,
                position: (pos1, pos2, alig) => {
                        let pos = [/*pos0*/[[pos1, pos2].join(''), [pos1 + 1, pos2].join(''), [pos1 + 2, pos2].join(''), [pos1 - 1, pos2].join(''), [pos1 - 2, pos2].join('')],
                                   /*pos1*/[[pos1, pos2].join(''), [pos1, pos2 + 1].join(''), [pos1, pos2 + 2].join(''), [pos1, pos2 - 1].join(''), [pos1, pos2 - 2].join('')],
                                   /*pos2*/[[pos1, pos2].join(''), [pos1 + 1, pos2].join(''), [pos1 + 2, pos2].join(''), [pos1 - 1, pos2].join(''), [pos1 - 2, pos2].join('')],
                                   /*pos3*/[[pos1, pos2].join(''), [pos1, pos2 + 1].join(''), [pos1, pos2 + 2].join(''), [pos1, pos2 - 1].join(''), [pos1, pos2 - 2].join('')]
                        ] 

                
                return pos[alig]
                }
       },
              {/*square*/     
                active: false,
                position: (pos1, pos2, alig) => {
                        let pos = [/*pos0*/[[pos1, pos2].join(''), [pos1 + 1, pos2].join(''), [pos1 + 1, pos2 - 1].join(''), [pos1, pos2 - 1].join('')],
                                   /*pos1*/[[pos1, pos2].join(''), [pos1, pos2 - 1].join(''), [pos1 - 1, pos2 - 1].join(''), [pos1 - 1, pos2].join('')],
                                   /*pos2*/[[pos1, pos2].join(''), [pos1 - 1, pos2].join(''), [pos1 - 1, pos2 + 1].join(''), [pos1, pos2 + 1].join('')],
                                   /*pos3*/[[pos1, pos2].join(''), [pos1, pos2 + 1].join(''), [pos1 + 1, pos2 + 1].join(''), [pos1 + 1, pos2].join('')]
                        ] 

                return pos[alig]
                }
       },
              {/*tblock*/    
                active: false,
                position: (pos1, pos2, alig) => {
                        let pos = [/*pos0*/[[pos1, pos2].join(''), [pos1, pos2 - 1].join(''), [pos1 - 1, pos2].join(''), [pos1, pos2 + 1].join('')],
                                   /*pos1*/[[pos1, pos2].join(''), [pos1 - 1, pos2].join(''), [pos1, pos2 + 1].join(''), [pos1 + 1, pos2].join('')],
                                   /*pos2*/[[pos1, pos2].join(''), [pos1, pos2 - 1].join(''), [pos1 + 1, pos2].join(''), [pos1, pos2 + 1].join('')],
                                   /*pos3*/[[pos1, pos2].join(''), [pos1 +1, pos2].join(''), [pos1, pos2 - 1].join(''), [pos1 - 1, pos2].join('')]
             ] 
                return pos[alig]
                }
       },
               {/*L*/
                active: false,
                position: (pos1, pos2 ,alig) => {
                        let pos = [/*pos0*/[[pos1, pos2].join(''), [pos1 + 1, pos2].join(''), [pos1 - 1, pos2].join(''), [pos1 -1, pos2 - 1].join('')],
                                   /*pos1*/[[pos1, pos2].join(''), [pos1, pos2 + 1].join(''), [pos1, pos2 - 1].join(''), [pos1 - 1, pos2 + 1].join('')],
                                   /*pos2*/[[pos1, pos2].join(''), [pos1 +1, pos2].join(''), [pos1 - 1, pos2].join(''), [pos1 + 1, pos2 + 1].join('')],
                                   /*pos3*/[[pos1, pos2].join(''), [pos1, pos2 + 1].join(''), [pos1, pos2 - 1].join(''), [pos1 + 1, pos2 - 1].join('')]
              ]
                return pos[alig]                  
                }
        }
  ]
}
window.onload = init()