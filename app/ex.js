let fs = require('fs');
let path = require('path');
let filesList = [];
let repeatFiles = [];
readFileList(__dirname, filesList);

readEveryFile();

// 复制图片文件到上一级copyImg文件夹
function readEveryFile() {
  // 判读是否存在copyImg文件夹
  let upPath = path.resolve(__dirname, '..', 'copyImg');
  if (fsExistsSync(upPath)) {
    delDir(upPath);
  }
  fs.mkdirSync(upPath, (err, folder) => {
    if (err) throw err;
  });
  // 复制文件
  for (let i = 0; i < filesList.length; i++) {
    let file_path = filesList[i];
    fs.readFile(file_path, function(err, data) {
      if (err) {
        console.log('读取失败', file_path);
      } else {
        let name = file_path.split('\\').splice(-1)[0];
          // 写文件之前先判断是否已存在同名文件
        let copyFilePath = path.resolve(upPath, name);
        let picName = getPicName(name);
        if (fsExistsSync(copyFilePath)) {
          let newName = name.replace(picName, picName + ' ' + i);
          copyFilePath = path.resolve(upPath, newName);
          repeatFiles.push({
            path: file_path.split('\\').join('/'),
            newName
          });
        }
        fs.writeFileSync(copyFilePath, data);
        if (i === filesList.length - 1) {
          console.log('重复数量：', repeatFiles.length, '重复文件参考repeatFiles.json');
          console.log('总计：', filesList.length);
          if (repeatFiles.length > 0) {
            let repeatFilePath = path.resolve(__dirname, '../copyImg/repeatFiles.json');
            fs.writeFile(repeatFilePath, JSON.stringify(repeatFiles), function (err) {
              if (err) throw err;
            });
          }
        }
      }
    });
  }
  return;
}

// 抽取所有图片文件的路径
function readFileList(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((item, index) => {
    let fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      readFileList(path.join(dir, item), filesList);  // 递归读取文件
    } else {
      /\.(svga|jpg|png|gif|svg|jepg)/.test(fullPath) && filesList.push(fullPath);
    }
  });
  // console.log(filesList)
  return filesList;
}

// 检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

// 取图片名

function getPicName(fileName) {
  let suffix = fileName.match(/[^\.]\w*$/)[0].toString();
  let name = (fileName.replace(suffix, '')).replace('.', '');
  return name;
}

// 删除文件
function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        delDir(curPath); // 递归删除文件夹
      } else {
        fs.unlinkSync(curPath); // 删除文件
      }
    });
    fs.rmdirSync(path);
  }
}
