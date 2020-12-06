class Projectile {
  constructor(x, y, angle, speed, r, col) {
    this.pos = createVector(x, y);
    this.col = col;
    this.vel = p5.Vector.fromAngle(angle).mult(speed);
    this.speed = speed;
    this.rad = 3 * r.x;
  }
  
  start() {
    this.render();
    this.update();
  }
  
  render() {
    push();
    fill(this.col);
    ellipse(this.pos.x, this.pos.y, this.rad * 2);
    pop();
  }
  
  update() {
    this.pos.add(this.vel);
  }
  
  collides(obj) {
    let d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    if(d < this.rad + obj.rad) {
      return true;
    } else {
      return false;
    }
  }
}