import jsonp from 'jsonp';
import querystring from 'querystring';
let timeout, currentValue;

export default {
  fetch(value, callback){
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    currentValue = value;
    timeout = setTimeout(()=> {
      jsonp('http://suggest.taobao.com/sug?' + querystring.encode({
          code: 'utf-8',
          q: value
        }), (err, d) => {
        if (currentValue === value) {
          var result = d.result;
          var data = [];
          result.forEach((r)=> {
            data.push({
              value: r[0],
              text: r[0]
            });
          });
          callback(data);
        }
      });
    }, 300);
  },
};
