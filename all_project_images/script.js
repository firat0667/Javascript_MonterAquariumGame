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
        }
    }

    class Game{ // Oyun sınıfı tanımlanır
        constructor(canvas){
            this.canvas=canvas; // Oyunun canvas nesnesine erişimi sağlar
            this.width=this.canvas.width; // Oyun genişliğini ayarlar
            this.height=this.canvas.height; // Oyun yüksekliğini ayarlar
            this.Player=new Player(this); // Oyuncu nesnesi oluşturur

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
        }
    }
    const game=new Game(canvas); // Oyun nesnesi oluşturur
    console.log(game); // Oyun nesnesini konsola yazar

    function animate(){ // Animasyon işlevi
        ctx.clearRect(0,0,canvas.width,canvas.height); // Canvas'i temizler
        game.render(ctx); // Oyunu çizer
        window.requestAnimationFrame(animate); // Animasyonu tekrar çağırır
    }
    animate(); // Animasyonu başlatır
});
