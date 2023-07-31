const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class LED {
    constructor(x,y, den) {
        this.pwm = 0; // Valor PWM de brillo (0 a 255)
        this.color = 'red'; // Color del LED
        
        this.posicion = [x,y]
        
        this.vel = 0
        
        this.den = den
    }
    
    // Establecer el brillo del LED (valor PWM: 0 a 255)
    setPwm(pwm) {
        if (pwm < 0) {
            this.pwm = 0;
        } else if (pwm > 255) {
            this.pwm = 255;
        } else {
            this.pwm = pwm;
        }
    }
    
    draw(){
        drawCircle(ctx, this.posicion[0],this.posicion[1], 10,"black",1)
        let pot
        if(this.den){
            pot = this.pwm/15
        }else{
            pot = this.pwm/200
        }
        drawCircle_alpha(ctx, this.posicion[0],this.posicion[1], 10, "pink", pot>1?1:pot)
    }
    
    // Establecer el color del LED
    setColor(color) {
        this.color = color;
    }
    
    // Obtener el estado actual del LED (brillo y color)
    getState() {
        return {
            pwm: this.pwm,
            color: this.color,
        };
    }
}

var matriz = []
var k = 1, peso=100

for (let i = 0; i < 50; i++) {
    let fila = []
    for (let j = 0; j < 20; j++) {
        fila.push(new LED(i*25+window.innerWidth/2-(25*50)/2, j*25+window.innerHeight/2-(25*20)/2, false))
    }
    matriz.push(fila)
}

// matriz[1][1].den = true
matriz[1+22][2+6].den = true
matriz[2+22][1+6].den = true
matriz[2+22][2+6].den = true
matriz[3+22][2+6].den = true
matriz[4+22][2+6].den = true
matriz[5+22][1+6].den = true
matriz[5+22][2+6].den = true
matriz[6+22][2+6].den = true
matriz[1+22][3+6].den = true
matriz[2+22][3+6].den = true
matriz[3+22][3+6].den = true
matriz[4+22][3+6].den = true
matriz[5+22][3+6].den = true
matriz[6+22][3+6].den = true
matriz[2+22][4+6].den = true
matriz[3+22][4+6].den = true
matriz[4+22][4+6].den = true
matriz[5+22][4+6].den = true
matriz[3+22][5+6].den = true
matriz[4+22][5+6].den = true



function eucDis(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    return distancia;
}


canvas.addEventListener('click', (event) => {
    let x = event.clientX
    let y = event.clientY
    
    matriz.forEach(fila => {
        fila.forEach(led => {
            d = eucDis(led.posicion[0],led.posicion[1],x,y)
            if(d<20){
                led.setPwm(255)
            }
        });
    });
});


function update(){
    
    
    matriz.forEach((fila, i) => {
        fila.forEach((led, j) => {
            
            if(led.pwm==0 && led.vel<-1){
                led.vel*=0
            }else{
                led.vel-=0.05
            }
            
            if(j<fila.length-1){
                fila[j+1].vel+=((led.pwm-fila[j+1].pwm)*k)/peso
            }
            if(j>0){
                fila[j-1].vel+=((led.pwm-fila[j-1].pwm)*k)/peso
            }
            if(i<matriz.length-1){
                matriz[i+1][j].vel+=((led.pwm-matriz[i+1][j].pwm)*k)/peso
            }
            if(i>0){
                matriz[i-1][j].vel+=((led.pwm-matriz[i-1][j].pwm)*k)/peso
            }
            if(led.vel>15){
                led.vel=15
            }
            led.setPwm(led.pwm+led.vel)
        });
    });
    
}  



setInterval(() => {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawRectangle(ctx, 0, 0, canvas.width, canvas.height, "black")
    matriz.forEach(fila => {
        fila.forEach(led => {
            led.draw();
        });
    });
    update()
}, 10);