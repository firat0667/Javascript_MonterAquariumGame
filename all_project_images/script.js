window.addEventListener('load',function(){
    const canvas=document.getElementById('canvas1'); // HTML'de "canvas1" id'sine sahip canvas elementini alır
    const ctx =canvas.getContext('2d'); // Canvas'in 2D bağlamını alır
    canvas.width=1280; // Canvas'in genişliğini ayarlar
    canvas.height=720; // Canvas'in yüksekliğini ayarlar

    ctx.fillStyle='white'; // Doldurma rengini beyaz olarak ayarlar
    ctx.lineWidth=3; // Çizgi kalınlığını ayarlar
    ctx.strokeStyle='white'; // Çizgi rengini beyaz olarak ayarlar

    class Player{ // Oyuncu sınıfı tanımlanır
        constructor(game){
            this.game=game; // Oyuncunun oyun nesnesine erişimi sağlar
            this.collisionX=this.game.width*0.5; // Çarpışma X pozisyonunu ayarlar
            this.collisionY=this.game.height*0.5; // Çarpışma Y pozisyonunu ayarlar
            this.colllisonRadius=50; // Çarpışma yarıçapını ayarlar
            this.speedX=0; // X ekseni hızını ayarlar
            this.speedY=0; // Y ekseni hızını ayarlar
            this.dx=0; // Fare ile oyuncu arasındaki mesafeyi tutar (X)
            this.dy=0; // Fare ile oyuncu arasındaki mesafeyi tutar (Y)
            this.speedModifier=5; // Hızı ayarlar

        }
        draw(context){ // Oyuncuyu çizer
            context.beginPath(); // Yeni bir çizim yolu başlatır
            context.arc(this.collisionX, this.collisionY , 50 ,0,Math.PI*2); // Yarıçapı 50 olan bir daire çizer
            context.save(); // Çizim durumunu kaydeder
            context.globalAlpha=.5; // Genel saydamlığı ayarlar
            context.fill(); // Şekli doldurur
            context.restore(); // Çizim durumunu geri yükler
            context.stroke(); // Şekli çizer
            context.beginPath(); // Yeni bir çizim yolu başlatır
            context.moveTo(this.collisionX,this.collisionY); // Başlangıç noktasını ayarlar
            context.lineTo(this.game.mouse.x,this.game.mouse.y); // Bitiş noktasını ayarlar
            context.stroke(); // Şekli çizer
        }
        update(){ // Oyuncunun pozisyonunu günceller
            this.dx=this.game.mouse.x-this.collisionX; // Fare ile oyuncu arasındaki mesafeyi hesaplar (X)
            this.dy=this.game.mouse.y-this.collisionY; // Fare ile oyuncu arasındaki mesafeyi hesaplar (Y)
            const distance=Math.hypot(this.dy,this.dx); // İki nokta arasındaki uzaklığı hesaplar
            if(distance>this.speedModifier){ // Eğer mesafe belirtilen hızdan büyükse
                this.speedX=this.dx/distance || 0; // X ekseni hızını ayarlar
                this.speedY=this.dy/distance || 0; // Y ekseni hızını ayarlar
            }
            else{ // Eğer mesafe belirtilen hızdan küçükse
                this.speedX= 0; // X ekseni hızını sıfırlar
                this.speedY= 0; // Y ekseni hızını sıfırlar
            }
            this.collisionX +=this.speedX*this.speedModifier; // X ekseni pozisyonunu günceller
            this.collisionY +=this.speedY*this.speedModifier; // Y ekseni pozisyonunu günceller
            // collison the obstacles
            this.game.obstacles.forEach(obstacle=>{if(this.game.checkcollision(this,obstacle)){
                console.log('collision');
            };

            })
        }
    }

    class Obstacle{
        constructor(game){
            this.game=game;
            this.collisionX=Math.random()*this.game.width;
            this.collisionY=Math.random()*this.game.height;
            this.colllisonRadius=60;
            this.image=document.getElementById('obstacles');
            this.spriteWidth=250;
            this.spriteHeight=250;
            this.width=this.spriteWidth;
            this.height=this.spriteHeight;
            this.spriteX=this.collisionX-this.width*0.5;
            this.spriteY=this.collisionY-this.height*0.5-70;
            this.frameX=Math.floor(Math.random()*4);
            this.frameY=Math.floor(Math.random()*3);
        }
        draw(context){
            context.drawImage(this.image,this.frameX*this.spriteWidth,0*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.spriteX,this.spriteY,this.width,this.height);
            context.beginPath(); // Yeni bir çizim yolu başlatır
            context.arc(this.collisionX, this.collisionY , this.colllisonRadius ,0,Math.PI*2); // Yarıçapı 50 olan bir daire çizer
            context.save(); // Çizim durumunu kaydeder
            context.globalAlpha=.5; // Genel saydamlığı ayarlar
            context.fill(); // Şekli doldurur
            context.restore(); // Çizim durumunu geri yükler
            context.stroke(); // Şekli çizer
        }
    }

    class Game{ // Oyun sınıfı tanımlanır
        constructor(canvas){
            this.canvas=canvas; // Oyunun canvas nesnesine erişimi sağlar
            this.width=this.canvas.width; // Oyun genişliğini ayarlar
            this.height=this.canvas.height; // Oyun yüksekliğini ayarlar
            this.topMargin=260;
            this.Player=new Player(this); // Oyuncu nesnesi oluşturur
            this.numberOFobstacles=10;
            this.obstacles=[];

            this.mouse={ // Fare koordinatları ve basılı olup olmadığını tutar
                x:this.width*0.5, // X koordinatını ayarlar
                y:this.height*0.5, // Y koordinatını ayarlar
                pressed:false // Fare tuşuna basılıp basılmadığını belirler
            }

            // Fare olay dinleyicileri
            canvas.addEventListener('mousedown',e=>{ // Fare tuşuna basıldığında
                this.mouse.x=e.offsetX; // Fare X pozisyonunu günceller
                this.mouse.y=e.offsetY; // Fare Y pozisyonunu günceller
                this.mouse.pressed=true; // Fare tuşuna basıldığını belirler
            });
            canvas.addEventListener('mouseup',e=>{ // Fare tuşu bırakıldığında
                this.mouse.x=e.offsetX; // Fare X pozisyonunu günceller
                this.mouse.y=e.offsetY; // Fare Y pozisyonunu günceller
                this.mouse.pressed=false; // Fare tuşuna basılmadığını belirler
            });
            canvas.addEventListener('mousemove',e=>{ // Fare hareket ettiğinde
                this.mouse.x=e.offsetX; // Fare X pozisyonunu günceller
                this.mouse.y=e.offsetY; // Fare Y pozisyonunu günceller
            });
        }
        render(context){ // Oyunu çizer
            this.Player.draw(context); // Oyuncuyu çizer
            this.Player.update(); // Oyuncunun pozisyonunu günceller
            this.obstacles.forEach(Obstacle=>Obstacle.draw(context));
        }
        checkcollision(a,b){
            const dx = a.collisionX-b.collisionX;
            const dy = a.collisionY-b.collisionY;
            const distance=Math.hypot(dx,dy);
            const sumOfRadii=a.colllisonRadius+b.colllisonRadius;
            return(distance<sumOfRadii);
        }
        init(){
           let attemps=0;
           while(this.obstacles.length<this.numberOFobstacles&&attemps<500){
            let testObstacle=new Obstacle(this);
            let overlap=false;
            this.obstacles.forEach(obstacle=>{const dx =testObstacle.collisionX-obstacle.collisionX;
            const dy=testObstacle.collisionY-obstacle.collisionY
            const distance=Math.hypot(dx,dy);
            const distanceBuffer=100;
            const sumofRadii=testObstacle.colllisonRadius+obstacle.colllisonRadius+distanceBuffer;
            if(distance<sumofRadii){
                overlap=true;
            }
        });
        const margin=testObstacle.colllisonRadius*2;
        if(!overlap && testObstacle.spriteX>0 && testObstacle.spriteX<this.width-testObstacle.width
            && testObstacle.collisionY>this.topMargin+margin && testObstacle.collisionY<this.height-margin){
            this.obstacles.push(testObstacle);
        }
            attemps++;
           }
        }
    }
    const game=new Game(canvas); // Oyun nesnesi oluşturur
    game.init();
    console.log(game); // Oyun nesnesini konsola yazar

    function animate(){ // Animasyon işlevi
        ctx.clearRect(0,0,canvas.width,canvas.height); // Canvas'i temizler
        game.render(ctx); // Oyunu çizer
        window.requestAnimationFrame(animate); // Animasyonu tekrar çağırır
    }
    animate(); // Animasyonu başlatır
});
