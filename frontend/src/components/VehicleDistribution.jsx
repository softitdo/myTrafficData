import TrafficChart from './TrafficChart';

export default function VehicleDistribution({ data }) {
  return (
    <TrafficChart
      title="Vehicle type distribution"
      data={data}
      nameKey="vehicle_type"
      defaultType="pie"
    />
  );
}
