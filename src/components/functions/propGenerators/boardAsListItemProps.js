const boardProps = (selectedBoards, x) => {
    let bProps = { isSelected: false };

    if (selectedBoards.some(e => e.id === x.id)) {
        bProps.isSelected = true;
    }
    return bProps;
}

export default boardProps;