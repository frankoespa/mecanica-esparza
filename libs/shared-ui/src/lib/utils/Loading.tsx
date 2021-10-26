import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export function Loading() {
	return (
		<Backdrop sx={{ zIndex: (t) => t.zIndex.drawer + 1, backgroundColor: (t) => t.palette.background.paper }} open={true}>
			<CircularProgress color='primary' />
		</Backdrop>
	);
}
