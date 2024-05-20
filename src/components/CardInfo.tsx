import React from 'react';

function CardInfo({value, name='', className = ''}) {
    return (
        <div className="flex justify-center items-center flex-col">
          <h2 className="items-center">{value}</h2>
          <h3 className={`${className} items-center`}>{name}</h3>
        </div>
    );
}

export default CardInfo;