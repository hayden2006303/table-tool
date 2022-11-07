import { Message } from 'element-ui';
import success from '../../public/images/success.png';
import error from '../../public/images/error.png';
import info from '../../public/images/info.png';
import warning from '../../public/images/warning.png';

let messageInstance = null;
const message = (options) => {
  if (messageInstance) {
    messageInstance.close();
  }
  messageInstance = Message(options);
};
['error', 'info', 'success', 'warning'].forEach((type) => {
  message[type] = (options) => {
    let temp = options; // 将参数赋值给temp，否则在eslint规则中，直接修改函数的入参会报错
    if (typeof options === 'string') {
      temp = {
        dangerouslyUseHTMLString: true, // 将meassge当作 HTML 片段处理
      };
      if (type === 'success') {
        temp.message = `<img src="${success}" style="top:15px;left:18px;position:absolute"/>${options}`;
      }
      if (type === 'error') {
        temp.message = `<img src="${error}" style="top:15px;left:18px;position:absolute"/>${options}`;
      }
      if (type === 'info') {
        temp.message = `<img src="${info}" style="top:15px;left:18px;position:absolute"/>${options}`;
      }
      if (type === 'warning') {
        temp.message = `<img src="${warning}" style="top:15px;left:18px;position:absolute"/>${options}`;
      }
    }
    temp.type = type;
    return message(temp);
  };
});
export default message;
