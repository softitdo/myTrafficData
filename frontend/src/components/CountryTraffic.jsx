import TrafficChart from './TrafficChart';

export default function CountryTraffic({ data }) {
  return (
    <TrafficChart
      title="Traffic by country"
      data={data}
      nameKey="country"
      defaultType="bar"
    />
  );
}
