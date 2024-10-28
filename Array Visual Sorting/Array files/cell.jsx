import React from 'react';
import './cell.css'; // Corrected import to be a standard CSS file

function Cell({value, removeCell, switchCell, isSelected, isSwitchSelected, isPointer,isBlink,isMarked, isPivot,isTransparent, onClick }) {

    let buttonStatus
    if (isSelected){buttonStatus = 'cellValueSelected'}
    else if (isSwitchSelected){buttonStatus = 'cellValueSwitch'}
    else if (isBlink){buttonStatus = 'cellValueBlink'}
    else if (isMarked){buttonStatus = 'cellValueMarked'}
    else if (isPivot){buttonStatus = 'cellValuePivot'}
    else buttonStatus = 'cellValueDefault'

    return (
        <div className={`cell ${isTransparent ? 'increaseOpacity' : ''}`}>
            {isSelected && (
                <div className="cellOptions">
                    <button onClick={removeCell} className="Remove">Remove</button>
                    <button onClick={switchCell} className='Switch'>Switch</button>
                </div>
            )}
            {isPointer && <img className='pointer' src={require('./images/pointer.png')} alt=''/>}
            <button className={buttonStatus} onClick={onClick}>
                {value}
            </button>
        </div>
    );
}

export default Cell;
