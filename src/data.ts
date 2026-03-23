import { Vehicle, Driver, Alert, Trip, GeofenceZone } from './types';

export const MOCK_DRIVERS: Driver[] = [
  { id: 'd1', name: 'Alex Johnson', initials: 'AJ', phone: '+1 234 567 890', status: 'moving', assignedVehicleId: 'v1' },
  { id: 'd2', name: 'Sarah Smith', initials: 'SS', phone: '+1 234 567 891', status: 'idle', assignedVehicleId: 'v2' },
  { id: 'd3', name: 'Mike Ross', initials: 'MR', phone: '+1 234 567 892', status: 'breach', assignedVehicleId: 'v3' },
  { id: 'd4', name: 'Emma Wilson', initials: 'EW', phone: '+1 234 567 893', status: 'offline', assignedVehicleId: 'v4' },
  { id: 'd5', name: 'James Bond', initials: 'JB', phone: '+1 234 567 894', status: 'idle' },
];

export const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', regNumber: 'TRK-001', type: 'Truck', plateNumber: 'ABC-1234', status: 'moving', speed: 62, driverId: 'd1', todayKm: 145, tripsCount: 4, ignition: true, address: '123 Main St, Springfield', lastUpdated: '10 sec ago' },
  { id: 'v2', regNumber: 'VAN-042', type: 'Van', plateNumber: 'XYZ-5678', status: 'idle', speed: 0, driverId: 'd2', todayKm: 82, tripsCount: 2, ignition: true, address: '456 Oak Ave, Metropolis', lastUpdated: '2 min ago' },
  { id: 'v3', regNumber: 'CAR-999', type: 'Car', plateNumber: 'LMN-9012', status: 'breach', speed: 45, driverId: 'd3', todayKm: 210, tripsCount: 6, ignition: true, address: '789 Pine Rd, Gotham', lastUpdated: '5 sec ago' },
  { id: 'v4', regNumber: 'TRK-102', type: 'Truck', plateNumber: 'QWE-3456', status: 'offline', speed: 0, driverId: 'd4', todayKm: 0, tripsCount: 0, ignition: false, address: 'Depot A, Central City', lastUpdated: '1 hour ago' },
  { id: 'v5', regNumber: 'VAN-015', type: 'Van', plateNumber: 'RTY-7890', status: 'idle', speed: 0, todayKm: 12, tripsCount: 1, ignition: false, address: 'Parking Lot B, Star City', lastUpdated: '15 min ago' },
];

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', type: 'geofence_breach', description: 'Geofence breach — Zone A', timeAgo: '5 min ago', status: 'red', driverName: 'Mike Ross', vehicleReg: 'CAR-999' },
  { id: 'a2', type: 'idle_warning', description: 'Idle warning — Vehicle VAN-042', timeAgo: '12 min ago', status: 'amber', driverName: 'Sarah Smith', vehicleReg: 'VAN-042' },
  { id: 'a3', type: 'zone_entry', description: 'Zone entry — Warehouse 1', timeAgo: '25 min ago', status: 'green', driverName: 'Alex Johnson', vehicleReg: 'TRK-001' },
];

export const MOCK_TRIPS: Trip[] = [
  { id: 't1', vehicleId: 'v1', driverName: 'Alex Johnson', date: '23 Mar 2026', startTime: '08:15', endTime: '09:30', distance: 45.2, duration: '1h 15m', maxSpeed: 85, startLocation: 'Main Depot', endLocation: 'Client Site A', label: 'Business' },
  { id: 't2', vehicleId: 'v1', driverName: 'Alex Johnson', date: '23 Mar 2026', startTime: '10:00', endTime: '10:45', distance: 12.8, duration: '45m', maxSpeed: 65, startLocation: 'Client Site A', endLocation: 'Lunch Stop', label: 'Private' },
  { id: 't3', vehicleId: 'v2', driverName: 'Sarah Smith', date: '23 Mar 2026', startTime: '07:30', endTime: '08:45', distance: 32.5, duration: '1h 15m', maxSpeed: 70, startLocation: 'Home', endLocation: 'Office', label: 'Unspecified' },
  { id: 't4', vehicleId: 'v3', driverName: 'Mike Ross', date: '23 Mar 2026', startTime: '09:00', endTime: '11:00', distance: 120.0, duration: '2h 0m', maxSpeed: 110, startLocation: 'Depot B', endLocation: 'Restricted Zone', label: 'Business', labelledByDriver: true },
];

export const MOCK_ZONES: GeofenceZone[] = [
  { id: 'z1', name: 'Zone A', type: 'circle', radius: 500, trigger: 'Both', status: 'breach', breachCount: 1, assignedDriverIds: ['d1', 'd2', 'd3'], color: '#EF4444' },
  { id: 'z2', name: 'Warehouse 1', type: 'polygon', trigger: 'Entry', status: 'clear', breachCount: 0, assignedDriverIds: ['d1', 'd4'], color: '#10B981' },
  { id: 'z3', name: 'Downtown Area', type: 'polygon', trigger: 'Exit', status: 'clear', breachCount: 0, assignedDriverIds: ['d1', 'd2', 'd3', 'd4', 'd5'], color: '#3B82F6' },
];
