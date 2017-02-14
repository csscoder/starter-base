import ruler from './size-values';

function coverBox(options) {

  this.options = {
    item: options.item,
    parent: options.parent,
    aspectW: options.aspectW || 16,
    aspectH: options.aspectH || 9
  };

  let self = this;

  function update() {
    let parent = self.options.parent;
    let item = self.options.item;
    let width = ruler.getSize(parent)[0];
    let height = ruler.getSize(parent)[1];
    let aspectW = self.options.aspectW;
    let aspectH = self.options.aspectH;
    let scaleX = width / aspectW;
    let scaleY = height / aspectH;
    let scaleMax = Math.max(scaleX, scaleY);
    let w = Math.ceil(aspectW * scaleMax);
    let h = Math.ceil(aspectH * scaleMax);
    let x = 0;
    let y = 0;

    if (w > width) {
      x = -(w - width) * 0.5;
    }

    if (h > height) {
      y = -(h - height) * 0.5;
    }

    item.style.width = `${w}px`;
    item.style.height = `${h}px`;
    item.style.top = `${y}px`;
    item.style.left = `${x}px`;
  }

  update();

  return {
    update: update
  };
}

export default coverBox;
