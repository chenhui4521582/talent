import { getToken } from '@/utils/cookies';
let watermark: any = {};

let setWatermark = (str, option: any = {}) => {
  let userName = getToken('ods_user_userName');
  let employeeId = getToken('ods_user_employeeId');
  let id = '123.123.123';
  if (document.getElementById(id)) {
    document.body.removeChild(document.getElementById(id) as any);
  }

  //创建一个画布
  let can: any = document.createElement('canvas');
  //设置画布的长宽
  can.width = option.w || 300;
  can.height = option.h || 240;

  let cans = can.getContext('2d');
  //旋转角度
  cans.rotate((-30 * Math.PI) / 180);
  cans.font = '14px Vedana';
  //设置填充绘画的颜色、渐变或者模式
  cans.fillStyle = '#CCCCCC';
  //设置文本内容的当前对齐方式
  cans.textAlign = 'left';
  //设置在绘制文本时使用的当前文本基线
  cans.textBaseline = 'Middle';
  //在画布上绘制填色的文本（输出的文本，开始绘制文本的X坐标位置，开始绘制文本的Y坐标位置）
  cans.fillText(userName + ' ' + employeeId, can.width / 8, can.height / 2);
  let div = document.createElement('div');
  div.id = id;
  div.style.pointerEvents = 'none';
  div.style.top = option.top || '100px';
  div.style.left = option.left || '200px';
  div.style.position = 'fixed';
  div.style.zIndex = '100000';
  div.style.width = option.width || document.documentElement.clientWidth + 'px';
  div.style.height =
    option.height || document.documentElement.clientHeight + 'px';
  div.style.background =
    'url(' + can.toDataURL('image/png') + ') left top repeat';
  document.body.appendChild(div);
  return id;
};

// 该方法只允许调用一次
watermark.set = str => {
  let id = setWatermark(str);
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str);
    }
  }, 500);
  window.onresize = () => {
    setWatermark(str);
  };
};

watermark.remove = () => {
  var El: any = document.getElementById('123.123.123');
  if (El) {
    El.style.width = '0px';
    El.style.height = '0px';
  }
};

// watermark.set('水印文本', { l: 300, h: 150, top: '10px', left: '0px', width: '100%', height: '100%' })

export default watermark;
