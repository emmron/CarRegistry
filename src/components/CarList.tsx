import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Box,
  Card,
  Grid,
  TextField,
  useTheme,
  CircularProgress,
  alpha,
  Chip
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { api, Car, CarStats } from '../services/api';

function CarList() {
  const [cars, setCars] = useState<Car[]>([]);
  const [stats, setStats] = useState<CarStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterMake, setFilterMake] = useState('');

  const theme = useTheme();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const data = await api.getCars(filterMake || undefined);
        setCars(data.cars);
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [filterMake]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              p: 2, 
              bgcolor: theme.palette.primary.main, 
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <DirectionsCarIcon />
              <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '-0.5px' }}>
                Total Vehicles
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ mt: 2, fontWeight: 700 }}>{stats?.totalCars || 0}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              p: 2, 
              bgcolor: theme.palette.secondary.main, 
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CategoryIcon />
              <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '-0.5px' }}>
                Unique Makes
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ mt: 2, fontWeight: 700 }}>{stats?.uniqueMakes || 0}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              p: 2, 
              bgcolor: theme.palette.info.main, 
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <CategoryIcon />
              <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '-0.5px' }}>
                Average Year
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ mt: 2, fontWeight: 700 }}>{stats?.averageYear || 0}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card 
            sx={{ 
              p: 2, 
              bgcolor: theme.palette.success.main, 
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <AttachMoneyIcon />
              <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: '-0.5px' }}>
                Total Value
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ mt: 2, fontWeight: 700 }}>
              ${(stats?.totalValue || 0).toLocaleString()}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Filter by Make"
          value={filterMake}
          onChange={(e) => setFilterMake(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: 'background.paper',
              '&:hover': {
                '& > fieldset': {
                  borderColor: theme.palette.primary.main,
                }
              }
            }
          }}
        />
      </Box>

      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          overflow: 'hidden',
          bgcolor: 'background.paper'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
              <TableCell>
                <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  Make & Model
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  Location
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  Price
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                  Registration
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cars.map((car) => (
              <TableRow 
                key={car.id}
                sx={{ 
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                    transition: 'background-color 0.2s'
                  }
                }}
              >
                <TableCell>
                  <Box>
                    <Typography sx={{ fontWeight: 500 }}>{car.make} {car.model}</Typography>
                    <Typography variant="body2" color="text.secondary">{car.year}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography>{car.location}</Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography>${car.price.toLocaleString()}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current: ${car.currentValue.toLocaleString()}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    <Chip 
                      label={car.status}
                      size="small"
                      sx={{ 
                        bgcolor: car.statusColor,
                        color: 'white',
                        fontWeight: 500,
                        mb: 0.5
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {car.expiryCountdown}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CarList; 