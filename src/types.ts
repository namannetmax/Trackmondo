export type VehicleStatus = 'moving' | 'idle' | 'offline' | 'breach';
export type VehicleType = 'Truck' | 'Van' | 'Car' | 'Bike';
export type TripLabel = 'Business' | 'Private' | 'Unspecified';
export type AlertType = 'geofence_breach' | 'idle_warning' | 'zone_entry';

export interface Driver {
  id: string;
  name: string;
  initials: string;
  phone: string;
  status: VehicleStatus;
  assignedVehicleId?: string;
  avatar?: string;
}

export interface Vehicle {
  id: string;
  regNumber: string;
  type: VehicleType;
  plateNumber: string;
  status: VehicleStatus;
  speed?: number;
  driverId?: string;
  todayKm: number;
  tripsCount: number;
  ignition: boolean;
  address: string;
  lastUpdated: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  description: string;
  timeAgo: string;
  status: 'red' | 'amber' | 'green';
  driverName?: string;
  vehicleReg?: string;
}

export interface Trip {
  id: string;
  vehicleId: string;
  driverName: string;
  date: string;
  startTime: string;
  endTime: string;
  distance: number;
  duration: string;
  maxSpeed: number;
  startLocation: string;
  endLocation: string;
  label: TripLabel;
  labelledByDriver?: boolean;
}

export interface GeofenceZone {
  id: string;
  name: string;
  type: 'circle' | 'polygon';
  radius?: number;
  trigger: 'Exit' | 'Entry' | 'Both';
  status: 'breach' | 'clear';
  breachCount: number;
  assignedDriverIds: string[];
  color: string;
}
