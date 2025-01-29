import { useEffect, useState } from 'react';
import { api, Car, CarStats } from '../services/api';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    LinearProgress,
    useTheme,
    Chip,
    Alert,
    Box
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { alpha } from '@mui/material/styles';

export default function RegistrationStatus() {
    const [cars, setCars] = useState<Car[]>([]);
    const [stats, setStats] = useState<CarStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getCars();
                setCars(data.cars);
                setStats(data.stats);
                setError(null);
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 4 }}>
                {error}
            </Alert>
        );
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 3 }}>
                Vehicle Registry Monitor
                <Chip 
                    label="Auto-refresh" 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 2 }}
                />
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card 
                        sx={{ 
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            transition: '0.3s',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: theme.shadows[8]
                            }
                        }}
                    >
                        <CardContent>
                            <DirectionsCarIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4">{stats?.totalCars || 0}</Typography>
                            <Typography>Total Vehicles</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card 
                        sx={{ 
                            bgcolor: theme.palette.success.main,
                            color: 'white',
                            transition: '0.3s',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: theme.shadows[8]
                            }
                        }}
                    >
                        <CardContent>
                            <CheckCircleOutlineIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4">{stats?.validCount || 0}</Typography>
                            <Typography>Valid Registrations</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card 
                        sx={{ 
                            bgcolor: theme.palette.warning.main,
                            color: 'white',
                            transition: '0.3s',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: theme.shadows[8]
                            }
                        }}
                    >
                        <CardContent>
                            <WarningAmberIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4">{stats?.expiringCount || 0}</Typography>
                            <Typography>Expiring Soon</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card 
                        sx={{ 
                            bgcolor: theme.palette.error.main,
                            color: 'white',
                            transition: '0.3s',
                            '&:hover': {
                                transform: 'scale(1.02)',
                                boxShadow: theme.shadows[8]
                            }
                        }}
                    >
                        <CardContent>
                            <ErrorOutlineIcon sx={{ fontSize: 40, mb: 1 }} />
                            <Typography variant="h4">{stats?.expiredCount || 0}</Typography>
                            <Typography>Expired Registrations</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                {cars.map(car => (
                    <Grid item xs={12} sm={6} md={4} key={car.id}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                transition: '0.3s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: theme.shadows[4]
                                }
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    {car.make} {car.model}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    {car.location}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={Math.max(0, Math.min(100, (car.daysUntilExpiry + 30) / 1.2))} 
                                        sx={{ 
                                            height: 8, 
                                            borderRadius: 4,
                                            bgcolor: alpha(car.statusColor, 0.2),
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: car.statusColor
                                            }
                                        }}
                                    />
                                </Box>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography 
                                        sx={{ color: car.statusColor }}
                                    >
                                        {car.expiryCountdown}
                                    </Typography>
                                    <Chip 
                                        label={car.status}
                                        size="small"
                                        sx={{ 
                                            bgcolor: car.statusColor,
                                            color: 'white',
                                            fontWeight: 500
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
} 