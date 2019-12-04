/**
 * 清除plupload产生的多余dom
 * @param wrapper 当前父元素
 */
export const deleteMoxie = (wrapper) => {
  let upEle = wrapper.querySelectorAll('.moxie-shim');
  if (upEle && upEle.length > 0) {
    for (let i = 0; i < upEle.length; i++) {
      try {
        let upEleParent = upEle[i].parentElement;
        upEleParent.removeChild(upEle[i]);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
