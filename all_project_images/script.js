if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        const canvas = document.getElementById('canvas1'); // HTML'de "canvas1" id'sine sahip canvas elementini alır
        const ctx = canvas.getContext('2d'); // Canvas'in 2D bağlamını alır
        canvas.width = 1280; // Canvas'in genişliğini ayarlar
        canvas.height = 720; // Canvas'in yüksekliğini ayarlar

        ctx.fillStyle = 'white'; // Doldurma rengini beyaz olarak ayarlar
        ctx.lineWidth = 3; // Çizgi kalınlığını ayarlar
        ctx.strokeStyle = 'white'; // Çizgi rengini beyaz olarak ayarlar

        class Player { // Oyuncu sınıfı tanımlanır
            constructor(game) {
                this.game = game; // Oyuncunun oyun nesnesine erişimi sağlar
                this.collisionX = this.game.width * 0.5; // Çarpışma X pozisyonunu ayarlar
                this.collisionY = this.game.height * 0.5; // Çarpışma Y pozisyonunu ayarlar
                this.collisionRadius = 30; // Çarpışma yarıçapını ayarlar
                this.speedX = 0; // X ekseni hızını ayarlar
                this.speedY = 0; // Y ekseni hızını ayarlar
                this.dx = 0; // Fare ile oyuncu arasındaki mesafeyi tutar (X)
                this.dy = 0; // Fare ile oyuncu arasındaki mesafeyi tutar (Y)
                this.speedModifier = 5; // Hızı ayarlar
                this.spriteWidth = 255;
                this.spriteHeight = 255;
                this.width = this.spriteWidth;
                this.height = this.spriteHeight;
                this.spriteX;
                this.spriteY;
                this.frameX = 0;
                this.frameY = 5;
                this.image = document.getElementById('bull');
            }
            draw(context) { // Oyuncuyu çizer
                context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
                if(this.game.debug){
                    context.beginPath(); // Yeni bir çizim yolu başlatır
                    context.arc(this.collisionX, this.collisionY, 50, 0, Math.PI * 2); // Yarıçapı 50 olan bir daire çizer
                    context.save(); // Çizim durumunu kaydeder
                    context.globalAlpha = .5; // Genel saydamlığı ayarlar
                    context.fill(); // Şekli doldurur
                    context.restore(); // Çizim durumunu geri yükler
                    context.stroke(); // Şekli çizer
                    context.beginPath(); // Yeni bir çizim yolu başlatır
                    context.moveTo(this.collisionX, this.collisionY); // Başlangıç noktasını ayarlar
                    context.lineTo(this.game.mouse.x, this.game.mouse.y); // Bitiş noktasını ayarlar
                    context.stroke(); // Şekli çizer
                }
       
            }
            update() { // Oyuncunun pozisyonunu günceller
                this.dx = this.game.mouse.x - this.collisionX; // Fare ile oyuncu arasındaki mesafeyi hesaplar (X)
                this.dy = this.game.mouse.y - this.collisionY; // Fare ile oyuncu arasındaki mesafeyi hesaplar (Y)
                // sprite animation
                const angle = Math.atan2(this.dy, this.dx);
                if(angle<-1.17) this.frameY=0;
                else if(angle<-0.39) this.frameY=1;
                else if(angle<0.39) this.frameY=2;
                else if(angle<1.17) this.frameY=3;
                else if(angle<1.96) this.frameY=4;
                else if(angle<2.74) this.frameY=5;
                else if(angle<-2.74 || angle >2.74) this.frameY=6;
                else if(angle<-1.96) this.frameY=7;
                const distance = Math.hypot(this.dy, this.dx); // İki nokta arasındaki uzaklığı hesaplar

                if (distance > this.speedModifier) { // Eğer mesafe belirtilen hızdan büyükse
                    this.speedX = this.dx / distance || 0; // X ekseni hızını ayarlar
                    this.speedY = this.dy / distance || 0; // Y ekseni hızını ayarlar
                } else { // Eğer mesafe belirtilen hızdan küçükse
                    this.speedX = 0; // X ekseni hızını sıfırlar
                    this.speedY = 0; // Y ekseni hızını sıfırlar
                }
                this.collisionX += this.speedX * this.speedModifier; // X ekseni pozisyonunu günceller
                this.collisionY += this.speedY * this.speedModifier; // Y ekseni pozisyonunu günceller
                this.spriteX = this.collisionX - this.width * 0.5;
                this.spriteY = this.collisionY - this.height * 0.5 - 100;

               // Horizontal boundaries
                if(this.collisionX<this.collisionRadius)
                    this.collisionX=this.collisionRadius;
                else if(this.collisionX>this.game.width-this.collisionRadius)
                    this.collisionX=this.game.width-this.collisionRadius;
              // Vertical Boundries
               if(this.collisionY<this.game.topMargin+this.collisionRadius)
                this.collisionY=this.game.topMargin+this.collisionRadius;
              else if(this.collisionY>this.game.height-this.collisionRadius)this.collisionY=this.game.height-this.collisionRadius;

                this.game.obstacles.forEach(obstacle => {
                    let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);
                    if (collision) {
                        const unit_x = dx / distance;
                        const unit_y = dy / distance;
                        this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
                        this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
                    }
                })
            }
        }

        // Engellerin sınıfı tanımlanır
        class Obstacle {
            constructor(game) {
                this.game = game; // Oyun nesnesine erişim sağlar
                this.collisionX = Math.random() * this.game.width; // Engelin x pozisyonunu rastgele belirler
                this.collisionY = Math.random() * this.game.height; // Engelin y pozisyonunu rastgele belirler
                this.collisionRadius = 60; // Çarpışma yarıçapını ayarlar
                this.image = document.getElementById('obstacles'); // Engelin resmini belirler
                this.spriteWidth = 250; // Engelin genişliğini ayarlar
                this.spriteHeight = 250; // Engelin yüksekliğini ayarlar
                this.width = this.spriteWidth; // Engelin genişliğini ayarlar
                this.height = this.spriteHeight; // Engelin yüksekliğini ayarlar
                this.spriteX = this.collisionX - this.width * 0.5; // Engelin x pozisyonunu ayarlar
                this.spriteY = this.collisionY - this.height * 0.5 - 70; // Engelin y pozisyonunu ayarlar
                this.frameX = Math.floor(Math.random() * 4); // Engelin çerçeve x pozisyonunu rastgele belirler
                this.frameY = Math.floor(Math.random() * 3); // Engelin çerçeve y pozisyonunu rastgele belirler

            }
            draw(context) {
                context.drawImage(this.image, this.frameX * this.spriteWidth, 0 * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
                if(this.game.debug)
                    {
                    context.beginPath(); // Yeni bir çizim yolu başlatır
                    context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2); // Yarıçapı 50 olan bir daire çizer
                    context.save(); // Çizim durumunu kaydeder
                    context.globalAlpha = .5; // Genel saydamlığı ayarlar
                    context.fill(); // Şekli doldurur
                    context.restore(); // Çizim durumunu geri yükler
                    context.stroke(); // Şekli çizer
                }
           
            }
        }

        class Game { // Oyun sınıfı tanımlanır
            constructor(canvas) {
                this.canvas = canvas; // Oyunun canvas nesnesine erişimi sağlar
                this.width = this.canvas.width; // Oyun genişliğini ayarlar
                this.height = this.canvas.height; // Oyun yüksekliğini ayarlar
                this.topMargin = 260;
                this.debug=true;
                this.Player = new Player(this); // Oyuncu nesnesi oluşturur
                this.numberOfObstacles = 10;
                this.obstacles = [];

                this.mouse = { // Fare koordinatları ve basılı olup olmadığını tutar
                    x: this.width * 0.5, // X koordinatını ayarlar
                    y: this.height * 0.5, // Y koordinatını ayarlar
                    pressed: false // Fare tuşuna basılıp basılmadığını belirler
                }

                // Fare olay dinleyicileri
                canvas.addEventListener('mousedown', e => { // Fare tuşuna basıldığında
                    this.mouse.x = e.offsetX; // Fare X pozisyonunu günceller
                    this.mouse.y = e.offsetY; // Fare Y pozisyonunu günceller
                    this.mouse.pressed = true; // Fare tuşuna basıldığını belirler
                });
                canvas.addEventListener('mouseup', e => { // Fare tuşu bırakıldığında
                    this.mouse.x = e.offsetX; // Fare X pozisyonunu günceller
                    this.mouse.y = e.offsetY; // Fare Y pozisyonunu günceller
                    this.mouse.pressed = false; // Fare tuşuna basılmadığını belirler
                });
                canvas.addEventListener('mousemove', e => { // Fare hareket ettiğinde
                    this.mouse.x = e.offsetX; // Fare X pozisyonunu günceller
                    this.mouse.y = e.offsetY; // Fare Y pozisyonunu günceller
                });
                window.addEventListener('keydown',e=>{
                    if(e.key=='d')this.debug=!this.debug;
                    console.log(this.debug);
                });
            }
            render(context) { // Oyunu çizer
                this.Player.draw(context); // Oyuncuyu çizer
                this.Player.update(); // Oyuncunun pozisyonunu günceller
                this.obstacles.forEach(obstacle => obstacle.draw(context));
            }
            checkCollision(a, b) {
                const dx = a.collisionX - b.collisionX; // X eksenindeki mesafeyi hesaplar
                const dy = a.collisionY - b.collisionY; // Y eksenindeki mesafeyi hesaplar
                const distance = Math.hypot(dx, dy); // İki nokta arasındaki uzaklığı hesaplar
                const sumOfRadii = a.collisionRadius + b.collisionRadius; // İki çarpışma yarıçapının toplamını alır
                return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy]; // Çarpışma durumunu, mesafeyi, yarıçap toplamını ve mesafe vektörlerini döndürür
            }
            init() {
                let attempts = 0; // Deneme sayısını izler
                while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
                    let testObstacle = new Obstacle(this); // Yeni bir engel oluşturur
                    let overlap = false; // Çakışma kontrolü için bir bayrak
                    // Mevcut engellerle çakışmayı kontrol eder
                    this.obstacles.forEach(obstacle => {
                        const dx = testObstacle.collisionX - obstacle.collisionX; // X eksenindeki mesafeyi hesaplar
                        const dy = testObstacle.collisionY - obstacle.collisionY // Y eksenindeki mesafeyi hesaplar
                        const distance = Math.hypot(dx, dy); // İki nokta arasındaki uzaklığı hesaplar
                        const distanceBuffer = 100; // Engeller arası minimum mesafe tamponu
                        const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer; // İki çarpışma yarıçapının toplamını alır
                        if (distance < sumOfRadii) { // Eğer çakışma varsa
                            overlap = true; // Çakışma bayrağını ayarlar
                        }
                    });
                    const margin = testObstacle.collisionRadius * 2; // Engelin kenar boşluğunu hesaplar
                    if (!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width &&
                        testObstacle.collisionY > this.topMargin + margin && testObstacle.collisionY < this.height - margin) {
                        this.obstacles.push(testObstacle); // Engeli ekler
                    }
                    attempts++; // Deneme sayısını artırır
                }
            }
        }

        const game = new Game(canvas); // Oyun nesnesi oluşturur
        game.init();
        console.log(game); // Oyun nesnesini konsola yazar

        function animate() { // Animasyon işlevi
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas'i temizler
            game.render(ctx); // Oyunu çizer
            window.requestAnimationFrame(animate); // Animasyonu tekrar çağırır
        }
        animate(); // Animasyonu başlatır
    });
}
