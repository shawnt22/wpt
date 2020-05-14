// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-test.js
// META: script=/bluetooth/resources/bluetooth-fake-devices.js
'use strict';
const test_desc = `Events are fired on correct device with multiple ` +
    `watchAdvertisements() calls.`;

bluetooth_test(async () => {
  let health_thermometer_device;
  let heart_rate_device;
  {
    let {device} = await getDiscoveredHealthThermometerDevice();
    health_thermometer_device = device;
  }
  {
    let {device} = await getHeartRateDevice(
        {requestDeviceOptions: heartRateRequestDeviceOptionsDefault});
    heart_rate_device = device;
  }

  await health_thermometer_device.watchAdvertisements();
  await heart_rate_device.watchAdvertisements();

  let advertisementreceivedHealthThermometerPromise = new Promise(resolve => {
    health_thermometer_device.addEventListener('advertisementreceived', e => {
      assert_equals(e.device, health_thermometer_device);
      resolve();
    });
  });

  let advertisementreceivedHeartRatePromise = new Promise(resolve => {
    heart_rate_device.addEventListener('advertisementreceived', e => {
      assert_equals(e.device, heart_rate_device);
      resolve();
    });
  });
  await fake_central.simulateAdvertisementReceived(heart_rate_ad_packet);
  await fake_central.simulateAdvertisementReceived(
      health_thermometer_ad_packet);

  await advertisementreceivedHealthThermometerPromise;
  await advertisementreceivedHeartRatePromise;
}, test_desc);
