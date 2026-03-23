import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Map as MapIcon, 
  Users, 
  MoreHorizontal,
  Bell,
  Search,
  Plus,
  ChevronRight,
  ArrowLeft,
  Navigation,
  Phone,
  History,
  Filter,
  Circle,
  Square,
  Undo2,
  Check,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Vehicle, 
  Driver, 
  Alert, 
  Trip, 
  GeofenceZone, 
  VehicleStatus,
  TripLabel
} from './types';
import { 
  MOCK_VEHICLES, 
  MOCK_DRIVERS, 
  MOCK_ALERTS, 
  MOCK_TRIPS, 
  MOCK_ZONES 
} from './data';

// --- Components ---

const TabButton = ({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${active ? 'text-trackmondo' : 'text-neutral-400'}`}
  >
    <Icon size={24} />
    <span className="text-[10px] mt-1 font-medium">{label}</span>
  </button>
);

const StatusCell = ({ label, count, color, onClick }: { label: string, count: number, color: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center justify-center flex-1 p-3 bg-white border-r border-neutral-100 last:border-r-0 cursor-pointer active:bg-neutral-50"
  >
    <span className={`text-xl font-bold ${color}`}>{count}</span>
    <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">{label}</span>
  </div>
);

const VehicleCard = ({ vehicle, driver, onSelect, onAssign }: { vehicle: Vehicle, driver?: Driver, onSelect: () => void, onAssign: () => void, key?: string }) => {
  const statusColors = {
    moving: 'bg-green-500',
    idle: 'bg-amber-500',
    breach: 'bg-red-500',
    offline: 'bg-neutral-400'
  };

  return (
    <div 
      onClick={onSelect}
      className={`bg-white rounded-xl overflow-hidden border-2 mb-4 transition-all active:scale-[0.98] ${vehicle.status === 'breach' ? 'border-red-500' : 'border-transparent'}`}
    >
      {/* Layer 1 */}
      <div className="p-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${statusColors[vehicle.status]}`}>
          <Truck size={20} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-neutral-900">{vehicle.regNumber}</div>
          <div className="text-xs text-neutral-500">{vehicle.type} • {vehicle.plateNumber}</div>
        </div>
        <div className="text-right">
          <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full inline-block ${vehicle.status === 'moving' ? 'bg-green-100 text-green-700' : vehicle.status === 'breach' ? 'bg-red-100 text-red-700' : 'bg-neutral-100 text-neutral-600'}`}>
            {vehicle.status}
          </div>
          {vehicle.speed !== undefined && vehicle.speed > 0 && (
            <div className="text-xs font-bold text-neutral-900 mt-1">{vehicle.speed} km/h</div>
          )}
        </div>
      </div>

      {/* Layer 2 */}
      <div className="bg-neutral-50 px-4 py-3 flex items-center justify-between border-y border-neutral-100">
        <div className="flex items-center gap-2">
          {driver ? (
            <>
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
                {driver.initials}
              </div>
              <span className="text-sm font-medium text-neutral-700">{driver.name}</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-neutral-300" />
              <span className="text-sm italic text-neutral-400 font-medium">No driver assigned</span>
            </>
          )}
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); driver ? null : onAssign(); }}
          className="text-xs font-bold text-trackmondo flex items-center gap-1"
        >
          {driver ? 'View →' : 'Assign →'}
        </button>
      </div>

      {/* Layer 3 */}
      <div className="px-4 py-2 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
        <span>Today's {vehicle.todayKm} km</span>
        <span>{vehicle.tripsCount} trips</span>
        <span className={vehicle.ignition ? 'text-green-600' : 'text-red-600'}>
          Ignition {vehicle.ignition ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'fleet' | 'geofence' | 'drivers' | 'more'>('home');
  const [currentScreen, setCurrentScreen] = useState<string>('main');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [fleetFilter, setFleetFilter] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation helpers
  const goToScreen = (screen: string) => setCurrentScreen(screen);
  const goBack = () => setCurrentScreen('main');

  const selectedVehicle = MOCK_VEHICLES.find(v => v.id === selectedVehicleId);
  const selectedDriver = MOCK_DRIVERS.find(d => d.id === selectedVehicle?.driverId);
  const selectedAlert = MOCK_ALERTS.find(a => a.id === selectedAlertId);

  // --- Screens ---

  const DashboardScreen = () => (
    <div className="pb-20">
      {/* Top Bar */}
      <div className="p-4 flex items-center justify-between bg-white border-b border-neutral-100">
        <div>
          <h1 className="text-xl font-bold text-trackmondo">Trackmondo</h1>
          <p className="text-xs text-neutral-500 font-medium">Monday, 23 March 2026</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell size={24} className="text-neutral-700" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </div>
          <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
            JD
          </div>
        </div>
      </div>

      {/* Fleet Status Strip */}
      <div className="flex border-b border-neutral-100">
        <StatusCell label="Moving" count={MOCK_VEHICLES.filter(v => v.status === 'moving').length} color="text-green-500" onClick={() => { setActiveTab('fleet'); setFleetFilter('all'); }} />
        <StatusCell label="Idle" count={MOCK_VEHICLES.filter(v => v.status === 'idle').length} color="text-amber-500" />
        <StatusCell label="Offline" count={MOCK_VEHICLES.filter(v => v.status === 'offline').length} color="text-neutral-400" />
        <StatusCell label="Breach" count={MOCK_VEHICLES.filter(v => v.status === 'breach').length} color="text-red-500" />
      </div>

      {/* Live Map Section */}
      <div className="relative h-[35vh] bg-neutral-200 overflow-hidden">
        {/* Placeholder for map */}
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/600')] bg-cover opacity-50 grayscale" />
        
        {/* Vehicle Pins */}
        {MOCK_VEHICLES.map((v, i) => (
          <div 
            key={v.id}
            onClick={() => { setSelectedVehicleId(v.id); goToScreen('can'); }}
            className="absolute cursor-pointer transition-transform active:scale-125"
            style={{ top: `${20 + i * 15}%`, left: `${15 + i * 20}%` }}
          >
            <div className={`w-4 h-4 rounded-full border-2 border-white ${
              v.status === 'moving' ? 'bg-green-500' : 
              v.status === 'idle' ? 'bg-amber-500' : 
              v.status === 'breach' ? 'bg-red-500' : 'bg-neutral-400'
            } ${v.status === 'breach' ? 'animate-pulse ring-4 ring-red-500/30' : ''}`} />
          </div>
        ))}

        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-neutral-700">
          Live • {MOCK_VEHICLES.length} vehicles
        </div>
      </div>

      {/* Today Quick Stats */}
      <div className="flex gap-4 p-4">
        <div className="flex-1 bg-white p-4 rounded-xl border border-neutral-100">
          <div className="text-xs text-neutral-500 font-medium mb-1">Trips today</div>
          <div className="text-2xl font-bold text-neutral-900">24</div>
        </div>
        <div className="flex-1 bg-white p-4 rounded-xl border border-neutral-100">
          <div className="text-xs text-neutral-500 font-medium mb-1">Distance today</div>
          <div className="text-2xl font-bold text-neutral-900">482 <span className="text-sm font-medium text-neutral-400">km</span></div>
        </div>
      </div>

      {/* Fleet Performance Analytics (New Section from Image) */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Fleet Performance</h2>
          <button className="text-xs font-bold text-trackmondo">Reports</button>
        </div>

        {/* Date Filters */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {['Today', 'This week', 'This month', 'Custom'].map((p) => (
            <button
              key={p}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                p === 'This month' ? 'bg-trackmondo text-white' : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Date Range Display */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 bg-neutral-100 p-2.5 rounded-lg text-xs font-bold text-neutral-600 text-center">01 Mar 2026</div>
          <div className="text-neutral-400">→</div>
          <div className="flex-1 bg-neutral-100 p-2.5 rounded-lg text-xs font-bold text-neutral-600 text-center">23 Mar 2026</div>
        </div>

        {/* Analytics Cards */}
        <div className="space-y-4">
          {/* Trips by Type */}
          <div className="bg-white p-4 rounded-xl border border-neutral-100">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Trips by type</div>
            <div className="flex items-end gap-6 mb-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-neutral-900">32</span>
                  <span className="text-xs font-medium text-neutral-400">biz</span>
                </div>
                <div className="text-[10px] font-medium text-neutral-500">Business trips</div>
              </div>
              <div className="border-l border-neutral-100 h-8" />
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-amber-600">14</span>
                  <span className="text-xs font-medium text-neutral-400">priv</span>
                </div>
                <div className="text-[10px] font-medium text-neutral-500">Private trips</div>
              </div>
              <div className="border-l border-neutral-100 h-8" />
              <div>
                <div className="text-xl font-bold text-neutral-400">8</div>
                <div className="text-[10px] font-medium text-neutral-500">Unspecified</div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-neutral-100 rounded-full flex overflow-hidden mb-2">
              <div className="h-full bg-blue-500" style={{ width: '59%' }} />
              <div className="h-full bg-amber-500" style={{ width: '26%' }} />
              <div className="h-full bg-neutral-400" style={{ width: '15%' }} />
            </div>
            <div className="flex justify-between text-[9px] font-bold uppercase">
              <div className="flex items-center gap-1 text-blue-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Business 59%
              </div>
              <div className="flex items-center gap-1 text-amber-600">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Private 26%
              </div>
              <div className="flex items-center gap-1 text-neutral-400">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" /> Unspe. 15%
              </div>
            </div>
          </div>

          {/* Distance & Drive Time */}
          <div className="bg-white p-4 rounded-xl border border-neutral-100 flex gap-4">
            <div className="flex-1">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Distance & Drive Time</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-neutral-900">297</span>
                <span className="text-sm font-medium text-neutral-400">km</span>
              </div>
              <div className="text-[10px] font-medium text-neutral-500">Total distance</div>
            </div>
            <div className="border-l border-neutral-100" />
            <div className="flex-1 pt-6">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-neutral-900">5h</span>
                <span className="text-sm font-medium text-neutral-400">36m</span>
              </div>
              <div className="text-[10px] font-medium text-neutral-500">Total drive time</div>
            </div>
          </div>

          {/* Fuel & Emissions */}
          <div className="bg-white p-4 rounded-xl border border-neutral-100 flex gap-4">
            <div className="flex-1">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Fuel & Emissions</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-neutral-900">17.9</span>
                <span className="text-sm font-medium text-neutral-400">L</span>
              </div>
              <div className="text-[10px] font-medium text-neutral-500">Fuel consumed</div>
            </div>
            <div className="border-l border-neutral-100" />
            <div className="flex-1 pt-6">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-neutral-900">45.2</span>
                <span className="text-sm font-medium text-neutral-400">kg</span>
              </div>
              <div className="text-[10px] font-medium text-neutral-500">CO₂ emitted</div>
            </div>
          </div>

          {/* Mileage by Type */}
          <div className="bg-white p-4 rounded-xl border border-neutral-100">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Mileage by type</div>
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-neutral-900">198</span>
                  <span className="text-sm font-medium text-neutral-400">km</span>
                </div>
                <div className="text-[10px] font-medium text-neutral-500">Business km</div>
              </div>
              <div className="border-l border-neutral-100" />
              <div className="flex-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-neutral-900">99</span>
                  <span className="text-sm font-medium text-neutral-400">km</span>
                </div>
                <div className="text-[10px] font-medium text-neutral-500">Private km</div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-neutral-100 rounded-full flex overflow-hidden mb-2">
              <div className="h-full bg-blue-500" style={{ width: '67%' }} />
              <div className="h-full bg-amber-500" style={{ width: '33%' }} />
            </div>
            <div className="flex justify-between text-[9px] font-bold uppercase">
              <div className="flex items-center gap-1 text-blue-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Business 67%
              </div>
              <div className="flex items-center gap-1 text-amber-600">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Private 33%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unlabelled Trips Nudge */}
      <div 
        onClick={() => goToScreen('driving_log')}
        className="mx-4 mb-4 bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center justify-between cursor-pointer active:bg-amber-100"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-amber-900">3 trips unlabelled</div>
            <div className="text-xs text-amber-700">Tap to review and assign labels</div>
          </div>
        </div>
        <ChevronRight size={20} className="text-amber-400" />
      </div>

      {/* Active Alerts Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Active alerts</h2>
          <button className="text-xs font-bold text-trackmondo">See all</button>
        </div>
        <div className="space-y-2">
          {MOCK_ALERTS.map(alert => (
            <div 
              key={alert.id}
              onClick={() => { setSelectedAlertId(alert.id); goToScreen('alert_detail'); }}
              className="bg-white p-3 rounded-xl border border-neutral-100 flex items-center gap-3 active:bg-neutral-50"
            >
              <div className={`w-2 h-2 rounded-full ${
                alert.status === 'red' ? 'bg-red-500' : 
                alert.status === 'amber' ? 'bg-amber-500' : 'bg-green-500'
              }`} />
              <div className="flex-1 text-sm font-medium text-neutral-700">{alert.description}</div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase">{alert.timeAgo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FleetScreen = () => {
    const filteredVehicles = MOCK_VEHICLES.filter(v => {
      const matchesSearch = v.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase());
      if (fleetFilter === 'assigned') return matchesSearch && v.driverId;
      if (fleetFilter === 'unassigned') return matchesSearch && !v.driverId;
      return matchesSearch;
    });

    const assigned = filteredVehicles.filter(v => v.driverId);
    const unassigned = filteredVehicles.filter(v => !v.driverId);

    return (
      <div className="pb-20">
        <div className="p-4 bg-white border-b border-neutral-100 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-neutral-900">Fleet</h1>
            <button className="bg-trackmondo text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 active:scale-95">
              <Plus size={18} />
              Add vehicle
            </button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text"
              placeholder="Search vehicles or drivers..."
              className="w-full bg-neutral-100 border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-trackmondo outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex bg-neutral-100 p-1 rounded-lg">
            {(['all', 'assigned', 'unassigned'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFleetFilter(f)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${fleetFilter === f ? 'bg-white text-trackmondo shadow-sm' : 'text-neutral-500'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({
                  f === 'all' ? MOCK_VEHICLES.length : 
                  f === 'assigned' ? MOCK_VEHICLES.filter(v => v.driverId).length : 
                  MOCK_VEHICLES.filter(v => !v.driverId).length
                })
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          {assigned.length > 0 && (
            <>
              <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">With driver</h2>
              {assigned.map(v => (
                <VehicleCard 
                  key={v.id} 
                  vehicle={v} 
                  driver={MOCK_DRIVERS.find(d => d.id === v.driverId)}
                  onSelect={() => { setSelectedVehicleId(v.id); goToScreen('can'); }}
                  onAssign={() => {}}
                />
              ))}
            </>
          )}

          {unassigned.length > 0 && (
            <>
              <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-6 mb-3">No driver assigned</h2>
              {unassigned.map(v => (
                <VehicleCard 
                  key={v.id} 
                  vehicle={v} 
                  onSelect={() => { setSelectedVehicleId(v.id); goToScreen('can'); }}
                  onAssign={() => {}}
                />
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  const CanScreen = () => {
    if (!selectedVehicle) return null;
    const driver = MOCK_DRIVERS.find(d => d.id === selectedVehicle.driverId);

    return (
      <div className="bg-neutral-50 min-h-screen pb-20">
        <div className="bg-white p-4 flex items-center justify-between border-b border-neutral-100">
          <button onClick={goBack} className="flex items-center gap-1 text-sm font-bold text-neutral-600">
            <ArrowLeft size={20} />
            Fleet
          </button>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-neutral-900">{selectedVehicle.regNumber}</span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">• Live</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>

        <div className="relative h-[40vh] bg-neutral-200">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/vehicle-map/800/600')] bg-cover" />
          
          {/* Vehicle Pin & Trail */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-8 h-8 bg-trackmondo rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg">
                <Navigation size={16} className="rotate-45" />
              </div>
              {/* Pulsing ring if breach */}
              {selectedVehicle.status === 'breach' && (
                <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-75" />
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
              <div className="text-4xl font-bold text-neutral-900">{selectedVehicle.speed || 0}</div>
              <div className="text-[10px] font-bold text-neutral-400 uppercase">km/h</div>
            </div>
            <div className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm border ${selectedVehicle.ignition ? 'bg-green-500 text-white border-green-600' : 'bg-red-500 text-white border-red-600'}`}>
              Ignition {selectedVehicle.ignition ? 'ON' : 'OFF'}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-b border-neutral-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <MapPin size={20} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-neutral-900">{selectedVehicle.address}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Updated {selectedVehicle.lastUpdated}</div>
          </div>
        </div>

        <div className="p-4 grid grid-cols-2 gap-4">
          {[
            { label: 'Speed', value: `${selectedVehicle.speed || 0} km/h`, sub: 'Max 82 today' },
            { label: 'Ignition', value: selectedVehicle.ignition ? 'On' : 'Off', sub: 'Since 08:42' },
            { label: 'Heading', value: 'North East', sub: '42°' },
            { label: 'Last stop', value: 'Springfield', sub: '12 min ago' },
            { label: 'Distance', value: `${selectedVehicle.todayKm} km`, sub: 'This trip' },
            { label: 'Engine hours', value: '4.2h', sub: 'Today' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-neutral-100">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">{item.label}</div>
              <div className="text-lg font-bold text-neutral-900">{item.value}</div>
              <div className="text-[10px] font-medium text-neutral-500">{item.sub}</div>
            </div>
          ))}
        </div>

        <div className="p-4 flex gap-3">
          <button onClick={() => goToScreen('rutter')} className="flex-1 bg-neutral-100 text-neutral-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-neutral-200">
            <History size={18} />
            Rutter
          </button>
          <button className="flex-1 bg-neutral-100 text-neutral-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:bg-neutral-200">
            <Navigation size={18} />
            Track live
          </button>
          <button className="flex-1 bg-trackmondo text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95">
            <Phone size={18} />
            Call
          </button>
        </div>
      </div>
    );
  };

  const RutterScreen = () => {
    const [labelFilter, setLabelFilter] = useState<string>('All');
    const trips = MOCK_TRIPS.filter(t => t.vehicleId === selectedVehicleId && (labelFilter === 'All' || t.label === labelFilter));

    return (
      <div className="bg-neutral-50 min-h-screen pb-20">
        <div className="bg-white p-4 flex items-center justify-between border-b border-neutral-100">
          <button onClick={() => goToScreen('can')} className="flex items-center gap-1 text-sm font-bold text-neutral-600">
            <ArrowLeft size={20} />
            Vehicle
          </button>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-neutral-900">{selectedVehicle?.regNumber}</span>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">• History</span>
          </div>
          <div className="w-5" />
        </div>

        <div className="bg-white p-4 border-b border-neutral-100">
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
            {['All', 'Business', 'Private', 'Unspecified'].map(label => (
              <button
                key={label}
                onClick={() => setLabelFilter(label)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  labelFilter === label 
                    ? 'bg-trackmondo text-white' 
                    : label === 'Unspecified' 
                      ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                      : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-neutral-100 p-2 rounded-lg text-xs font-bold text-neutral-600">23 Mar 2026</div>
            <div className="text-neutral-400">→</div>
            <div className="flex-1 bg-neutral-100 p-2 rounded-lg text-xs font-bold text-neutral-600">23 Mar 2026</div>
            <button className="bg-trackmondo text-white px-4 py-2 rounded-lg text-xs font-bold">Apply</button>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['Today', 'Yesterday', 'Last 7 days', 'Custom'].map(p => (
              <button key={p} className="text-[10px] font-bold text-neutral-400 uppercase px-2 py-1">{p}</button>
            ))}
          </div>
        </div>

        <div className="relative h-[25vh] bg-neutral-200">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/history-map/800/600')] bg-cover opacity-60" />
          <div className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 rounded-md text-[10px] font-bold text-neutral-700">
            {trips.length} trips
          </div>
        </div>

        <div className="flex border-b border-neutral-100 bg-white">
          <StatusCell label="Total km" count={145} color="text-neutral-900" />
          <StatusCell label="Trips" count={trips.length} color="text-neutral-900" />
          <StatusCell label="Drive time" count={4} color="text-neutral-900" />
          <StatusCell label="Max speed" count={85} color="text-neutral-900" />
        </div>

        <div className="p-4 space-y-4">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl border border-neutral-100 overflow-hidden active:scale-[0.98] transition-all">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">{trip.date} • {trip.startTime}</div>
                  <div className="text-sm font-bold text-neutral-900">{trip.distance} km</div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center py-1">
                    <div className="w-2 h-2 rounded-full bg-neutral-300" />
                    <div className="w-0.5 flex-1 border-l-2 border-dashed border-neutral-200 my-1" />
                    <div className={`w-2 h-2 rounded-full ${
                      trip.label === 'Business' ? 'bg-blue-500' : 
                      trip.label === 'Private' ? 'bg-amber-500' : 'bg-neutral-400'
                    }`} />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="text-sm font-medium text-neutral-700">{trip.startLocation}</div>
                    <div className="text-sm font-medium text-neutral-700">{trip.endLocation}</div>
                  </div>
                  <div className="flex flex-col justify-end">
                    <div className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      trip.label === 'Business' ? 'bg-blue-100 text-blue-700' : 
                      trip.label === 'Private' ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {trip.label}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-50 flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase">
                  <span>{trip.duration}</span>
                  <span>Max {trip.maxSpeed} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DrivingLogScreen = () => {
    const [labelFilter, setLabelFilter] = useState<string>('All');
    const trips = MOCK_TRIPS.filter(t => labelFilter === 'All' || t.label === labelFilter);

    return (
      <div className="bg-neutral-50 min-h-screen pb-20">
        <div className="bg-white p-4 flex items-center justify-between border-b border-neutral-100">
          <h1 className="text-xl font-bold text-neutral-900">Driving log</h1>
          <button className="text-neutral-600"><Filter size={20} /></button>
        </div>

        <div className="bg-white p-4 border-b border-neutral-100">
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
            {['All', 'Business', 'Private', 'Unspecified'].map(label => (
              <button
                key={label}
                onClick={() => setLabelFilter(label)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  labelFilter === label 
                    ? 'bg-trackmondo text-white' 
                    : label === 'Unspecified' 
                      ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                      : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between">
            <div className="text-xs font-bold text-amber-900">3 trips need a label</div>
            <button className="text-xs font-bold text-amber-700">Show →</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {trips.map(trip => (
            <div key={trip.id} className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900">{MOCK_VEHICLES.find(v => v.id === trip.vehicleId)?.regNumber}</span>
                    <span className="text-[10px] font-medium text-neutral-500">{trip.driverName}</span>
                  </div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase">{trip.date} • {trip.startTime}</div>
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="flex flex-col items-center py-1">
                    <div className="w-2 h-2 rounded-full bg-neutral-300" />
                    <div className="w-0.5 h-6 bg-neutral-100 my-1" />
                    <div className={`w-2 h-2 rounded-full ${
                      trip.label === 'Business' ? 'bg-blue-500' : 
                      trip.label === 'Private' ? 'bg-amber-500' : 'border-2 border-dashed border-neutral-400'
                    }`} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-xs font-medium text-neutral-700 truncate">{trip.startLocation}</div>
                    <div className="text-xs font-medium text-neutral-700 truncate">
                      {trip.label === 'Unspecified' ? <span className="italic text-neutral-400">Not labelled</span> : trip.endLocation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-400 uppercase mb-4">
                  <span>{trip.distance} km</span>
                  <span>{trip.duration}</span>
                  <span>Max {trip.maxSpeed} km/h</span>
                </div>

                <div className="flex gap-2">
                  {(['Business', 'Private', 'Unspecified'] as const).map(l => (
                    <button
                      key={l}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                        trip.label === l 
                          ? l === 'Business' ? 'bg-blue-500 text-white border-blue-600' : l === 'Private' ? 'bg-amber-500 text-white border-amber-600' : 'bg-neutral-500 text-white border-neutral-600'
                          : 'bg-white text-neutral-500 border-neutral-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                {trip.labelledByDriver && (
                  <div className="mt-2 text-[9px] text-neutral-400 italic">Labelled by driver</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const GeofenceScreen = () => (
    <div className="pb-20">
      <div className="p-4 bg-white border-b border-neutral-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900">Geofence</h1>
        <button 
          onClick={() => goToScreen('draw_geofence')}
          className="bg-trackmondo text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} />
          Draw zone
        </button>
      </div>

      <div className="relative h-[30vh] bg-neutral-200">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/geofence-map/800/600')] bg-cover opacity-50" />
        {/* Zone Overlays */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-dashed border-red-500 bg-red-500/10" />
        <div className="absolute top-1/2 left-1/2 w-40 h-24 border-2 border-dashed border-blue-500 bg-blue-500/10 rotate-12" />
        
        <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
          <AlertCircle size={12} />
          1 breach
        </div>
        <div className="absolute bottom-3 right-3 bg-white/90 px-2 py-1 rounded-md text-[10px] font-bold text-neutral-700">
          {MOCK_ZONES.length} zones active
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">All zones</h2>
        <div className="space-y-4">
          {MOCK_ZONES.map(zone => (
            <div key={zone.id} className={`bg-white rounded-xl border-2 overflow-hidden ${zone.status === 'breach' ? 'border-red-500' : 'border-transparent'}`}>
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  {zone.type === 'circle' ? <Circle size={20} /> : <Square size={20} className="rotate-45" />}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-neutral-900">{zone.name}</div>
                  <div className="text-xs text-neutral-500">
                    {zone.type === 'circle' ? `${zone.radius}m radius` : 'Polygon'} • Notify on {zone.trigger}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${zone.status === 'breach' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {zone.status === 'breach' ? `${zone.breachCount} breach` : 'Clear'}
                </div>
              </div>
              <div className="bg-neutral-50 px-4 py-3 flex items-center justify-between border-t border-neutral-100">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2">
                    {zone.assignedDriverIds.slice(0, 3).map(id => (
                      <div key={id} className="w-6 h-6 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-neutral-600">
                        {MOCK_DRIVERS.find(d => d.id === id)?.initials}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-400 ml-2 uppercase">{zone.assignedDriverIds.length} drivers</span>
                </div>
                <button className="text-xs font-bold text-trackmondo">Edit →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const DrawGeofenceScreen = () => (
    <div className="bg-neutral-50 min-h-screen pb-20">
      <div className="bg-white p-4 flex items-center justify-between border-b border-neutral-100">
        <button onClick={goBack} className="flex items-center gap-1 text-sm font-bold text-neutral-600">
          <ArrowLeft size={20} />
          Geofence
        </button>
        <h1 className="text-sm font-bold text-neutral-900">New zone</h1>
        <button onClick={goBack} className="text-trackmondo font-bold text-sm">Save</button>
      </div>

      <div className="flex bg-white border-b border-neutral-100">
        {[
          { id: 'circle', icon: Circle, label: 'Circle' },
          { id: 'polygon', icon: Square, label: 'Polygon' },
          { id: 'route', icon: Navigation, label: 'Route' },
          { id: 'undo', icon: Undo2, label: 'Undo' }
        ].map(tool => (
          <button key={tool.id} className={`flex-1 py-4 flex flex-col items-center gap-1 border-b-2 transition-all ${tool.id === 'polygon' ? 'border-blue-500 text-blue-500 bg-blue-50' : 'border-transparent text-neutral-400'}`}>
            <tool.icon size={20} />
            <span className="text-[10px] font-bold uppercase">{tool.label}</span>
          </button>
        ))}
      </div>

      <div className="relative h-[40vh] bg-neutral-200">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/draw-map/800/600')] bg-cover" />
        
        {/* Drawing Overlay Placeholder */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-500 bg-blue-500/25">
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full ring-4 ring-blue-500/30" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white py-2 text-center text-[10px] font-medium">
          Tap map to add points • Tap first point to close
        </div>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Zone name</label>
          <input 
            type="text" 
            placeholder="e.g. Warehouse North"
            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-trackmondo outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Notify on</label>
          <div className="flex gap-2">
            {['Exit', 'Entry', 'Both'].map(t => (
              <button key={t} className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${t === 'Both' ? 'bg-trackmondo text-white border-trackmondo' : 'bg-white text-neutral-500 border-neutral-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Assign drivers</label>
          <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
            {MOCK_DRIVERS.map(driver => (
              <div key={driver.id} className="p-3 flex items-center gap-3">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${driver.id === 'd1' ? 'bg-blue-500 border-blue-600 text-white' : 'bg-white border-neutral-300'}`}>
                  {driver.id === 'd1' && <Check size={14} />}
                </div>
                <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-600">
                  {driver.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-neutral-900">{driver.name}</div>
                  <div className="text-[10px] text-neutral-500">{driver.assignedVehicleId ? MOCK_VEHICLES.find(v => v.id === driver.assignedVehicleId)?.regNumber : 'No vehicle'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={goBack} className="w-full bg-trackmondo text-white py-4 rounded-xl font-bold text-sm active:scale-[0.98] transition-all">
          Save zone
        </button>
      </div>
    </div>
  );

  const DriversScreen = () => {
    const [driverFilter, setDriverFilter] = useState<'all' | 'assigned' | 'free'>('all');
    const filteredDrivers = MOCK_DRIVERS.filter(d => {
      if (driverFilter === 'assigned') return d.assignedVehicleId;
      if (driverFilter === 'free') return !d.assignedVehicleId;
      return true;
    });

    return (
      <div className="pb-20">
        <div className="p-4 bg-white border-b border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-neutral-900">Drivers</h1>
            <button className="bg-trackmondo text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 active:scale-95">
              <Plus size={18} />
              Add driver
            </button>
          </div>
          <div className="flex bg-neutral-100 p-1 rounded-lg">
            {(['all', 'assigned', 'free'] as const).map(f => (
              <button
                key={f}
                onClick={() => setDriverFilter(f)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${driverFilter === f ? 'bg-white text-trackmondo shadow-sm' : 'text-neutral-500'}`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} ({
                  f === 'all' ? MOCK_DRIVERS.length : 
                  f === 'assigned' ? MOCK_DRIVERS.filter(d => d.assignedVehicleId).length : 
                  MOCK_DRIVERS.filter(d => !d.assignedVehicleId).length
                })
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {filteredDrivers.map(driver => {
            const vehicle = MOCK_VEHICLES.find(v => v.id === driver.assignedVehicleId);
            const statusColors = {
              moving: 'bg-green-500',
              idle: 'bg-amber-500',
              breach: 'bg-red-500',
              offline: 'bg-neutral-400'
            };

            return (
              <div key={driver.id} className={`bg-white rounded-xl border-2 overflow-hidden transition-all active:scale-[0.98] ${driver.status === 'breach' ? 'border-red-500' : 'border-transparent'}`}>
                {/* Layer 1 */}
                <div className="p-4 flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${statusColors[driver.status]}`}>
                    {driver.initials}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-neutral-900">{driver.name}</div>
                    <div className="text-xs text-neutral-500">{driver.phone}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    driver.status === 'moving' ? 'bg-green-100 text-green-700' : 
                    driver.status === 'breach' ? 'bg-red-100 text-red-700' : 
                    driver.status === 'idle' ? 'bg-amber-100 text-amber-700' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {driver.status}
                  </div>
                </div>

                {/* Layer 2 */}
                <div className="bg-neutral-50 px-4 py-3 flex items-center justify-between border-t border-neutral-100">
                  <div className="flex items-center gap-3">
                    {vehicle ? (
                      <>
                        <Truck size={18} className="text-neutral-400" />
                        <div>
                          <div className="text-xs font-bold text-neutral-700">{vehicle.regNumber} • {vehicle.type}</div>
                          <div className="text-[10px] text-neutral-500">{vehicle.status === 'moving' ? `${vehicle.speed} km/h` : 'Idle for 12m'}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-5 h-5 border-2 border-dashed border-neutral-300 rounded" />
                        <span className="text-xs italic text-neutral-400 font-medium">No vehicle assigned</span>
                      </>
                    )}
                  </div>
                  <button className={`text-xs font-bold flex items-center gap-1 ${driver.status === 'breach' ? 'text-red-500' : 'text-trackmondo'}`}>
                    {vehicle ? (driver.status === 'breach' ? 'Alert →' : 'Track →') : 'Assign →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const AlertDetailScreen = () => {
    if (!selectedAlert) return null;
    const vehicle = MOCK_VEHICLES.find(v => v.regNumber === selectedAlert.vehicleReg);

    return (
      <div className="bg-neutral-50 min-h-screen pb-20">
        <div className="bg-white p-4 flex items-center justify-between border-b border-neutral-100">
          <button onClick={goBack} className="flex items-center gap-1 text-sm font-bold text-neutral-600">
            <ArrowLeft size={20} />
            Alarms
          </button>
          <h1 className="text-sm font-bold text-neutral-900">Breach alert</h1>
          <div className="w-5" />
        </div>

        <div className="bg-red-500 p-6 text-white">
          <div className="text-lg font-bold mb-1">{selectedAlert.description}</div>
          <div className="text-xs font-medium opacity-90">{selectedAlert.driverName} exited at 08:42 • 5 min ago</div>
        </div>

        <div className="relative h-[30vh] bg-neutral-200">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/breach-map/800/600')] bg-cover" />
          {/* Zone Boundary */}
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full border-4 border-dashed border-red-500 bg-red-500/10" />
          {/* Vehicle Position */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg" />
              <div className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-75" />
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded text-[8px] font-bold text-neutral-900 shadow-sm">
                Current position
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-px bg-neutral-100">
          {[
            { label: 'Driver name', value: selectedAlert.driverName },
            { label: 'Vehicle', value: `${vehicle?.regNumber} • ${vehicle?.type}` },
            { label: 'Zone breached', value: 'Zone A', color: 'text-red-500' },
            { label: 'Speed at breach', value: '62 km/h' },
            { label: 'Distance outside', value: '1.2 km' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-500">{item.label}</span>
              <span className={`text-sm font-bold ${item.color || 'text-neutral-900'}`}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="p-4 flex gap-3">
          <button className="flex-1 bg-red-500 text-white py-4 rounded-xl font-bold text-sm active:scale-95">Call driver</button>
          <button className="flex-1 bg-blue-500 text-white py-4 rounded-xl font-bold text-sm active:scale-95">Track live</button>
          <button onClick={goBack} className="flex-1 bg-white text-neutral-500 border border-neutral-200 py-4 rounded-xl font-bold text-sm active:bg-neutral-50">Dismiss</button>
        </div>
      </div>
    );
  };

  const MoreScreen = () => (
    <div className="pb-20">
      <div className="p-6 bg-white border-b border-neutral-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-xl font-bold text-neutral-600">
          JD
        </div>
        <div>
          <h1 className="text-lg font-bold text-neutral-900">John Doe</h1>
          <p className="text-xs text-neutral-500 font-medium">Fleet Admin • Netmaxims Logistics</p>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Reports</h2>
        <div className="bg-white rounded-xl border border-neutral-100 divide-y divide-neutral-100 overflow-hidden">
          <div onClick={() => goToScreen('driving_log')} className="p-4 flex items-center justify-between active:bg-neutral-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <History size={20} className="text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700">Driving log</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold">3</div>
              <ChevronRight size={18} className="text-neutral-300" />
            </div>
          </div>
          <div className="p-4 flex items-center justify-between active:bg-neutral-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Navigation size={20} className="text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700">Economy (fuel, mileage, CO₂)</span>
            </div>
            <ChevronRight size={18} className="text-neutral-300" />
          </div>
        </div>

        <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-6 mb-3">Settings</h2>
        <div className="bg-white rounded-xl border border-neutral-100 divide-y divide-neutral-100 overflow-hidden">
          <div className="p-4 flex items-center justify-between active:bg-neutral-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700">Users</span>
            </div>
            <ChevronRight size={18} className="text-neutral-300" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderScreen = () => {
    if (currentScreen === 'can') return <CanScreen />;
    if (currentScreen === 'rutter') return <RutterScreen />;
    if (currentScreen === 'driving_log') return <DrivingLogScreen />;
    if (currentScreen === 'alert_detail') return <AlertDetailScreen />;
    if (currentScreen === 'draw_geofence') return <DrawGeofenceScreen />;

    switch (activeTab) {
      case 'home': return <DashboardScreen />;
      case 'fleet': return <FleetScreen />;
      case 'geofence': return <GeofenceScreen />;
      case 'drivers': return <DriversScreen />;
      case 'more': return <MoreScreen />;
      default: return <DashboardScreen />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-neutral-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen === 'main' ? activeTab : currentScreen}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Tab Bar - Only show on main screens */}
      {currentScreen === 'main' && (
        <nav className="bg-white border-t border-neutral-100 flex items-center px-2 pb-safe">
          <TabButton active={activeTab === 'home'} icon={LayoutDashboard} label="Home" onClick={() => setActiveTab('home')} />
          <TabButton active={activeTab === 'fleet'} icon={Truck} label="Fleet" onClick={() => setActiveTab('fleet')} />
          <TabButton active={activeTab === 'geofence'} icon={MapIcon} label="Geofence" onClick={() => setActiveTab('geofence')} />
          <TabButton active={activeTab === 'drivers'} icon={Users} label="Drivers" onClick={() => setActiveTab('drivers')} />
          <TabButton active={activeTab === 'more'} icon={MoreHorizontal} label="More" onClick={() => setActiveTab('more')} />
        </nav>
      )}
    </div>
  );
}
