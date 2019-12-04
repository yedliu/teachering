const getImageDataUrl = (obj) => {
  // console.log(obj);
  const { imgUrlArr = [], canvas = {}, startIndex = 0, stopIndex = 0, type = 'jpeg', ratio = 0.8 } = obj; // eslint-disable-line
  let imgsLength = 0;
  const splitList = [];
  return new Promise((res, rej) => {
    const imgArr = [];
    const canvasWidth = canvas.width;
    const ctx = canvas.getContext('2d');
    const drawImage = (imgSrcArray, num) => {
      if (imgSrcArray.length <= num) {
        // console.dir(canvas);
        // const dataURL = canvas.toDataURL(`image/${type}`, ratio);
        // const parent = canvas.parentNode;
        // parent.removeChild(canvas);
        // res({ dataURL, count: imgsLength });
        canvas.toBlob((blob) => {
          const dataURL = URL.createObjectURL(blob);
          res({ dataURL, count: imgsLength, blob, splitList });
        });
        return;
      }
      const imgUrl = imgSrcArray[num];
      // console.log(imgUrl);

      if (imgUrl.startsWith('http')) {
        const img = new Image();
        // 设置图片跨域, 一定不要再 onload 函数中设置(在创建了 image 对象后就立刻加上)，被坑了一下午。 且所用的图片必须在服务器设置了允许跨域 (即该域名下资源允许跨域访问)。
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
          // console.dir(img);
          // 设置图片的绘制宽度与高度
          if (img.width > canvasWidth) {
            // console.log(img.width, img.height, 'img-width and img-height');
            const scale = canvasWidth / img.width;
            img.drawWidth = canvasWidth;
            img.drawHeight = img.height * scale;
            // console.log(img.drawWidth, img.drawHeight, 'img.drawWidth and img.drawHeight');
          } else {
            img.drawWidth = img.width;
            img.drawHeight = img.height;
          }
          // 将设置好的图片添加到数组
          imgArr.push(img);
          // 遍历数组，为每张图片设置起始绘制 y 坐标，以及 canvas 应该的高度.
          // console.log(imgArr, 'imgArr');
          let canvasHeight = 0;
          imgArr.forEach((item) => {
            item.heightStart = canvasHeight;
            canvasHeight += item.drawHeight;
          });
          // 设置 canvas 高度.
          canvas.height = canvasHeight;
          // 遍历绘制
          ctx.clearRect(0, 0, canvas.width, canvasHeight);

          imgArr.forEach((item, i) => {
            // console.log(item.drawHeight, 'aaa');
            const shouldLeft = (canvasWidth - item.drawWidth) / 2;
            const x = shouldLeft > 0 ? shouldLeft : 0;
            const y = item.heightStart;
            ctx.drawImage(item, x, y, item.drawWidth, item.drawHeight);
            splitList[i] = y + item.drawHeight;
          });
          drawImage(imgSrcArray, num + 1);
        };
        img.onerror = () => {
          // const alternativeArr = imgSrcArray;
          // alternativeArr[num] = errImg;
          console.warn(`第${startIndex + num}张图加载失败，您可以重新尝试`);
          drawImage(imgSrcArray, num + 1);
        };
        img.src = imgUrl;
      } else {
        return;
      }
    };
    let newImgUrlArr = [];
    if (stopIndex > imgUrlArr.length) {
      console.warn('想要加载的图片数量超出了现有图片数量');
      newImgUrlArr = imgUrlArr.splice(startIndex, imgUrlArr.length);
      imgsLength = imgUrlArr.length - startIndex;
    } else {
      newImgUrlArr = imgUrlArr.splice(startIndex, stopIndex);
      imgsLength = stopIndex - startIndex;
    }
    // console.log(newImgUrlArr);
    drawImage(newImgUrlArr, 0);
  });
};

export const loadImage = (imagesObj, callback) => {
  getImageDataUrl(imagesObj).then((data) => callback(data));
};
