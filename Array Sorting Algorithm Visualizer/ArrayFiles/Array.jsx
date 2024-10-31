import React, { useState } from 'react';
import styles from './Array.css';
import Cell from "./cell.jsx";

function Array(props) {
    const [cells, setCells] = useState([]); //array cells
    const [isCellSelected, setIsCellSelected] = useState(null); // if the cell is selected in popup
    const [valueToAdd, setValueToAdd] = useState(''); // keeps track of the value to add
    const [isPointer, setPointer] = useState([]); // an option to put a pointer above the cell
    const [isCellDisabled, setIsCellDisabled] = useState(false); //disable all cell buttons
    //color markers
    const [cellPurpleMarker, setCellPurpleMarker] = useState([]);
    const [cellGreenMarker, setCellGreenMarker] = useState([]); //marks all the pivot for quicksort
    const [cellGreyMarker, setCellGreyMarker] = useState([]);
    const [cellRedMarker, setCellRedMarker] = useState(null); // if the cell is about to switch
    const [cellBlinkRedMarker, setCellBlinkRedMarker] = useState([]); // state for the blink of the two cells after the switch
    const [cellTransparentMarker, setCellTransparentMarker] = useState([]);

    //merge use states
    const [mergeArray, setMergeArray] = useState([]);
    const [isMerge, setIsMerge] = useState(false);
    const [isBlinkMerge, setIsBlinkMerge] = useState([]);

    //buttons
    const addValueButton = document.getElementById('addValueButton');
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
        setIsCellDisabled(true)
        insertionSortButton.disabled = true;
        addRandomValueButton.disabled = true;
        quickSortButton.disabled = true;
    }

    function enableButtons() {
        addValueButton.disabled = false;
        shuffleButton.disabled = false;
        bubbleSortButton.disabled = false;
        clearAllButton.disabled = false;
        setIsCellDisabled(false)
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
        const temp = [...cellPurpleMarker];
        temp.push(index);
        setCellPurpleMarker(temp);
        if (temp.length === 2) {
            switchCells(temp[0], temp[1]);
            setCellPurpleMarker([]); // Clear the switch state after switching

            setCellRedMarker(null); // clears the yellow color
        }
        else {
            setCellRedMarker(index)   // paints the cell with yellow
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
        setCellBlinkRedMarker([index1,index2])
        setTimeout(() =>{  //puts the cells back to default
            setCellBlinkRedMarker([])
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
        setCellRedMarker(null)
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
                    setCellBlinkRedMarker([...[j, j + 1]]); // Add blink effect
                    await delay(300); // Short delay for the blinking effect
                    setCellBlinkRedMarker([...[]]); // Remove blink effect after delay
                }


                // Wait before moving to the next comparison
                await delay(600); // Delay between comparisons
            }
            setCellGreyMarker(m => [...m, updatedCells.length - 1- i]);
        }

        // Clear the pointer after sorting completes
        setPointer([]);
        await delay(500);
        setCellGreyMarker([])
        enableButtons()

    }
    //insertion sort
    async function insertionSort() {
        // create copy of cells
        let updatedCells = cells.map(value => parseInt(value, 10));
        disableButtons();
        //set the first cellGreyMarker
        setCellGreyMarker([...[0]]);
        let markerTest = [0]
        for (let i = 1; i < updatedCells.length; i++) {
            // track the current index
            let curIndex = i;
            setPointer([...[curIndex]]);
            await delay(500);
            for (let j = i - 1; j >= 0; j--) {
                setPointer([...[j, curIndex - 2]]);
                if (updatedCells[j] <= updatedCells[curIndex]) {
                    break;
                }
                [updatedCells[j], updatedCells[curIndex]] = [updatedCells[curIndex], updatedCells[j]];
                markerTest.push(curIndex);
                markerTest = markerTest.filter((index,_) => index !== j);
                // Consistently update markers
                setCellGreyMarker([...markerTest])

                curIndex = j;
                setCells(updatedCells.map(value => String(value)));
            await delay(800);
            }
            await delay(500);
            markerTest.push(curIndex);
            setCellGreyMarker([...markerTest]);
        }
        //reset pointer and markers
        setPointer([]);
        setCellGreyMarker([]);
        enableButtons();
    }
    //quick sort
    async function quickSort() {
        // create a copy of cells cast string to int
        let updatedCells = cells.map(value => parseInt(value, 10));
        // mark the first pivot
        let pivotMarkers = [updatedCells.length-1];
        setCellGreenMarker([...pivotMarkers])
        // create empty arrays for transparent and sorted cells
        let sortedMarkerTest = [];
        let transparencyTest = [];
        //disable other buttons
        disableButtons();

        //use stack instead of loops for consistent results
        const callStack = [];
        //push the first stack call (all the array)
        callStack.push([0, updatedCells.length - 1]);
        while (callStack.length > 0) {
            await delay(500)
            // take out the next call stack
            let curIndexes = callStack.pop();
            //update the pivot and pointers
            setCellGreenMarker([curIndexes[1]])
            setPointer([curIndexes[0], curIndexes[1]]);
            //if both sides are equal this call stack is over
            if (curIndexes[0] === curIndexes[1]) {
                continue;
            }
            // update cellTransparentMarker list for items that are not used int the current partition
            for (let j = 0; j < curIndexes[0]; j++) {
                transparencyTest.push(j);
            }
            for (let j = curIndexes[1] + 1; j <= updatedCells.length - 1; j++) {
                transparencyTest.push(j);
            }
            setCellTransparentMarker([...transparencyTest]);
            // updates markers of sorted cells
            for (let j = 1; j < updatedCells.length - 1; j++) {
                if (sortedMarkerTest.includes(j-1) && sortedMarkerTest.includes(j + 1)) {
                    sortedMarkerTest.push(j);
                }
            }
            if (sortedMarkerTest.includes(1)){ sortedMarkerTest.push(0)}
            if (sortedMarkerTest.includes(updatedCells.length - 2)){sortedMarkerTest.push(updatedCells.length - 1)}
            setCellGreyMarker([...sortedMarkerTest]);

            await delay(500);
            //preform partition, extract the pivot correct location and the updated array
            let partitionResult = await partition(updatedCells, curIndexes[0], curIndexes[1], sortedMarkerTest, pivotMarkers);
            let nextPartitionIndex = partitionResult[0]; // the correct position of the pivot
            updatedCells = partitionResult[1];  // the updated array
            //update the array on the screen
            setCells(updatedCells.map(value => String(value)));
            //update callStack
            if (nextPartitionIndex !== curIndexes[0]) {
                callStack.push([curIndexes[0], nextPartitionIndex - 1])
            }
            if (nextPartitionIndex !== curIndexes[1]) {
                callStack.push([nextPartitionIndex + 1, curIndexes[1]])
            }
            // reset cellTransparentMarker list
            transparencyTest = []
            setCellTransparentMarker([...transparencyTest]);
            //reset pivot cellGreyMarker
            pivotMarkers = []
            setCellGreenMarker([...pivotMarkers]);
        }

        // end of sorting
        //reset cellGreenMarker
        setCellGreenMarker([])
        // mark all as sorted before finishing the function
        sortedMarkerTest = []
        for (let i = 0; i < updatedCells.length; i++) {
            sortedMarkerTest.push(i)
        }
        setCellGreyMarker([...sortedMarkerTest]);
        // reset pointers and sorted markers after a delay
        await delay(500)
        setPointer([])
        setCellGreyMarker([])
        enableButtons()

        // partition function
        async function partition(updatedCells, indexStart, indexPivot, markerTest, pivotMarkers) {
            //track the location of the pivot using this variable
            let curIndexPivot = indexPivot;
            //track pointers location during the partition
            let pointerLeft, pointerRight;
            for (let i = indexStart; i <= indexPivot; i++) {
                pointerLeft = i;
                pointerRight = curIndexPivot;
                // if i is the pivot we went through all the updatedCells
                if (i === curIndexPivot) {
                    setPointer([])
                    break
                }
                await delay(500)
                // case when a number on the left is bigger than the pivot so a switch is needed
                if (updatedCells[i] > updatedCells[curIndexPivot]) {
                    let temp = updatedCells[i];
                    // removes the value in the correct index
                    updatedCells.splice(i, 1);
                    // insert the value at the correct location
                    updatedCells.splice(curIndexPivot,0,temp);
                    //set a blink to indicate that the value was changed
                    setCellBlinkRedMarker([...[curIndexPivot]])
                    //update the view on screen
                    setCells([...updatedCells])
                    // update i and the current pivot location to the correct locations
                    curIndexPivot--;
                    i--;
                    //changes the value of pivot cellGreyMarker
                    pivotMarkers = pivotMarkers.filter(value => value !== curIndexPivot + 1);
                    pivotMarkers.push(curIndexPivot)
                    setCellGreenMarker([...pivotMarkers]);
                    // update pointers location in the case of a switch
                    setPointer([...[pointerLeft, pointerRight-1]])
                }
                //update the pointers location in case no switch happened
                else{setPointer([pointerLeft, pointerRight])}
                //reset the blink after a delay
                await delay(500)
                setCellBlinkRedMarker([])

            }
            //update cellGreyMarker for sorted items to the final position of the pivot
            markerTest.push(curIndexPivot);
            setCellGreyMarker([...markerTest]);
            // return the correct location of the pivot and the updated array
            return [curIndexPivot, updatedCells];
        }
    }
    //merge sort
    async function mergeSort() {
        const updatedCells = [...cells.map(value => parseInt(value, 10))];
        const  testCells = [0,1,2,3,4,5,6,7,8,9]
        const callStack = [[0, updatedCells.length - 1]];
        const helperStack = [];
        // Iterative split and merge loop
        while (callStack.length > 0) {
            const [start, end] = callStack.pop();
            const mid = Math.floor((start + end) / 2);

            // Visualization markers for debbuging
            let showPivots = [...range(start, mid, false)]
            let showTransparent = [...range(end + 1, updatedCells.length - 1, false), ...range(0, start - 1, false)]
            let showYellow = [...range(mid + 1, end, false)];
            // setters
            setCellTransparentMarker([...range(end + 1, updatedCells.length - 1), ...range(0, start - 1)]);
            setCellGreenMarker([...range(start, mid, false)]);
            setCellPurpleMarker([...range(mid + 1, end,false)]);
            await delay(1000)

            // Splitting in half case where blocks are bigger than 3
            if (start < end - 2) {
                callStack.push([mid + 1, end]);
                callStack.push([start, mid]);
            } else { // two cases one that the block size is two and the other equals to three
                let resultMerge
                //gets the full array values with the start and end indexes
                const lastSubArray = [retriveArrayContentFromIndexes(updatedCells, range(start, end)), [start,end]]
                //block equal to 2
                if (lastSubArray[0].length === 2) {
                    // do merge with two one sized blocks update cells and colors
                    resultMerge = await merge([lastSubArray[0][0]], [lastSubArray[0][1]], [start], [end]);
                    updatedCells.splice(start,2,...resultMerge)
                    setCells([...updatedCells])
                    setCellGreenMarker([])
                    setCellPurpleMarker([])
                    setCellBlinkRedMarker(range(start,start + 1))
                    await delay(1000)
                    setCellBlinkRedMarker([])
                    // block equal to 3
                } else if (lastSubArray[0].length === 3) {
                    // do merge with two one sized blocks update cells and colors
                    resultMerge = await merge([lastSubArray[0][0]], [lastSubArray[0][1]], [start], [mid]);
                    updatedCells.splice(start,2,...resultMerge)
                    setCells([...updatedCells])
                    //visual affects
                    setCellGreenMarker([])
                    setCellPurpleMarker([])
                    setCellBlinkRedMarker(range(start,start + 1))
                    await delay(1000)
                    setCellBlinkRedMarker([])
                    // merge a second time with two sized block and a one sized block, update cells and colors
                    resultMerge = await merge(resultMerge, [lastSubArray[0][2]], [start, mid], [end]);
                    updatedCells.splice(start,3,...resultMerge)
                    setCells([...updatedCells])
                    setCellBlinkRedMarker(range(start,start + 2))
                    await delay(1000)
                    setCellBlinkRedMarker([])
                }
                helperStack.push([resultMerge, [start,end]]);
            }

            // Merging phase when helperStack has elements ready for merge
            if (helperStack.length > 1) {
                // Further merging between `helperStack` arrays
                for (let l = helperStack.length - 2; l >= 0; l--) {
                    // take out the two last blocks from helperStack
                    const current = helperStack[l];
                    const next = helperStack[l + 1];
                    // update the screen with these blocks
                    updatedCells.splice(current[1][0], current[0].length,...current[0]);
                    updatedCells.splice(next[1][0], next[0].length,...next[0]);
                    setCells([...updatedCells])
                    // Check if current and next arrays have the same length or differ by 1 element
                    if (current[0].length === next[0].length || current[0].length === next[0].length + 1) {
                        const merged = await merge(current[0], next[0],range(current[1][0],current[1][1], false), range(next[1][0],next[1][1], false));  // No need for range indexes, just merging values
                        updatedCells.splice(current[1], merged.length, ...merged);  // Insert merged array in place
                        setCells([...updatedCells])
                        //visual effects
                        setCellGreenMarker([])
                        setCellPurpleMarker([])
                        setCellBlinkRedMarker(range(current[1][0],next[1][1]))
                        await delay(1000)
                        setCellBlinkRedMarker([])
                        // Update helperStack with the merged result
                        helperStack[l] = [merged, [current[1][0],next[1][1]]];

                        // Remove the now-merged next element from helperStack
                        helperStack.splice(l + 1, 1);
                    }
                }
            }
            // Clear visualization after each iteration
            setCellPurpleMarker([]);
            setCellGreenMarker([]);
            await delay(1000);  // Delay for visualization
        }

        setCellTransparentMarker([]);
        enableButtons();

    async function merge(array1, array2, array1IndexesList, array2IndexesList) {
            setIsMerge(true);

            //set colors
            //test arrays for debugging
            let testPivot = [...array1IndexesList]
            let testYellow = [...array2IndexesList]
            let testTranceparcy = [...range(0,array1IndexesList[0],false),
            ...range(array2IndexesList[array2IndexesList.length-1] + 1,updatedCells.length - 1 )];
            // setting colors
            setCellGreenMarker([...array1IndexesList]);
            setCellPurpleMarker([...array2IndexesList]);
            setCellTransparentMarker([...range(0,array1IndexesList[0] - 1,false),
                                    ...range(array2IndexesList[array2IndexesList.length - 1] + 1,
                                        updatedCells.length - 1 ,false)]);
            await delay(1000)
            // used for the merge array
            let arrayResult = [];
            // indexes for both arrays
            let array1Index = 0;
            let array2Index = 0;
            let pointerleft = array1IndexesList[0];
            let pointerright = array2IndexesList[0];

            for (let i = 0; i < array1.length + array2.length; i++) {
                setPointer([...[pointerleft,pointerright]])
                await delay(500)
                //case that one array is over
                if (array2Index > array2.length - 1) {
                    for (let j = array1Index; j < array1.length; j++) {
                        //set pointer
                        if (pointerleft < array1IndexesList[array1IndexesList.length-1]){pointerleft++}
                        else {setPointer(p => [...p].filter(p => p === pointerleft))}
                        // push next element and display it
                        arrayResult.push(array1[j]);
                        setMergeArray([...arrayResult.map(value => String(value))])
                        //set blink and pointer
                        setIsBlinkMerge([arrayResult.length - 1])
                        setPointer( [pointerleft])
                        await delay(1000)
                        setIsBlinkMerge([])
                    }
                    break;
                }

                else if (array1Index > array1.length - 1) {
                        for (let j = array2Index; j < array2.length; j++) {
                            // update pointer
                            if (pointerright < array2IndexesList[array2IndexesList.length-1]){pointerright++}
                            else {setPointer(p => [...p].filter(p => p === pointerright))}
                            // update array and display it
                            arrayResult.push(array2[j]);
                            setMergeArray([...arrayResult.map(value => String(value))])
                            //set blink and pointer
                            setIsBlinkMerge([arrayResult.length - 1])
                            setPointer([pointerright])
                            await delay(1000)
                            setIsBlinkMerge([])
                        }
                        break;
                }
                // item in the first array is bigger than the second, else case is the other oppsite case
                if (array1[array1Index] < array2[array2Index]) {
                    if (pointerleft < array1IndexesList[array1IndexesList.length-1]){pointerleft++}
                    else {setPointer(p => [...p].filter(p => p === pointerleft))}
                    arrayResult.push(array1[array1Index]);
                    array1Index++;
                }
                else {
                    if (pointerright < array2IndexesList[array2IndexesList.length-1]){pointerright++}
                    else {setPointer(p => [...p].filter(p => p === pointerright))}
                    arrayResult.push(array2[array2Index]);
                    array2Index++;
                }
                // set pointers and update the merge array
                setPointer([pointerleft,pointerright])
                setMergeArray([...arrayResult.map(value => String(value))])
                setIsBlinkMerge([...[arrayResult.length - 1]])
                await delay(1000)
                setIsBlinkMerge([])
            }

            await delay(1000)
            setPointer([])
            return arrayResult;

        }
        // finish merge sort with turning of the pointer and the merge array        setMergeArray([])
        setPointer([])
        setIsMerge(false)
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
            setCellBlinkRedMarker([i,j])

            // Update the state after the swap
            setCells([...updatedCells]);

            // Clear the pointer after the last swap
            if (i === 1) {
                await delay(500)
                setPointer([]); // Clear the pointer after the last swap
                setCellBlinkRedMarker([]);
            }
            await delay(750)
        } // Delay for each swap
       enableButtons()
    }


    function range(start, end, includeOneLength = true) {
        const array = []
        if (start >= end && includeOneLength){return []}
        for (let i = start; i <= end; i++) {
            array.push(i);
        }
        return array;
    }
    function retriveArrayContentFromIndexes(array, indexList){
        let newArray = [];
        for (let i = indexList[0]; i <= indexList[indexList.length-1]; i++) {
            newArray.push(array[i]);
        }
        return newArray;
    } // returns a subarray given the indexes;


    return (
        <div className='Array'>
            <h1>Array Sorting Algorithm Visualizer</h1>
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
                    isYellowMarker={cellPurpleMarker.includes(index)}
                    isPointer={isPointer.includes(index)}
                    isBlink={cellBlinkRedMarker.includes(index)}
                    isMarked = {cellGreyMarker.includes(index)}
                    isPivot = {cellGreenMarker.includes(index)}
                    isTransparent={cellTransparentMarker.includes(index)}
                    isDisabled = {isCellDisabled}
                />
            ))}
                <button id='addRandomValueButton' className='addRandomValueButton' onClick={addRandomValue}>Add Random Value</button>
                </div>
            <div className='ArrayCells'>
                {isMerge && mergeArray.map((cell, index) => (
                    <Cell
                        key={index}
                        value={cell}
                        isBlink={isBlinkMerge.includes(index)}
                        isDisabled={isCellDisabled}
                    >
                    </Cell>
                ))

                }
            </div>

            <div className='sortingAlgorithems'>
                <button id='shuffleButton' onClick={shuffleArray}>Fisher-Yates Shuffle</button>
                <button id='bubbleSortButton' onClick={bubbleSort}>Bubble Sort</button>
                <button id='insertionSortButton' onClick={insertionSort}>Insertion Sort</button>
                <button id='quickSortButton' onClick={quickSort}>Quick Sort</button>
                <button id='mergeSortButton' onClick={mergeSort}>Merge Sort</button>

            </div>

        </div>
);
}

export default Array;
