import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";

interface Props {
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  value?: string;
}

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[50],
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
  marginLeft: 0,
  width: "fit-content",
  [theme.breakpoints.up("sm")]: {
    // marginLeft: theme.spacing(1),
    width: "fit-content",
    '& .MuiInputBase-input': {
      width: '12ch',
    },
    '&:focus-within .MuiInputBase-input': {
      width: '35ch',
    },
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  // position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ClearIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: "100%",
  // position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
  },
}));

function SearchInput({ placeholder, onChange, onClear, value }: Props) {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={placeholder || "Buscar…"}
        inputProps={{ "aria-label": "search" }}
        onChange={onChange}
        value={value}
      />
      <ClearIconWrapper>
        { value && (
          <IconButton aria-label="delete" size="small" onClick={onClear} onMouseDown={(e) => e.preventDefault()}>
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </ClearIconWrapper>
    </Search>
  );
}

export default SearchInput;
