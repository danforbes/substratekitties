import React from 'react';

const IMAGES = {
  accessories: [
    require('./img/accessory_1.png'),
    require('./img/accessory_2.png'),
    require('./img/accessory_3.png'),
    require('./img/accessory_4.png'),
    require('./img/accessory_5.png'),
    require('./img/accessory_6.png'),
    require('./img/accessory_7.png'),
    require('./img/accessory_8.png'),
    require('./img/accessory_9.png'),
    require('./img/accessory_10.png'),
    require('./img/accessory_11.png'),
    require('./img/accessory_12.png'),
    require('./img/accessory_13.png'),
    require('./img/accessory_14.png'),
    require('./img/accessory_15.png'),
    require('./img/accessory_16.png'),
    require('./img/accessory_17.png'),
    require('./img/accessory_18.png'),
    require('./img/accessory_19.png'),
    require('./img/accessory_20.png')
  ],
  bodies: [
    require('./img/body_1.png'),
    require('./img/body_2.png'),
    require('./img/body_3.png'),
    require('./img/body_4.png'),
    require('./img/body_5.png'),
    require('./img/body_6.png'),
    require('./img/body_7.png'),
    require('./img/body_8.png'),
    require('./img/body_9.png'),
    require('./img/body_10.png'),
    require('./img/body_11.png'),
    require('./img/body_12.png'),
    require('./img/body_13.png'),
    require('./img/body_14.png'),
    require('./img/body_15.png')
  ],
  eyes: [
    require('./img/eyes_1.png'),
    require('./img/eyes_2.png'),
    require('./img/eyes_3.png'),
    require('./img/eyes_4.png'),
    require('./img/eyes_5.png'),
    require('./img/eyes_6.png'),
    require('./img/eyes_7.png'),
    require('./img/eyes_8.png'),
    require('./img/eyes_9.png'),
    require('./img/eyes_10.png'),
    require('./img/eyes_11.png'),
    require('./img/eyes_12.png'),
    require('./img/eyes_13.png'),
    require('./img/eyes_14.png'),
    require('./img/eyes_15.png')
  ],
  mouths: [
    require('./img/mouth_1.png'),
    require('./img/mouth_2.png'),
    require('./img/mouth_3.png'),
    require('./img/mouth_4.png'),
    require('./img/mouth_5.png'),
    require('./img/mouth_6.png'),
    require('./img/mouth_7.png'),
    require('./img/mouth_8.png'),
    require('./img/mouth_9.png'),
    require('./img/mouth_10.png')
  ],
  patterns: [
    require('./img/fur_1.png'),
    require('./img/fur_2.png'),
    require('./img/fur_3.png'),
    require('./img/fur_4.png'),
    require('./img/fur_5.png'),
    require('./img/fur_6.png'),
    require('./img/fur_7.png'),
    require('./img/fur_8.png'),
    require('./img/fur_9.png'),
    require('./img/fur_10.png')
  ],
  snack: [
    require('./img/snack_1.png'),
    require('./img/snack_2.png')
  ]
};

function dnaToAttributes (dna) {
  const attribute = (index, options) => {
    return parseInt(dna[index], 16) % options;
  };

  const bonus = dna[5] === '8';
  return {
    body: IMAGES.bodies[attribute(0, 15)],
    eyes: IMAGES.eyes[attribute(1, 15)],
    accessory: IMAGES.accessories[attribute(2, 20)],
    pattern: IMAGES.patterns[attribute(3, 10)],
    mouth: IMAGES.mouths[attribute(4, 10)],
    snack: bonus ? IMAGES.snack[attribute(6, 2)] : null
  };
}

export function KittyAvatar (props) {
  const outerStyle = { height: '150px', position: 'relative', width: '50%' };
  const innerStyle = { height: '150px', position: 'absolute', top: '0%', left: '50%' };

  const cat = dnaToAttributes(props.dna.substr(2));
  return <div style={outerStyle}>
    <img alt='body' src={cat.body} style={innerStyle} />
    <img alt='pattern' src={cat.pattern} style={innerStyle} />
    <img alt='mouth' src={cat.mouth} style={innerStyle} />
    <img alt='eyes' src={cat.eyes} style={innerStyle} />
    <img alt='accessory' src={cat.accessory} style={innerStyle} />
    <img alt={cat.snack === null ? null : 'snack'} src={cat.snack} style={innerStyle} />
  </div>;
}
