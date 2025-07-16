let map = L.map('map').setView([0, 0], 2);
L.tileLayer('./leaflet/').addTo(map);

const loadDevices = async () => {
  let res = await fetch(LIBRENMS_URL + 'devices', {
    headers: { 'X-Auth-Token': LIBRENMS_TOKEN }
  });
  let data = await res.json();
  data.devices.forEach(dev => {
    if (dev.latitude && dev.longitude) {
      let icon = L.circleMarker([dev.latitude, dev.longitude], {
        radius: 8,
        fillColor: dev.status === 1 ? 'green' : 'red',
        color: '#000',
        weight: 1,
        fillOpacity: 0.8
      });
      icon.bindPopup(`
        <b>${dev.hostname}</b><br/>
        IP: ${dev.ip}<br/>
        Status: ${dev.status === 1 ? "UP" : "DOWN"}<br/>
        Lat/Lon: ${dev.latitude}, ${dev.longitude}
      `);
      icon.addTo(map);
    }
  });
};
loadDevices();
setInterval(loadDevices, REFRESH_INTERVAL);
