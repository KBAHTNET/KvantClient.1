const hexagonStart = () => {
  try {
    var w = c.width = document.getElementById('app').scrollWidth,
      h = c.height = document.getElementById('app').scrollHeight,
      ctx = c.getContext('2d'),

      opts = {

        len: 200,
        count: 10,
        baseTime: 200,
        addedTime: 1,
        dieChance: .0,
        spawnChance: 1,
        sparkChance: .0,
        sparkDist: 0,
        sparkSize: 0,

        color: 'hsl(hue,100%,light%)',
        baseLight: 60,
        addedLight: 0, // [50-10,50+10]
        shadowToTimePropMult: 0.,
        baseLightInputMultiplier: .0,
        addedLightInputMultiplier: .0,

        cx: 0,
        cy: h / 2,
        repaintAlpha: .0,
        hueChange: .0
      },

      tick = 0,
      lines = [],
      dieX = w / 2 / opts.len,
      dieY = h / 2 / opts.len,

      baseRad = Math.PI * 2 / 8;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);

    function loop() {
      try {

        window.requestAnimationFrame(loop);

        ++tick;

        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(0,0,0,alp)'.replace('alp', opts.repaintAlpha);
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        if (lines.length < opts.count && Math.random() < opts.spawnChance)
          lines.push(new Line);

        lines.map(function (line) {
          line.step();
        });
      } catch {}
    }

    function Line() {

      this.reset();
    }
    Line.prototype.reset = function () {

      this.x = 0;
      this.y = 0;
      this.addedX = 0;
      this.addedY = 0;

      this.rad = 0;

      this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math.random();

      this.color = opts.color.replace('hue', tick * opts.hueChange);
      this.cumulativeTime = 0;

      this.beginPhase();
    }
    Line.prototype.beginPhase = function () {

      this.x += this.addedX;
      this.y += this.addedY;

      this.time = 0;
      this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0;

      this.rad += baseRad * (Math.random() < .5 ? 1 : -1);
      //this.addedX = Math.cos(this.rad);
      //this.addedY = Math.sin(this.rad);
      this.addedX = (Math.random() < .5 ? 1 : -1) * Math.cos(this.rad);
      this.addedY = (Math.random() < .5 ? 1 : -1) * Math.sin(this.rad);

      if (Math.random() < opts.dieChance || this.x > dieX || this.x < -dieX || this.y > dieY || this.y < -dieY) {
        //this.reset();
      }
    }
    Line.prototype.step = function () {
      try {
        ++this.time;
        ++this.cumulativeTime;

        if (this.time >= this.targetTime)
          this.beginPhase();

        var prop = this.time / this.targetTime,
          wave = Math.sin(prop * Math.PI / 2),
          x = this.addedX * wave,
          y = this.addedY * wave;

        ctx.shadowBlur = prop * opts.shadowToTimePropMult;
        ctx.fillStyle = ctx.shadowColor = this.color.replace('light', opts.baseLight + opts.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier));
        ctx.fillRect(opts.cx + (this.x + x) * opts.len, opts.cy + (this.y + y) * opts.len, 2, 2);

        if (Math.random() < opts.sparkChance)
          ctx.fillRect(opts.cx + (this.x + x) * opts.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2, opts.cy + (this.y + y) * opts.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2, opts.sparkSize, opts.sparkSize)
      } catch {}
    }
    loop();

    window.addEventListener('resize', function () {

      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, w, h);

      opts.cx = w / 2;
      opts.cy = h / 2;

      dieX = w / 2 / opts.len;
      dieY = h / 2 / opts.len;
    });
  } catch {}
}

module.exports = {
  hexagonStart
};