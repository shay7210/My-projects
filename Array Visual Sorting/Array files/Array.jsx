import React, { useState } from 'react';
import styles from './Array.css';
import Cell from "./cell.jsx";

function Array(props) {
    const [cells, setCells] = useState([]); //array cells
    const [isCellSelected, setIsCellSelected] = useState(null); // if the cell is selected in popup
    const [cellSwitchState, setCellSwitchState] = useState([]); // collects the indexes of the cells to switch
    const [isSwitchSelected, setIsSwitchSelected] = useState(null); // if the cell is about to switch
    const [isBlink, setIsBlink] = useState([]); // state for the blink of the two cells after the switch
    const [valueToAdd, setValueToAdd] = useState(''); // keeps track of the value to add
    const [isPointer, setPointer] = useState([]); // an option to put a pointer above the cell
    const [marker, setMarker] = useState([]);
    const [pivots, setPivots] = useState([]); //marks all the pivot for quicksort
    const [transparency, setTransparency] = useState([]); // for quicksort



    //buttons
    const addValueButton = document.getElementById('addValueButton');
    const cellButton = document.getElementsByClassName('cellButton');
    const shuffleButton =document.getElementById('shuffleButton');
    const bubbleSortButton = document.getElementById('bubbleSortButton');
    const clearAllButton = document.getElementById('clearAllButton');
    const insertionSortButton = document.getElementById('insertionSortButton');
    const addRandomValueButton = document.getElementById('addRandomValueButton');
    const quickSortButton = document.getElementById('quickSortButton');

    function disableButtons() {
        addValueButton.disabled = true;
        shuffleButton.disabled = true;
        bubbleSortButton.disabled = true;
        clearAllButton.disabled = true;
        cellButton.disabled = true;
        insertionSortButton.disabled = true;
        addRandomValueButton.disabled = true;
        quickSortButton.disabled = true;
    }

    function enableButtons() {
        addValueButton.disabled = false;
        shuffleButton.disabled = false;
        bubbleSortButton.disabled = false;
        clearAllButton.disabled = false;
        cellButton.disabled = false;
        insertionSortButton.disabled = false;
        addRandomValueButton.disabled = false;
        quickSortButton.disabled = false;
    }


    // used to add the blocking overlay
    const blockOverly = document.getElementById('Array')

    // Removal of a cell
    const removeCell = (index) => {
        const updatedArray = cells.filter((_, i) => i !== index);
        setCells(updatedArray);
        setIsCellSelected(null);
    };

    // Updates the selected cell states
    const handleCellSwitchState = (index) => {
        const temp = [...cellSwitchState];
        temp.push(index);
        setCellSwitchState(temp);
        if (temp.length === 2) {
            switchCells(temp[0], temp[1]);
            setCellSwitchState([]); // Clear the switch state after switching

            setIsSwitchSelected(null); // clears the yellow color
        }
        else {
            setIsSwitchSelected(index)   // paints the cell with yellow
        }
        setIsCellSelected(null);  // clears the popup menu
    };

    // Switches two indexes in a list
    const switchCells = (index1, index2) => {
        const temp = [...cells];
        const tempValue = temp[index1];
        temp[index1] = temp[index2];
        temp[index2] = tempValue;
        setCells(temp); // Update the cells state
        setIsBlink([index1,index2])
        setTimeout(() =>{  //puts the cells back to default
            setIsBlink([])
        },100)
    };


    // If the cell is selected, choose it; if pressed again, unchoose it
    const handleCellClick = (index) => {
        setIsCellSelected(isCellSelected === index ? null : index);
    };


    //add cell
    const addValue = () => {
        try {
            if (valueToAdd.trim() !== '' && cells.length < 17) {
                setCells((prevCells) => [...prevCells, valueToAdd]); // Use function to get the latest state
                setValueToAdd('')
            }
        }
        catch (error){
            console.log(error);
        }

    }

    //add random value
    function addRandomValue() {
        const valueToAdd = Math.floor(Math.random() * 100)
        if (cells.length < 17){
            setCells((prevCells) => [...prevCells, String(valueToAdd)]);
        }
    }

    const updateValueToAdd = (e) => {
        setValueToAdd(e.target.value);
    }
    // adds an option to use a pointer for each cell will be used for showing sorting algorithms
    const addPointer = (index) => {
        if (!isPointer.includes(index)) {
            setPointer((prev) => [...prev, index]);
        }

    }
    // clears all values
    const clearAll = () =>{
        setCells([])
        setIsCellSelected(null);
        setIsSwitchSelected(null)
    }

// Helper delay function
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    // bubble sort
    async function bubbleSort() {
        const updatedCells = cells.map(value => parseInt(value, 10));
        disableButtons()
        for (let i = 0; i < updatedCells.length - 1; i++) {
            for (let j = 0; j < updatedCells.length - 1 - i; j++) {
                setPointer([...[j, j + 1]]); // Show the pointer for animation

                if (updatedCells[j] > updatedCells[j + 1]) {
                    // Swap values in updatedCells
                    [updatedCells[j], updatedCells[j + 1]] = [updatedCells[j + 1], updatedCells[j]];
                    setCells([...updatedCells]); // Update the cell state after swap

                    // Apply blinking effect on swapped elements
                    setIsBlink([...[j, j + 1]]); // Add blink effect
                    await delay(300); // Short delay for the blinking effect
                    setIsBlink([...[]]); // Remove blink effect after delay
                }


                // Wait before moving to the next comparison
                await delay(600); // Delay between comparisons
            }
            setMarker(m => [...m, updatedCells.length - 1- i]);
        }

        // Clear the pointer after sorting completes
        setPointer([]);
        await delay(500);
        setMarker([])
        enableButtons()

    }
    //insertion sort
    async function insertionSort() {
        let updatedCells = cells.map(value => parseInt(value, 10));
        disableButtons();
        setMarker([...[0]]);
        let markerTest = [0]
        for (let i = 1; i < updatedCells.length; i++) {
            let curIndex = i;
            setPointer([...[curIndex]]);
            await delay(500);
            for (let j = i - 1; j >= 0; j--) {
                setPointer([...[j, curIndex]]);

                if (updatedCells[j] <= updatedCells[curIndex]) {
                    break;
                }

                [updatedCells[j], updatedCells[curIndex]] = [updatedCells[curIndex], updatedCells[j]];
                markerTest.push(curIndex);
                markerTest = markerTest.filter((index,_) => index !== j);
                // Consistently update markers
                setMarker([...markerTest])

                curIndex = j;
                setCells(updatedCells.map(value => String(value)));
            await delay(800);
            }
            await delay(500);
            markerTest.push(curIndex);
            setMarker([...markerTest]);
        }

        setPointer([]);
        setMarker([]);
        enableButtons();
    }
    //quicksort
    async function quickSort() {
        let updatedCells = cells.map(value => parseInt(value, 10));
        let pivotMarkers = [updatedCells.length-1];
        setPivots([...pivotMarkers])
        let sortedMarkerTest = [];
        let transparencyTest = [];
        disableButtons();

        //use stack instead of loops for consistent results
        const callStack = [];

        callStack.push([0, updatedCells.length - 1]);
        while (callStack.length > 0) {
            await delay(500)
            // take out the next call stack
            let curIndexes = callStack.pop();
            setPivots([curIndexes[1]])
            setPointer([curIndexes[0], curIndexes[1]]);
            if (curIndexes[0] === curIndexes[1]) {
                continue;
            }
            // update transparency list for items that are not used int the current partition
            for (let j = 0; j < curIndexes[0]; j++) {
                transparencyTest.push(j);
            }
            for (let j = curIndexes[1] + 1; j <= updatedCells.length - 1; j++) {
                transparencyTest.push(j);
            }

            // updates markers of sorted cells
            for (let j = 1; j < updatedCells.length - 1; j++) {
                if (sortedMarkerTest.includes(j-1) && sortedMarkerTest.includes(j + 1)) {
                    sortedMarkerTest.push(j);
                }
            }
            if (sortedMarkerTest.includes(1)){ sortedMarkerTest.push(0)}
            if (sortedMarkerTest.includes(updatedCells.length - 2)){sortedMarkerTest.push(updatedCells.length - 1)}

            setTransparency([...transparencyTest]);
            setMarker([...sortedMarkerTest]);
            await delay(500);
            let partitionResult = await partition(updatedCells, curIndexes[0], curIndexes[1], sortedMarkerTest, pivotMarkers);
            let nextPartitionIndex = partitionResult[0]; // the updated position of the pivot
            updatedCells = partitionResult[1];  // the updated array
            setCells(updatedCells.map(value => String(value)));
            //update callStack
            if (nextPartitionIndex !== curIndexes[0]) {
                callStack.push([curIndexes[0], nextPartitionIndex - 1])
            }
            if (nextPartitionIndex !== curIndexes[1]) {
                callStack.push([nextPartitionIndex + 1, curIndexes[1]])
            }

            transparencyTest = [] // reset transparency list
            setTransparency([...transparencyTest]);
            pivotMarkers = []
            setPivots([...pivotMarkers]);
        }

        // partition function
        async function partition(updatedCells, indexStart, indexPivot, markerTest, pivotMarkers) {
            let curIndexPivot = indexPivot;
            let pointerLeft, pointerRight;
            for (let i = indexStart; i <= indexPivot; i++) {
                await delay(500);
                pointerLeft = i;
                pointerRight = curIndexPivot;
                // if i is the pivot we went through all the updatedCells
                if (i === curIndexPivot) {
                    setPointer([])
                    break
                }
                if (updatedCells[i] > updatedCells[curIndexPivot]) {
                    let temp = updatedCells[i];
                    //changes the value in the updatedCells
                    updatedCells = updatedCells.filter(value => value !== updatedCells[i]);
                    updatedCells.splice(curIndexPivot,0,temp);
                    setIsBlink([...[curIndexPivot]])
                    setCells([...updatedCells])
                    curIndexPivot--;
                    i--;
                    setCells([...updatedCells])
                    //changes the value of pivot marker
                    pivotMarkers = pivotMarkers.filter(value => value !== curIndexPivot + 1);
                    pivotMarkers.push(curIndexPivot)
                    setPivots([...pivotMarkers]);
                    setPointer([...[pointerLeft, pointerRight-1]])
                }
                else{setPointer([pointerLeft, pointerRight])}
                await delay(500);
                setIsBlink([])
                //update cells
                setCells(updatedCells.map(value => String(value)))
                await delay(500)
            }
            markerTest.push(curIndexPivot);
            setMarker([...markerTest]);
            return [curIndexPivot, updatedCells];
        }
        // end of sorting
        setPivots([])
        sortedMarkerTest = [] // mark all as sorted before finishing the sorting
        for (let i = 0; i < updatedCells.length; i++) {
            sortedMarkerTest.push(i)
        }
        setMarker([...sortedMarkerTest]);
        await delay(500)
        setCells([...updatedCells.map(value => String(value))])
        setPointer([])
        setMarker([])
        enableButtons()
    }

    // fisher yates shuffle
   async function shuffleArray() {
        // Create a copy of the cells array to avoid mutating state directly
        const updatedCells = [...cells];
        disableButtons()
        for (let i = updatedCells.length - 1; i > 0; i--) {
            // Generate a random index from 0 to i
            let j = Math.floor(Math.random() * (i + 1));

            // Set the pointer to indicate the current swap
            setPointer([...[i, j]]);

            // Swap the elements at indices i and j
            [updatedCells[i], updatedCells[j]] = [updatedCells[j], updatedCells[i]];
            setIsBlink([i,j])

            // Update the state after the swap
            setCells([...updatedCells]);

            // Clear the pointer after the last swap
            if (i === 1) {
                await delay(500)
                setPointer([]); // Clear the pointer after the last swap
                setIsBlink([]);
            }
            await delay(750)
        } // Delay for each swap
       enableButtons()
    }

    return (
        <div className='Array'>
            <div className='addValue'>
                <button id='clearAllButton' onClick={clearAll}>Clear All</button>
                <button id='addValueButton' onClick={addValue}>Add Value</button>
                <input id="integer-input"
                       type="number"
                       value={valueToAdd}
                       placeholder="Only integers"
                       onChange={updateValueToAdd}/>
            </div>
            <div className='ArrayCells'>
            {cells.map((cell, index) => (
                <Cell
                    value={cell}
                    className ='cellButton'
                    key={index}
                    index={index}
                    onClick={() => handleCellClick(index)}
                    removeCell={() => removeCell(index)} // Correctly call removeCell with index
                    switchCell={() => handleCellSwitchState(index)} // Correctly call switchCell
                    isSelected={isCellSelected === index} // Pass selection state
                    isSwitchSelcted={isSwitchSelected === index}
                    isPointer={isPointer.includes(index)}
                    isBlink={isBlink.includes(index)}
                    isMarked = {marker.includes(index)}
                    isPivot = {pivots.includes(index)}
                    isTransparent={transparency.includes(index)}
                />
            ))}
                <button id='addRandomValueButton' className='addRandomValueButton' onClick={addRandomValue}>Add Random Value</button>
                </div>
            <div className='sortingAlgorithems'>
                <button id='shuffleButton' onClick={shuffleArray}>Fisher-Yates Shuffle</button>
                <button id='bubbleSortButton' onClick={bubbleSort}>Bubble Sort</button>
                <button id='insertionSortButton' onClick={insertionSort}>Insertion Sort</button>
                <button id='quickSortButton' onClick={quickSort}>Quick Sort</button>

            </div>

        </div>
);
}

export default Array;
