class Menu {
  constructor() {
    this.buttons = [];

    this.buttons.push(new Button(0, 100, "START", () => {
      status.start = true;
      status.tutorial = false;
      status.credits = false;
    }));

    this.buttons.push(new Button(0, 100 + height * 0.11, "TUTORIAL (RECOMMENDED)", () => {
      status.start = false;
      status.tutorial = true;
      status.credits = false;
      assets.tutorial.show();
      assets.tutorial.play();

    }));
    this.buttons.push(new Button(0, 100 + height * 0.22, "CREDITS", () => {
      status.start = false;
      status.tutorial = false;
      status.credits = true;
    }, true));

    this.c_h = 0;
    this.c_max_h = height * 0.9 - (this.buttons[2].y + this.buttons[2].h);
  }

  start() {
    let multiplier = width * 1.1 / 720;
    push();
    translate(width / 2 + map(mouseX, 0, width, 30 * r.x, -30 * r.x), height / 2 + map(mouseY, 0, height, 30 * r.y, -30 * r.y));

    imageMode(CENTER);
    image(assets.bg, 0, 0, 720 * multiplier, 810 * multiplier);

    rectMode(CENTER);
    noStroke();
    fill(255, 40);
    rect(0, 0, width * 1.5, height * 1.5);

    rotate(atan2(mouseY - height / 2, mouseX - width / 2) + PI / 2);
    image(assets.sprites.player, 0, 0, width * 0.1, width * 0.1);
    pop();

    push();
    rectMode(CORNER);
    noStroke();
    fill(220, this.buttons[2].alpha);
    rect(0, this.buttons[2].y + this.buttons[2].h, this.buttons[2].w, this.c_h);
    pop();
    
    let x = 100 * r.x;
    let y = this.buttons[2].y + this.buttons[2].h + 50 * r.y;
    push();
    textAlign(LEFT, CENTER);
    rectMode(CORNER);
    fill(0, map(this.c_h, 0, this.c_max_h, 0, 255));
    textSize(40 * r.x);
    text("Code", x, y);
    text("Art", x, y + 150 * r.y);
    text("Sound Design", x, y + 300 * r.y);
    text("Special Thanks to", x + 700 * r.x, y);
    
    fill(0, map(this.c_h, 0, this.c_max_h, 0, 180));
    textSize(28 * r.x);
    text("> Kagan Atalay", x, y + 50 * r.y);
    text("> Mehmet Ali Bagıbala", x, y + 200 * r.y);
    text("> Kagan Atalay", x, y + 350 * r.y);
    text("> Mehmet Ali Bagıbala", x, y + 400 * r.y);
    text("WPI for orginising this amazing event and giving us opportunity to test our skills and enhance our teamwork skills. Our playtesters that helped us balance the game further to make it a better experience and most importantly our team, Istech Robotics Society 5993 for keeping us motivated during the development stage.", x + 700 * r.x, y - 160 * r.y, this.buttons[2].maxw - (x + 700 * r.x) - 300 * r.x, height - y);
    pop();

    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].start();
    }

    if (this.buttons[2].active) {
      this.c_h = lerp(this.c_h, this.c_max_h, 0.1);
    } else {
      this.c_h = lerp(this.c_h, 0, 0.1);
    }
  }
}

function Button(x, y, txt, func) {
  this.x = x;
  this.y = y;

  this.hovering = false;

  this.c = width * 0.2;
  this.w = width * 0.2;
  this.h = height * 0.1;
  this.maxw = width;
  this.txt = txt;

  this.alpha_c = 150;
  this.alpha = 150;
  this.max_alpha = 255;

  this.func = func;
  this.active = false;

  this.txt_c = 26 * r.x;
  this.txt_size = 26;
  this.max_txt_size = 60 * r.x;

  this.start = function() {
    this.render();
    this.update();
  }

  this.render = function() {
    push();
    rectMode(CORNER);
    noStroke();
    fill(220, this.alpha);
    rect(this.x, this.y, this.w, this.h, 4);

    fill(51, this.alpha);
    textSize(this.txt_size);
    textAlign(CENTER, CENTER);
    text(this.txt, this.x + this.w / 2, this.y + this.h / 2);
    pop();
  }

  this.update = function() {
    if (this.hovered()) {
      this.w = lerp(this.w, this.maxw, 0.1);
      this.txt_size = lerp(this.txt_size, this.max_txt_size, 0.1);
      this.alpha = lerp(this.alpha, this.max_alpha, 0.1);
    } else {
      if (this.active == false) {
        this.w = lerp(this.w, this.c, 0.1);
        this.txt_size = lerp(this.txt_size, this.txt_c, 0.1);
        this.alpha = lerp(this.alpha, this.alpha_c, 0.1);
      }
    }

    if (this.hovered() && this.hovering == false) {
      this.hovering = true;
    }

    if (this.hovered() == false) {
      this.hovering = false;
    }
  }

  this.hovered = function() {
    return mouseX >= this.x && mouseX <= this.x + this.w && mouseY >= this.y && mouseY <= this.y + this.h;
  }

}