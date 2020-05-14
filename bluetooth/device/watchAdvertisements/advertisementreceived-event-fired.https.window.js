// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-test.js
// META: script=/bluetooth/resources/bluetooth-fake-devices.js
'use strict';
const test_desc = `watchAdvertisements() enables 'advertisementreceived' ` +
    `events to be fired on the device object.`;

bluetooth_test(async () => {
  let {device} = await getDiscoveredHealthThermometerDevice();

  await device.watchAdvertisements();

  assert_true(device.watchingAdvertisements);

  let advertisementreceivedPromise = new Promise(resolve => {
    device.addEventListener('advertisementreceived', e => {
      assert_equals(e.device, device);
      resolve();
    });
  });

  // This advertisement packet should not cause the event to be fired.
  await fake_central.simulateAdvertisementReceived(heart_rate_ad_packet);

  await fake_central.simulateAdvertisementReceived(
      health_thermometer_ad_packet);
  await advertisementreceivedPromise;
}, test_desc);
