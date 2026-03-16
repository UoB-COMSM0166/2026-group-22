class Boss extends Entity {
    constructor(x, y) {
        // x, y, width, height, hp, speed
        super(x, y, 150, 200, 500, 0); 
        this.maxHp = 500;
        this.isHurt = false;
        this.hurtTimer = 0;
        this.attackTimer = 0;
    }

    update() {
        // 漂浮动画
        this.y += Math.sin(frameCount * 0.05) * 2;
        
        if (this.isHurt) {
            this.hurtTimer--;
            if (this.hurtTimer <= 0) this.isHurt = false;
        }

        // Boss 攻击逻辑：返回一个子弹对象供 World 或 Sketch 处理
        this.attackTimer++;
        if (this.attackTimer > 60 && this.hp > 0) {
            this.attackTimer = 0;
            return { 
                x: this.x - 50, 
                y: this.y + random(-50, 50),
                speed: -7, 
                range: 800, 
                distanceTraveled: 0 
            };
        }
        return null;
    }

    show() {
        if (this.hp <= 0) return;
        push();
        translate(this.x, this.y);
        
        // 绘制 Boss 主体
        fill(this.isHurt ? [255, 0, 0] : [150, 50, 250]);
        stroke(255);
        strokeWeight(4);
        rectMode(CENTER);
        rect(0, 0, this.w, this.h, 20);
        
        // 愤怒的眼睛：血越少眼睛越窄
        fill(255);
        let eyeH = map(this.hp, 0, 500, 5, 40);
        ellipse(-30, -40, 30, eyeH);
        ellipse(30, -40, 30, eyeH);
        pop();
    }

    takeDamage(amount) {
        this.hp -= amount;
        this.isHurt = true;
        this.hurtTimer = 10;
        // 触发震屏效果（对应 sketch.js 中的变量）
        if (typeof shakeAmount !== 'undefined') shakeAmount = 10;
    }
}