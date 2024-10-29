import React from 'react';
import './cell.css'; // Corrected import to be a standard CSS file

function Cell({
                  value,
                  removeCell,
                  switchCell,
                  isSelected,
                  isYellowMarker,
                  isPointer,
                  isBlink,
                  isMarked,
                  isPivot,
                  isTransparent,
                  isDisabled,
                  onClick
                                }) {

    let buttonStatus
    if (isSelected){buttonStatus = 'cellValueSelected'}
    else if (isBlink){buttonStatus = 'cellValueBlink'}
    else if (isYellowMarker){buttonStatus = 'cellValueYellow'}
    else if (isMarked){buttonStatus = 'cellValueMarked'}
    else if (isPivot){buttonStatus = 'cellValuePivot'}
    else buttonStatus = 'cellValueDefault'

    return (
        <div className={`cell ${isTransparent ? 'increaseOpacity' : ''}`}>
            {isSelected && (
                <div className="cellOptions">
                    <button disabled={isDisabled} onClick={removeCell} id='removeButton' className="Remove">Remove</button>
                    <button disabled={isDisabled} onClick={switchCell} id='switchButton' className='Switch'>Switch</button>
                </div>
            )}
            {isPointer && <img className='pointer' src={require('./images/pointer.png')} alt=''/>}
            <button disabled={isDisabled} id='cellButton' className={buttonStatus} onClick={onClick}>
                {value}
            </button>
        </div>
    );
}

export default Cell;
