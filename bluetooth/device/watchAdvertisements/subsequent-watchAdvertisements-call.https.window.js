// META: script=/resources/testdriver.js
// META: script=/resources/testdriver-vendor.js
// META: script=/bluetooth/resources/bluetooth-test.js
// META: script=/bluetooth/resources/bluetooth-fake-devices.js
'use strict';
const test_desc = 'subsequent watchAdvertisements() calls result in the ' +
    'second call resolving successfully.';

bluetooth_test(async () => {
  let {device} = await getDiscoveredHealthThermometerDevice();

  // Start a watchAdvertisements() operation.
  await device.watchAdvertisements();

  // Start a second watchAdvertisements() operation after the first one
  // resolves. This operation should resolve successfully.
  await device.watchAdvertisements();

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
