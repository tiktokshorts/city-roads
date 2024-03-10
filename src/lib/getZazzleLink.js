import request from './request.js';
import Progress from './Progress.js';

let imageUrl = 'https://edi6jgnosf.execute-api.us-west-2.amazonaws.com/Stage/put_image'

const productKinds = {
  mug: '256046323938455788'
};

function getZazzleLink(kind, imageUrl) {
  const productCode = productKinds[kind];
  if (!productCode) {
    throw new Error('Unknown product kind: ' + kind);
  }

  const imageEncoded = encodeURIComponent(imageUrl);
  //return `https://www.zazzle.com/api/create/at-238740289122746090?rf=238740289122746090&ax=Linkover&pd=${productCode}&ed=true&tc=&ic=&t_map_iid=${imageEncoded}`;
  return 'https://www.zazzle.com/api/create?rf=238740289122746090&pd=${productCode}&ed=true&ax=Linkover&t_imagen1_iid=${imageEncoded}&at=238740289122746090';
}

export default function generateZazzleLink(canvas) {
  var imageContent = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
  const form = new FormData();
  form.append('image', imageContent);

  return request(imageUrl, {
    method: 'POST',
    responseType: 'json',
    progress: new Progress(Function.prototype),
    body: form,
  }, 'POST').then(x => {
    if (!x.success) throw new Error('Failed to upload image');
    let link = x.data.link; 
    return getZazzleLink('mug', link);
  }).catch(e => {
    console.log('error', e);
    throw e;
  });
}
