import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

type Props = {
    label: string;
    icon: React.ReactNode;
}

const IconText = ({ label, icon }: Props) => {
    return (
        <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Typography variant="body1">{label}</Typography>
        </Box>
    );
}

export default IconText;