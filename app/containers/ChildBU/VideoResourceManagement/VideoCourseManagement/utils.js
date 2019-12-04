export const find = (array, id) => {
  let stack = [];
  let going = true;

  let walker = (array, id) => {
    for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (!going) break;
      stack.push(item);
      if (item['id'] === id) {
        if (item['children']) stack = [];
        going = false;
      } else if (item['children']) {
        walker(item['children'], id);
      } else {
        stack.pop();
      }
    }
    if (going) stack.pop();
  };

  walker(array, id);
  return stack;
};
