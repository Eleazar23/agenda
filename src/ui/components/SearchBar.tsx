import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export default function SearchBar() {
    const [searchValue, setSearchValue] = React.useState("")

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log({ searchValue })
        setSearchValue(e.target.value)
    }

    const handleOnClick = () => {
        console.log(searchValue)
    }

    const handleCancelBtn = () => {
        setSearchValue("")
    }

    const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter") {
            e.preventDefault(); // Prevents form submission on Enter key
            console.log('Enter key pressed in TextField, submission prevented.');
        }
        console.log(searchValue)

    }


    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Nombre, Numero, Servicio..."
                inputProps={{ 'aria-label': 'search google maps' }}
                onChange={handleOnChange}
                value={searchValue}
                onKeyDown={handleSubmit}
            />
            {searchValue != "" ? <><IconButton type="button" sx={{ p: '10px' }} onClick={handleCancelBtn}>
                <CancelOutlinedIcon />
            </IconButton> <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /></> : null}
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleOnClick}>
                <SearchIcon />
            </IconButton>

        </Paper>
    );
}
